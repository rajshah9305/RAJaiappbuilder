"""
Sandbox model for tracking container instances
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, JSON, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum


class SandboxStatus(enum.Enum):
    """Sandbox status enumeration"""
    CREATING = "creating"
    RUNNING = "running"
    STOPPED = "stopped"
    ERROR = "error"
    DESTROYED = "destroyed"


class Sandbox(Base):
    """Sandbox model for tracking container instances"""
    
    __tablename__ = "sandboxes"
    
    id = Column(Integer, primary_key=True, index=True)
    sandbox_id = Column(String(100), unique=True, index=True, nullable=False)  # UUID
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    generation_id = Column(Integer, ForeignKey("generations.id"), nullable=True)
    
    # Container information
    container_id = Column(String(100), nullable=True)
    image_name = Column(String(255), nullable=True)
    port = Column(Integer, nullable=True)
    url = Column(String(500), nullable=True)
    
    # Status and configuration
    status = Column(Enum(SandboxStatus), default=SandboxStatus.CREATING)
    configuration = Column(JSON, default=dict)
    
    # Resource usage
    cpu_usage = Column(String(20), nullable=True)
    memory_usage = Column(String(20), nullable=True)
    disk_usage = Column(String(20), nullable=True)
    
    # Logs and monitoring
    logs = Column(Text, nullable=True)
    error_logs = Column(Text, nullable=True)
    console_output = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True), nullable=True)
    stopped_at = Column(DateTime(timezone=True), nullable=True)
    destroyed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    project = relationship("Project", back_populates="sandboxes")
    generation = relationship("Generation")
    
    def __repr__(self):
        return f"<Sandbox(id={self.id}, sandbox_id='{self.sandbox_id}', status='{self.status.value}')>"
