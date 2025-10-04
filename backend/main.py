"""
NLP-to-App Platform - Main FastAPI Application
Enterprise-grade platform for converting natural language to applications
"""

import os
import asyncio
from contextlib import asynccontextmanager
from typing import Dict, Any, Optional
import logging

from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import uvicorn

from app.core.config import settings
from app.core.database import init_db
from app.core.redis_client import redis_client
from app.api.v1.api import api_router
from app.core.websocket_manager import websocket_manager
from app.services.sandbox_manager import SandboxManager
from app.services.ai_service import AIService
from app.services.code_generator import CodeGenerator
from app.services.self_healing import SelfHealingService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Global services
sandbox_manager: Optional[SandboxManager] = None
ai_service: Optional[AIService] = None
code_generator: Optional[CodeGenerator] = None
self_healing_service: Optional[SelfHealingService] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global sandbox_manager, ai_service, code_generator, self_healing_service
    
    logger.info("Starting NLP-to-App Platform...")
    
    # Initialize database
    await init_db()
    
    # Initialize Redis
    await redis_client.connect()
    
    # Initialize services
    sandbox_manager = SandboxManager()
    ai_service = AIService()
    code_generator = CodeGenerator(ai_service)
    self_healing_service = SelfHealingService(ai_service, sandbox_manager)
    
    # Start background tasks
    asyncio.create_task(sandbox_manager.cleanup_expired_sandboxes())
    asyncio.create_task(self_healing_service.monitor_sandboxes())
    
    logger.info("Platform started successfully")
    
    yield
    
    # Cleanup
    logger.info("Shutting down platform...")
    await redis_client.disconnect()
    if sandbox_manager:
        await sandbox_manager.cleanup_all()
    logger.info("Platform shutdown complete")


# Create FastAPI application
app = FastAPI(
    title="NLP-to-App Platform",
    description="Enterprise-grade platform for converting natural language to applications",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

# WebSocket endpoint for real-time updates
@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """WebSocket endpoint for real-time communication"""
    await websocket_manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            await websocket_manager.handle_message(client_id, data)
    except WebSocketDisconnect:
        websocket_manager.disconnect(client_id)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "services": {
            "database": "connected",
            "redis": "connected",
            "sandbox_manager": "active" if sandbox_manager else "inactive",
            "ai_service": "active" if ai_service else "inactive"
        }
    }


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with platform information"""
    return {
        "message": "NLP-to-App Platform",
        "version": "1.0.0",
        "docs": "/api/docs",
        "health": "/health"
    }


# Dependency injection for services
def get_sandbox_manager() -> SandboxManager:
    """Get sandbox manager instance"""
    if not sandbox_manager:
        raise HTTPException(status_code=503, detail="Sandbox manager not available")
    return sandbox_manager


def get_ai_service() -> AIService:
    """Get AI service instance"""
    if not ai_service:
        raise HTTPException(status_code=503, detail="AI service not available")
    return ai_service


def get_code_generator() -> CodeGenerator:
    """Get code generator instance"""
    if not code_generator:
        raise HTTPException(status_code=503, detail="Code generator not available")
    return code_generator


def get_self_healing_service() -> SelfHealingService:
    """Get self-healing service instance"""
    if not self_healing_service:
        raise HTTPException(status_code=503, detail="Self-healing service not available")
    return self_healing_service


# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "Resource not found"}
    )


@app.exception_handler(500)
async def internal_error_handler(request, exc):
    logger.error(f"Internal server error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
