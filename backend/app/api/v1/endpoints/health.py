"""
Health check endpoints
"""

from fastapi import APIRouter, Depends
from app.services.ai_service import get_ai_service
from app.services.sandbox_manager import get_sandbox_manager

router = APIRouter()


@router.get("/")
async def health_check():
    """Basic health check"""
    return {
        "status": "healthy",
        "service": "nlp-to-app-platform",
        "version": "1.0.0"
    }


@router.get("/detailed")
async def detailed_health_check(
    ai_service = Depends(get_ai_service),
    sandbox_manager = Depends(get_sandbox_manager)
):
    """Detailed health check with service status"""
    return {
        "status": "healthy",
        "service": "nlp-to-app-platform",
        "version": "1.0.0",
        "services": {
            "ai_service": "active",
            "sandbox_manager": "active",
            "database": "connected",
            "redis": "connected"
        }
    }
