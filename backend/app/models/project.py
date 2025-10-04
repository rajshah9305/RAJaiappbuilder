"""
Project model for managing user projects
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, JSON, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Project(Base):
    """Project model for user projects"""
    
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Project configuration
    project_type = Column(String(50), default="web-app")  # web-app, api, full-stack, etc.
    framework = Column(String(50), default="nextjs")  # nextjs, react, vue, etc.
    database = Column(String(50), nullable=True)  # postgresql, mysql, mongodb, etc.
    deployment = Column(String(50), default="vercel")  # vercel, aws, docker, etc.
    
    # Project settings
    settings = Column(JSON, default=dict)
    
    # Status and visibility
    is_public = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_accessed = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="projects")
    generations = relationship("Generation", back_populates="project", cascade="all, delete-orphan")
    sandboxes = relationship("Sandbox", back_populates="project", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Project(id={self.id}, name='{self.name}', user_id={self.user_id})>"
