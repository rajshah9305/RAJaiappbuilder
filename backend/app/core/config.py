"""
Configuration settings for the NLP-to-App Platform
"""

import os
from typing import List, Optional
from pydantic import BaseSettings, validator


class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    APP_NAME: str = "NLP-to-App Platform"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # API Configuration
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/nlptoapp")
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # Cerebras AI
    CEREBRAS_API_KEY: str = os.getenv("CEREBRAS_API_KEY", "")
    CEREBRAS_MODEL: str = "gpt-oss-120b"
    CEREBRAS_MAX_TOKENS: int = 65536
    CEREBRAS_TEMPERATURE: float = 1.0
    CEREBRAS_TOP_P: float = 1.0
    CEREBRAS_REASONING_EFFORT: str = "medium"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://nlp-to-app.vercel.app"
    ]
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # Sandbox Configuration
    SANDBOX_TIMEOUT: int = 300  # 5 minutes
    MAX_CONCURRENT_SANDBOXES: int = 10
    SANDBOX_IMAGE: str = "node:18-alpine"
    
    # Docker
    DOCKER_HOST: str = os.getenv("DOCKER_HOST", "unix:///var/run/docker.sock")
    
    # Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "your-jwt-secret")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 30
    
    # File Upload
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_FILE_TYPES: List[str] = [".js", ".ts", ".jsx", ".tsx", ".json", ".css", ".html"]
    
    # Monitoring
    SENTRY_DSN: Optional[str] = os.getenv("SENTRY_DSN")
    
    # External Services
    GITHUB_TOKEN: Optional[str] = os.getenv("GITHUB_TOKEN")
    VERCEL_TOKEN: Optional[str] = os.getenv("VERCEL_TOKEN")
    
    # Cache Configuration
    CACHE_TTL: int = 3600  # 1 hour
    VECTOR_CACHE_SIZE: int = 1000
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 3600  # 1 hour
    
    # Self-Healing
    AUTO_FIX_ENABLED: bool = True
    MAX_RETRY_ATTEMPTS: int = 3
    RETRY_DELAY: int = 5  # seconds
    
    # Code Quality
    ESLINT_ENABLED: bool = True
    PRETTIER_ENABLED: bool = True
    TYPESCRIPT_ENABLED: bool = True
    
    # Testing
    TEST_GENERATION_ENABLED: bool = True
    E2E_TEST_ENABLED: bool = True
    
    # Deployment
    DEPLOYMENT_ENABLED: bool = True
    AUTO_DEPLOY: bool = False
    
    @validator("CEREBRAS_API_KEY")
    def validate_cerebras_key(cls, v):
        if not v:
            raise ValueError("CEREBRAS_API_KEY is required")
        return v
    
    @validator("DATABASE_URL")
    def validate_database_url(cls, v):
        if not v.startswith(("postgresql://", "postgres://")):
            raise ValueError("DATABASE_URL must be a valid PostgreSQL URL")
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
