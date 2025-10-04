"""
API v1 router configuration
"""

from fastapi import APIRouter
from app.api.v1.endpoints import auth, projects, generations, sandboxes, tests, health

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(generations.router, prefix="/generations", tags=["generations"])
api_router.include_router(sandboxes.router, prefix="/sandboxes", tags=["sandboxes"])
api_router.include_router(tests.router, prefix="/tests", tags=["tests"])
api_router.include_router(health.router, prefix="/health", tags=["health"])
