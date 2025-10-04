"""
Code Generator Service for multi-agent orchestration
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional, AsyncGenerator, Tuple
from enum import Enum

from app.services.ai_service import AIService
from app.services.sandbox_manager import SandboxManager
from app.core.websocket_manager import websocket_manager

logger = logging.getLogger(__name__)


class GenerationStatus(Enum):
    """Generation status enumeration"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class AgentRole(Enum):
    """Agent role enumeration"""
    ARCHITECT = "architect"
    FRONTEND_DEVELOPER = "frontend_developer"
    BACKEND_DEVELOPER = "backend_developer"
    TESTER = "tester"
    REVIEWER = "reviewer"


class CodeGenerator:
    """Multi-agent code generation orchestrator"""
    
    def __init__(self, ai_service: AIService):
        self.ai_service = ai_service
        self.active_generations: Dict[str, Dict[str, Any]] = {}
        self.agent_prompts = self._load_agent_prompts()
    
    def _load_agent_prompts(self) -> Dict[AgentRole, str]:
        """Load agent-specific prompts"""
        return {
            AgentRole.ARCHITECT: """You are a senior software architect. Your role is to:
1. Analyze the requirements and create a high-level architecture
2. Define the technology stack and project structure
3. Identify key components and their relationships
4. Plan the development phases
5. Ensure scalability and maintainability

Focus on creating a solid foundation for the application.""",
            
            AgentRole.FRONTEND_DEVELOPER: """You are a senior frontend developer specializing in React and TypeScript. Your role is to:
1. Create modern, responsive user interfaces
2. Implement component-based architecture
3. Ensure accessibility and user experience
4. Use modern React patterns (hooks, context, etc.)
5. Implement proper state management
6. Add animations and interactions

Focus on creating beautiful, functional user interfaces.""",
            
            AgentRole.BACKEND_DEVELOPER: """You are a senior backend developer. Your role is to:
1. Design and implement API endpoints
2. Handle data validation and sanitization
3. Implement authentication and authorization
4. Design database schemas and relationships
5. Add proper error handling and logging
6. Ensure security best practices

Focus on creating robust, secure backend services.""",
            
            AgentRole.TESTER: """You are a senior QA engineer. Your role is to:
1. Write comprehensive unit tests
2. Create integration tests
3. Implement end-to-end tests
4. Add test utilities and helpers
5. Ensure good test coverage
6. Set up testing infrastructure

Focus on creating reliable, maintainable test suites.""",
            
            AgentRole.REVIEWER: """You are a senior code reviewer. Your role is to:
1. Review code for quality and best practices
2. Identify potential issues and improvements
3. Ensure code follows standards and conventions
4. Check for security vulnerabilities
5. Verify performance optimizations
6. Ensure documentation is complete

Focus on maintaining high code quality standards."""
        }
    
    async def kickoff_crew(
        self,
        prompt: str,
        project_id: str,
        client_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Kickoff multi-agent code generation crew
        
        Args:
            prompt: Natural language description
            project_id: Project identifier
            client_id: WebSocket client ID
            context: Additional context
            
        Returns:
            Generation ID
        """
        try:
            generation_id = f"gen_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{project_id}"
            
            # Initialize generation
            self.active_generations[generation_id] = {
                "id": generation_id,
                "project_id": project_id,
                "prompt": prompt,
                "status": GenerationStatus.PENDING,
                "created_at": datetime.utcnow(),
                "client_id": client_id,
                "context": context or {},
                "agents": {},
                "artifacts": {},
                "errors": []
            }
            
            # Start generation process
            asyncio.create_task(self._run_generation_crew(generation_id))
            
            logger.info(f"Started generation crew for project {project_id}")
            return generation_id
        
        except Exception as e:
            logger.error(f"Error starting generation crew: {e}")
            raise
    
    async def _run_generation_crew(self, generation_id: str):
        """Run the multi-agent generation process"""
        try:
            generation = self.active_generations[generation_id]
            generation["status"] = GenerationStatus.IN_PROGRESS
            
            # Notify client
            if generation["client_id"]:
                await websocket_manager.send_generation_update(generation["client_id"], {
                    "generation_id": generation_id,
                    "status": "started",
                    "message": "Generation crew started"
                })
            
            # Phase 1: Architecture Planning
            await self._run_architect_agent(generation_id)
            
            # Phase 2: Frontend Development
            await self._run_frontend_agent(generation_id)
            
            # Phase 3: Backend Development
            await self._run_backend_agent(generation_id)
            
            # Phase 4: Testing
            await self._run_tester_agent(generation_id)
            
            # Phase 5: Code Review
            await self._run_reviewer_agent(generation_id)
            
            # Finalize generation
            generation["status"] = GenerationStatus.COMPLETED
            generation["completed_at"] = datetime.utcnow()
            
            # Notify client
            if generation["client_id"]:
                await websocket_manager.send_generation_update(generation["client_id"], {
                    "generation_id": generation_id,
                    "status": "completed",
                    "message": "Generation completed successfully",
                    "artifacts": generation["artifacts"]
                })
            
            logger.info(f"Generation crew completed for {generation_id}")
        
        except Exception as e:
            logger.error(f"Error in generation crew: {e}")
            generation = self.active_generations[generation_id]
            generation["status"] = GenerationStatus.FAILED
            generation["errors"].append(str(e))
            
            if generation["client_id"]:
                await websocket_manager.send_error(generation["client_id"], {
                    "generation_id": generation_id,
                    "error": str(e),
                    "message": "Generation failed"
                })
    
    async def _run_architect_agent(self, generation_id: str):
        """Run architect agent for system design"""
        try:
            generation = self.active_generations[generation_id]
            prompt = generation["prompt"]
            context = generation["context"]
            
            # Create architect prompt
            architect_prompt = f"""
{self.agent_prompts[AgentRole.ARCHITECT]}

Requirements: {prompt}

Context: {json.dumps(context, indent=2)}

Please create a comprehensive architecture plan including:
1. Technology stack selection
2. Project structure
3. Component architecture
4. Data flow design
5. API design
6. Database schema
7. Security considerations
8. Performance optimizations
9. Deployment strategy
10. Development phases

Provide detailed specifications that other agents can follow.
"""
            
            # Generate architecture
            architecture_result = ""
            async for chunk in self.ai_service.generate_code(architect_prompt, context, stream=True):
                if chunk["type"] == "chunk":
                    architecture_result += chunk["content"]
                elif chunk["type"] == "complete":
                    architecture_result = chunk["content"]
                    break
            
            # Store architecture
            generation["agents"]["architect"] = {
                "role": AgentRole.ARCHITECT.value,
                "result": architecture_result,
                "completed_at": datetime.utcnow()
            }
            
            # Update artifacts
            generation["artifacts"]["architecture"] = architecture_result
            
            # Notify client
            if generation["client_id"]:
                await websocket_manager.send_generation_update(generation["client_id"], {
                    "generation_id": generation_id,
                    "phase": "architecture",
                    "status": "completed",
                    "message": "Architecture planning completed"
                })
        
        except Exception as e:
            logger.error(f"Error in architect agent: {e}")
            raise
    
    async def _run_frontend_agent(self, generation_id: str):
        """Run frontend developer agent"""
        try:
            generation = self.active_generations[generation_id]
            architecture = generation["artifacts"].get("architecture", "")
            
            # Create frontend prompt
            frontend_prompt = f"""
{self.agent_prompts[AgentRole.FRONTEND_DEVELOPER]}

Architecture: {architecture}

Please create the complete frontend application including:
1. React components with TypeScript
2. Modern UI with Tailwind CSS
3. State management setup
4. Routing configuration
5. Form handling and validation
6. API integration
7. Error boundaries
8. Loading states
9. Responsive design
10. Accessibility features

Generate complete, production-ready frontend code.
"""
            
            # Generate frontend code
            frontend_result = ""
            async for chunk in self.ai_service.generate_code(frontend_prompt, generation["context"], stream=True):
                if chunk["type"] == "chunk":
                    frontend_result += chunk["content"]
                elif chunk["type"] == "complete":
                    frontend_result = chunk["content"]
                    break
            
            # Store frontend code
            generation["agents"]["frontend"] = {
                "role": AgentRole.FRONTEND_DEVELOPER.value,
                "result": frontend_result,
                "completed_at": datetime.utcnow()
            }
            
            # Update artifacts
            generation["artifacts"]["frontend"] = frontend_result
            
            # Notify client
            if generation["client_id"]:
                await websocket_manager.send_generation_update(generation["client_id"], {
                    "generation_id": generation_id,
                    "phase": "frontend",
                    "status": "completed",
                    "message": "Frontend development completed"
                })
        
        except Exception as e:
            logger.error(f"Error in frontend agent: {e}")
            raise
    
    async def _run_backend_agent(self, generation_id: str):
        """Run backend developer agent"""
        try:
            generation = self.active_generations[generation_id]
            architecture = generation["artifacts"].get("architecture", "")
            
            # Create backend prompt
            backend_prompt = f"""
{self.agent_prompts[AgentRole.BACKEND_DEVELOPER]}

Architecture: {architecture}

Please create the complete backend application including:
1. API endpoints with proper HTTP methods
2. Database models and migrations
3. Authentication and authorization
4. Input validation and sanitization
5. Error handling and logging
6. Security middleware
7. Rate limiting
8. CORS configuration
9. Environment configuration
10. Documentation

Generate complete, production-ready backend code.
"""
            
            # Generate backend code
            backend_result = ""
            async for chunk in self.ai_service.generate_code(backend_prompt, generation["context"], stream=True):
                if chunk["type"] == "chunk":
                    backend_result += chunk["content"]
                elif chunk["type"] == "complete":
                    backend_result = chunk["content"]
                    break
            
            # Store backend code
            generation["agents"]["backend"] = {
                "role": AgentRole.BACKEND_DEVELOPER.value,
                "result": backend_result,
                "completed_at": datetime.utcnow()
            }
            
            # Update artifacts
            generation["artifacts"]["backend"] = backend_result
            
            # Notify client
            if generation["client_id"]:
                await websocket_manager.send_generation_update(generation["client_id"], {
                    "generation_id": generation_id,
                    "phase": "backend",
                    "status": "completed",
                    "message": "Backend development completed"
                })
        
        except Exception as e:
            logger.error(f"Error in backend agent: {e}")
            raise
    
    async def _run_tester_agent(self, generation_id: str):
        """Run tester agent for test generation"""
        try:
            generation = self.active_generations[generation_id]
            frontend_code = generation["artifacts"].get("frontend", "")
            backend_code = generation["artifacts"].get("backend", "")
            
            # Create tester prompt
            tester_prompt = f"""
{self.agent_prompts[AgentRole.TESTER]}

Frontend Code: {frontend_code[:2000]}...
Backend Code: {backend_code[:2000]}...

Please create comprehensive test suites including:
1. Unit tests for all components and functions
2. Integration tests for API endpoints
3. End-to-end tests for user workflows
4. Test utilities and helpers
5. Mock data and fixtures
6. Test configuration files
7. Coverage reporting setup
8. Performance tests
9. Security tests
10. Accessibility tests

Generate complete, production-ready test code.
"""
            
            # Generate tests
            test_result = ""
            async for chunk in self.ai_service.generate_code(tester_prompt, generation["context"], stream=True):
                if chunk["type"] == "chunk":
                    test_result += chunk["content"]
                elif chunk["type"] == "complete":
                    test_result = chunk["content"]
                    break
            
            # Store tests
            generation["agents"]["tester"] = {
                "role": AgentRole.TESTER.value,
                "result": test_result,
                "completed_at": datetime.utcnow()
            }
            
            # Update artifacts
            generation["artifacts"]["tests"] = test_result
            
            # Notify client
            if generation["client_id"]:
                await websocket_manager.send_generation_update(generation["client_id"], {
                    "generation_id": generation_id,
                    "phase": "testing",
                    "status": "completed",
                    "message": "Test generation completed"
                })
        
        except Exception as e:
            logger.error(f"Error in tester agent: {e}")
            raise
    
    async def _run_reviewer_agent(self, generation_id: str):
        """Run reviewer agent for code review"""
        try:
            generation = self.active_generations[generation_id]
            all_code = "\n\n".join([
                generation["artifacts"].get("frontend", ""),
                generation["artifacts"].get("backend", ""),
                generation["artifacts"].get("tests", "")
            ])
            
            # Create reviewer prompt
            reviewer_prompt = f"""
{self.agent_prompts[AgentRole.REVIEWER]}

Generated Code: {all_code[:3000]}...

Please review the generated code and provide:
1. Code quality assessment
2. Security vulnerability analysis
3. Performance optimization suggestions
4. Best practices compliance
5. Documentation completeness
6. Error handling review
7. Accessibility compliance
8. SEO considerations
9. Browser compatibility
10. Final recommendations

Provide a comprehensive code review.
"""
            
            # Generate review
            review_result = ""
            async for chunk in self.ai_service.generate_code(reviewer_prompt, generation["context"], stream=True):
                if chunk["type"] == "chunk":
                    review_result += chunk["content"]
                elif chunk["type"] == "complete":
                    review_result = chunk["content"]
                    break
            
            # Store review
            generation["agents"]["reviewer"] = {
                "role": AgentRole.REVIEWER.value,
                "result": review_result,
                "completed_at": datetime.utcnow()
            }
            
            # Update artifacts
            generation["artifacts"]["review"] = review_result
            
            # Notify client
            if generation["client_id"]:
                await websocket_manager.send_generation_update(generation["client_id"], {
                    "generation_id": generation_id,
                    "phase": "review",
                    "status": "completed",
                    "message": "Code review completed"
                })
        
        except Exception as e:
            logger.error(f"Error in reviewer agent: {e}")
            raise
    
    async def get_generation_status(self, generation_id: str) -> Optional[Dict[str, Any]]:
        """Get generation status"""
        if generation_id not in self.active_generations:
            return None
        
        generation = self.active_generations[generation_id]
        return {
            "id": generation_id,
            "project_id": generation["project_id"],
            "status": generation["status"].value,
            "created_at": generation["created_at"].isoformat(),
            "completed_at": generation.get("completed_at", {}).isoformat() if generation.get("completed_at") else None,
            "agents": {
                role: {
                    "completed_at": agent["completed_at"].isoformat(),
                    "role": agent["role"]
                }
                for role, agent in generation["agents"].items()
            },
            "artifacts": list(generation["artifacts"].keys()),
            "errors": generation["errors"]
        }
    
    async def get_generation_artifacts(self, generation_id: str) -> Optional[Dict[str, Any]]:
        """Get generation artifacts"""
        if generation_id not in self.active_generations:
            return None
        
        generation = self.active_generations[generation_id]
        return generation["artifacts"]
    
    async def cancel_generation(self, generation_id: str) -> bool:
        """Cancel active generation"""
        if generation_id not in self.active_generations:
            return False
        
        generation = self.active_generations[generation_id]
        generation["status"] = GenerationStatus.CANCELLED
        
        # Notify client
        if generation["client_id"]:
            await websocket_manager.send_generation_update(generation["client_id"], {
                "generation_id": generation_id,
                "status": "cancelled",
                "message": "Generation cancelled"
            })
        
        return True
    
    async def list_generations(self) -> List[Dict[str, Any]]:
        """List all generations"""
        return [
            await self.get_generation_status(gen_id)
            for gen_id in self.active_generations.keys()
        ]
