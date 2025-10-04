"""
AI Service for Cerebras integration and prompt management
"""

import os
import asyncio
import json
import hashlib
from typing import Dict, List, Any, Optional, AsyncGenerator, Tuple
import logging
from datetime import datetime, timedelta

import httpx
from cerebras.cloud.sdk import Cerebras
from jinja2 import Template, Environment, FileSystemLoader
import chromadb
from chromadb.config import Settings as ChromaSettings

from app.core.config import settings
from app.core.redis_client import redis_client

logger = logging.getLogger(__name__)


class AIService:
    """AI service for code generation using Cerebras"""
    
    def __init__(self):
        self.cerebras_client = Cerebras(api_key=settings.CEREBRAS_API_KEY)
        self.jinja_env = Environment(loader=FileSystemLoader("app/prompts"))
        self.vector_db = None
        self._init_vector_db()
    
    def _init_vector_db(self):
        """Initialize vector database for prompt caching"""
        try:
            self.vector_db = chromadb.Client(ChromaSettings(
                persist_directory="./chroma_db",
                anonymized_telemetry=False
            ))
            # Create or get collection for prompt caching
            self.prompt_collection = self.vector_db.get_or_create_collection(
                name="prompt_cache",
                metadata={"description": "Cached prompt embeddings for similarity search"}
            )
            logger.info("Vector database initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize vector database: {e}")
            self.vector_db = None
    
    async def generate_code(
        self,
        prompt: str,
        context: Optional[Dict[str, Any]] = None,
        stream: bool = False
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Generate code using Cerebras AI with streaming support
        
        Args:
            prompt: Natural language description
            context: Additional context for generation
            stream: Whether to stream the response
            
        Yields:
            Dict containing generation chunks or final result
        """
        try:
            # Check cache first
            cached_result = await self._get_cached_generation(prompt)
            if cached_result:
                yield {
                    "type": "cached",
                    "content": cached_result,
                    "timestamp": datetime.utcnow().isoformat()
                }
                return
            
            # Prepare system prompt
            system_prompt = await self._load_prompt_template("system_prompt.j2", context or {})
            
            # Prepare messages
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ]
            
            # Generate with Cerebras
            if stream:
                async for chunk in self._stream_generation(messages):
                    yield chunk
            else:
                result = await self._generate_completion(messages)
                yield result
                
                # Cache the result
                await self._cache_generation(prompt, result)
        
        except Exception as e:
            logger.error(f"Error in code generation: {e}")
            yield {
                "type": "error",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
    
    async def _stream_generation(self, messages: List[Dict[str, str]]) -> AsyncGenerator[Dict[str, Any], None]:
        """Stream generation from Cerebras"""
        try:
            stream = self.cerebras_client.chat.completions.create(
                messages=messages,
                model=settings.CEREBRAS_MODEL,
                stream=True,
                max_completion_tokens=settings.CEREBRAS_MAX_TOKENS,
                temperature=settings.CEREBRAS_TEMPERATURE,
                top_p=settings.CEREBRAS_TOP_P,
                reasoning_effort=settings.CEREBRAS_REASONING_EFFORT
            )
            
            accumulated_content = ""
            
            for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    accumulated_content += content
                    
                    yield {
                        "type": "chunk",
                        "content": content,
                        "accumulated": accumulated_content,
                        "timestamp": datetime.utcnow().isoformat()
                    }
            
            # Final result
            yield {
                "type": "complete",
                "content": accumulated_content,
                "timestamp": datetime.utcnow().isoformat()
            }
        
        except Exception as e:
            logger.error(f"Error in streaming generation: {e}")
            yield {
                "type": "error",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
    
    async def _generate_completion(self, messages: List[Dict[str, str]]) -> Dict[str, Any]:
        """Generate completion without streaming"""
        try:
            response = self.cerebras_client.chat.completions.create(
                messages=messages,
                model=settings.CEREBRAS_MODEL,
                stream=False,
                max_completion_tokens=settings.CEREBRAS_MAX_TOKENS,
                temperature=settings.CEREBRAS_TEMPERATURE,
                top_p=settings.CEREBRAS_TOP_P,
                reasoning_effort=settings.CEREBRAS_REASONING_EFFORT
            )
            
            return {
                "type": "complete",
                "content": response.choices[0].message.content,
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "total_tokens": response.usage.total_tokens
                },
                "timestamp": datetime.utcnow().isoformat()
            }
        
        except Exception as e:
            logger.error(f"Error in completion generation: {e}")
            return {
                "type": "error",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
    
    async def _load_prompt_template(self, template_name: str, context: Dict[str, Any]) -> str:
        """Load and render prompt template"""
        try:
            template = self.jinja_env.get_template(template_name)
            return template.render(**context)
        except Exception as e:
            logger.error(f"Error loading template {template_name}: {e}")
            # Fallback to basic system prompt
            return self._get_fallback_system_prompt()
    
    def _get_fallback_system_prompt(self) -> str:
        """Fallback system prompt if template loading fails"""
        return """You are an expert full-stack developer specializing in creating modern web applications.

Your task is to generate clean, production-ready code based on natural language descriptions.

Guidelines:
1. Generate complete, functional applications
2. Use modern frameworks (React, Next.js, TypeScript)
3. Include proper error handling and validation
4. Write clean, readable, and maintainable code
5. Include necessary dependencies and imports
6. Follow best practices for security and performance
7. Generate responsive, accessible UI components
8. Include proper TypeScript types
9. Add comments for complex logic
10. Ensure the code is production-ready

Always provide complete, runnable code that can be deployed immediately."""
    
    async def _get_cached_generation(self, prompt: str) -> Optional[str]:
        """Get cached generation result"""
        if not self.vector_db:
            return None
        
        try:
            # Create hash of prompt for exact matching
            prompt_hash = hashlib.sha256(prompt.encode()).hexdigest()
            
            # Check Redis cache first
            cached = await redis_client.get(f"generation:{prompt_hash}")
            if cached:
                return cached
            
            # Check vector similarity
            results = self.prompt_collection.query(
                query_texts=[prompt],
                n_results=1,
                include=["documents", "metadatas"]
            )
            
            if results["documents"] and results["documents"][0]:
                # Check if similarity is high enough
                if results["distances"][0][0] < 0.1:  # High similarity threshold
                    cached_result = results["documents"][0][0]
                    # Cache in Redis for faster access
                    await redis_client.set(f"generation:{prompt_hash}", cached_result, ttl=settings.CACHE_TTL)
                    return cached_result
            
            return None
        
        except Exception as e:
            logger.error(f"Error getting cached generation: {e}")
            return None
    
    async def _cache_generation(self, prompt: str, result: Dict[str, Any]):
        """Cache generation result"""
        if not self.vector_db:
            return
        
        try:
            content = result.get("content", "")
            if not content:
                return
            
            # Create hash for exact matching
            prompt_hash = hashlib.sha256(prompt.encode()).hexdigest()
            
            # Cache in Redis
            await redis_client.set(f"generation:{prompt_hash}", content, ttl=settings.CACHE_TTL)
            
            # Store in vector database for similarity search
            self.prompt_collection.add(
                documents=[content],
                metadatas=[{
                    "prompt": prompt,
                    "prompt_hash": prompt_hash,
                    "timestamp": datetime.utcnow().isoformat(),
                    "model": settings.CEREBRAS_MODEL
                }],
                ids=[prompt_hash]
            )
            
            logger.info(f"Cached generation for prompt hash: {prompt_hash}")
        
        except Exception as e:
            logger.error(f"Error caching generation: {e}")
    
    async def generate_tests(self, code: str, test_framework: str = "jest") -> str:
        """Generate unit tests for the provided code"""
        try:
            test_prompt = f"""Generate comprehensive unit tests for the following code using {test_framework}:

```typescript
{code}
```

Requirements:
1. Test all functions and components
2. Include edge cases and error scenarios
3. Use proper mocking where needed
4. Follow testing best practices
5. Ensure good coverage
6. Include setup and teardown if needed

Generate complete, runnable test files."""
            
            messages = [
                {"role": "system", "content": "You are an expert test engineer. Generate comprehensive, production-ready unit tests."},
                {"role": "user", "content": test_prompt}
            ]
            
            result = await self._generate_completion(messages)
            return result.get("content", "")
        
        except Exception as e:
            logger.error(f"Error generating tests: {e}")
            return ""
    
    async def fix_code_errors(self, code: str, error_message: str) -> str:
        """Fix code errors using AI"""
        try:
            fix_prompt = f"""Fix the following code error:

Code:
```typescript
{code}
```

Error:
{error_message}

Requirements:
1. Fix the specific error
2. Maintain code functionality
3. Follow best practices
4. Add error handling if needed
5. Ensure the fix is minimal and targeted

Provide the corrected code."""
            
            messages = [
                {"role": "system", "content": "You are an expert debugger. Fix code errors while maintaining functionality and best practices."},
                {"role": "user", "content": fix_prompt}
            ]
            
            result = await self._generate_completion(messages)
            return result.get("content", "")
        
        except Exception as e:
            logger.error(f"Error fixing code: {e}")
            return code
    
    async def optimize_code(self, code: str) -> str:
        """Optimize code for performance and best practices"""
        try:
            optimize_prompt = f"""Optimize the following code for performance, readability, and best practices:

```typescript
{code}
```

Requirements:
1. Improve performance where possible
2. Enhance readability and maintainability
3. Follow TypeScript best practices
4. Add proper error handling
5. Optimize imports and dependencies
6. Ensure accessibility
7. Add proper documentation

Provide the optimized code."""
            
            messages = [
                {"role": "system", "content": "You are an expert code optimizer. Improve code quality, performance, and maintainability."},
                {"role": "user", "content": optimize_prompt}
            ]
            
            result = await self._generate_completion(messages)
            return result.get("content", "")
        
        except Exception as e:
            logger.error(f"Error optimizing code: {e}")
            return code
    
    async def explain_code(self, code: str) -> str:
        """Generate explanation for code"""
        try:
            explain_prompt = f"""Explain the following code in detail:

```typescript
{code}
```

Provide:
1. High-level overview
2. Function-by-function explanation
3. Key concepts and patterns used
4. Dependencies and their purposes
5. Potential improvements or considerations"""
            
            messages = [
                {"role": "system", "content": "You are an expert code reviewer. Provide clear, detailed explanations of code."},
                {"role": "user", "content": explain_prompt}
            ]
            
            result = await self._generate_completion(messages)
            return result.get("content", "")
        
        except Exception as e:
            logger.error(f"Error explaining code: {e}")
            return "Unable to explain code due to an error."
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the AI model"""
        return {
            "model": settings.CEREBRAS_MODEL,
            "max_tokens": settings.CEREBRAS_MAX_TOKENS,
            "temperature": settings.CEREBRAS_TEMPERATURE,
            "top_p": settings.CEREBRAS_TOP_P,
            "reasoning_effort": settings.CEREBRAS_REASONING_EFFORT,
            "caching_enabled": self.vector_db is not None,
            "streaming_enabled": True
        }
