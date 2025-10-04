"""
Project endpoints
"""

from typing import Dict, List, Any
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.project import Project
from sqlalchemy.future import select
from sqlalchemy.exc import NoResultFound
from datetime import datetime

router = APIRouter()


class ProjectCreate(BaseModel):
    """Project creation model"""
    name: str
    description: str = None
    project_type: str = "web-app"
    framework: str = "nextjs"


class ProjectResponse(BaseModel):
    """Project response model"""
    id: int
    name: str
    description: str = None
    project_type: str
    framework: str
    created_at: str


@router.post("/", response_model=ProjectResponse)
async def create_project(
    project_data: ProjectCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new project"""
    # TODO: Replace with actual user_id from auth
    user_id = 1
    new_project = Project(
        name=project_data.name,
        description=project_data.description,
        project_type=project_data.project_type,
        framework=project_data.framework,
        user_id=user_id,
        created_at=datetime.utcnow()
    )
    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)
    return ProjectResponse(
        id=new_project.id,
        name=new_project.name,
        description=new_project.description,
        project_type=new_project.project_type,
        framework=new_project.framework,
        created_at=new_project.created_at.isoformat()
    )


@router.get("/", response_model=List[ProjectResponse])
async def list_projects(
    db: AsyncSession = Depends(get_db)
):
    """List user projects"""
    # TODO: Replace with actual user_id from auth
    user_id = 1
    result = await db.execute(select(Project).where(Project.user_id == user_id))
    projects = result.scalars().all()
    return [
        ProjectResponse(
            id=p.id,
            name=p.name,
            description=p.description,
            project_type=p.project_type,
            framework=p.framework,
            created_at=p.created_at.isoformat()
        ) for p in projects
    ]


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get project details"""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return ProjectResponse(
        id=project.id,
        name=project.name,
        description=project.description,
        project_type=project.project_type,
        framework=project.framework,
        created_at=project.created_at.isoformat()
    )


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project_data: ProjectCreate,
    db: AsyncSession = Depends(get_db)
):
    """Update project"""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project.name = project_data.name
    project.description = project_data.description
    project.project_type = project_data.project_type
    project.framework = project_data.framework
    project.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(project)
    return ProjectResponse(
        id=project.id,
        name=project.name,
        description=project.description,
        project_type=project.project_type,
        framework=project.framework,
        created_at=project.created_at.isoformat()
    )


@router.delete("/{project_id}")
async def delete_project(
    project_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Delete project"""
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    await db.delete(project)
    await db.commit()
    return {"message": "Project deleted successfully"}
