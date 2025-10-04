"""
Test result model for tracking test execution
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, JSON, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum


class TestStatus(enum.Enum):
    """Test status enumeration"""
    PENDING = "pending"
    RUNNING = "running"
    PASSED = "passed"
    FAILED = "failed"
    ERROR = "error"
    SKIPPED = "skipped"


class TestType(enum.Enum):
    """Test type enumeration"""
    UNIT = "unit"
    INTEGRATION = "integration"
    E2E = "e2e"
    PERFORMANCE = "performance"
    SECURITY = "security"


class TestResult(Base):
    """Test result model for tracking test execution"""
    
    __tablename__ = "test_results"
    
    id = Column(Integer, primary_key=True, index=True)
    generation_id = Column(Integer, ForeignKey("generations.id"), nullable=False)
    sandbox_id = Column(String(100), nullable=True)  # Reference to sandbox
    
    # Test information
    test_name = Column(String(255), nullable=False)
    test_type = Column(Enum(TestType), default=TestType.UNIT)
    status = Column(Enum(TestStatus), default=TestStatus.PENDING)
    
    # Test configuration
    test_framework = Column(String(50), default="jest")  # jest, vitest, playwright, etc.
    test_file = Column(String(500), nullable=True)
    test_command = Column(String(500), nullable=True)
    
    # Test results
    passed_tests = Column(Integer, default=0)
    failed_tests = Column(Integer, default=0)
    skipped_tests = Column(Integer, default=0)
    total_tests = Column(Integer, default=0)
    
    # Execution details
    execution_time = Column(Integer, nullable=True)  # Time in seconds
    output = Column(Text, nullable=True)
    error_output = Column(Text, nullable=True)
    coverage_report = Column(JSON, nullable=True)
    
    # Performance metrics
    cpu_usage = Column(String(20), nullable=True)
    memory_usage = Column(String(20), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    generation = relationship("Generation", back_populates="test_results")
    
    def __repr__(self):
        return f"<TestResult(id={self.id}, test_name='{self.test_name}', status='{self.status.value}')>"
