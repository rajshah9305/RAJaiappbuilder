"""
Generation model for tracking code generation sessions
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, JSON, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum


class GenerationStatus(enum.Enum):
    """Generation status enumeration"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class Generation(Base):
    """Generation model for tracking code generation sessions"""
    
    __tablename__ = "generations"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Generation details
    prompt = Column(Text, nullable=False)
    context = Column(JSON, default=dict)
    status = Column(Enum(GenerationStatus), default=GenerationStatus.PENDING)
    
    # AI model information
    model_name = Column(String(100), nullable=True)
    model_version = Column(String(50), nullable=True)
    temperature = Column(String(10), nullable=True)
    max_tokens = Column(Integer, nullable=True)
    
    # Generation results
    artifacts = Column(JSON, default=dict)  # Generated code, tests, etc.
    errors = Column(JSON, default=list)  # Any errors encountered
    
    # Performance metrics
    tokens_used = Column(Integer, default=0)
    generation_time = Column(Integer, nullable=True)  # Time in seconds
    cost = Column(String(20), nullable=True)  # Cost in USD
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    project = relationship("Project", back_populates="generations")
    user = relationship("User")
    test_results = relationship("TestResult", back_populates="generation", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Generation(id={self.id}, project_id={self.project_id}, status='{self.status.value}')>"
