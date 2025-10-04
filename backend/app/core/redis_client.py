"""
Redis client for caching and session management
"""

import json
import asyncio
from typing import Any, Optional, Dict, List
import redis.asyncio as redis
from redis.asyncio import Redis
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class RedisClient:
    """Async Redis client with connection management"""
    
    def __init__(self):
        self.redis: Optional[Redis] = None
        self.connected = False
    
    async def connect(self):
        """Connect to Redis"""
        try:
            self.redis = redis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5,
                retry_on_timeout=True,
            )
            await self.redis.ping()
            self.connected = True
            logger.info("Connected to Redis successfully")
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {e}")
            self.connected = False
            raise
    
    async def disconnect(self):
        """Disconnect from Redis"""
        if self.redis:
            await self.redis.close()
            self.connected = False
            logger.info("Disconnected from Redis")
    
    async def get(self, key: str) -> Optional[str]:
        """Get value by key"""
        if not self.connected or not self.redis:
            return None
        try:
            return await self.redis.get(key)
        except Exception as e:
            logger.error(f"Redis GET error for key {key}: {e}")
            return None
    
    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """Set value with optional TTL"""
        if not self.connected or not self.redis:
            return False
        try:
            if isinstance(value, (dict, list)):
                value = json.dumps(value)
            await self.redis.set(key, value, ex=ttl)
            return True
        except Exception as e:
            logger.error(f"Redis SET error for key {key}: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete key"""
        if not self.connected or not self.redis:
            return False
        try:
            await self.redis.delete(key)
            return True
        except Exception as e:
            logger.error(f"Redis DELETE error for key {key}: {e}")
            return False
    
    async def exists(self, key: str) -> bool:
        """Check if key exists"""
        if not self.connected or not self.redis:
            return False
        try:
            return await self.redis.exists(key) > 0
        except Exception as e:
            logger.error(f"Redis EXISTS error for key {key}: {e}")
            return False
    
    async def hget(self, name: str, key: str) -> Optional[str]:
        """Get hash field value"""
        if not self.connected or not self.redis:
            return None
        try:
            return await self.redis.hget(name, key)
        except Exception as e:
            logger.error(f"Redis HGET error for {name}:{key}: {e}")
            return None
    
    async def hset(self, name: str, key: str, value: Any) -> bool:
        """Set hash field value"""
        if not self.connected or not self.redis:
            return False
        try:
            if isinstance(value, (dict, list)):
                value = json.dumps(value)
            await self.redis.hset(name, key, value)
            return True
        except Exception as e:
            logger.error(f"Redis HSET error for {name}:{key}: {e}")
            return False
    
    async def hgetall(self, name: str) -> Dict[str, str]:
        """Get all hash fields"""
        if not self.connected or not self.redis:
            return {}
        try:
            return await self.redis.hgetall(name)
        except Exception as e:
            logger.error(f"Redis HGETALL error for {name}: {e}")
            return {}
    
    async def lpush(self, key: str, *values: Any) -> bool:
        """Push values to list"""
        if not self.connected or not self.redis:
            return False
        try:
            serialized_values = []
            for value in values:
                if isinstance(value, (dict, list)):
                    serialized_values.append(json.dumps(value))
                else:
                    serialized_values.append(str(value))
            await self.redis.lpush(key, *serialized_values)
            return True
        except Exception as e:
            logger.error(f"Redis LPUSH error for key {key}: {e}")
            return False
    
    async def lrange(self, key: str, start: int = 0, end: int = -1) -> List[str]:
        """Get list range"""
        if not self.connected or not self.redis:
            return []
        try:
            return await self.redis.lrange(key, start, end)
        except Exception as e:
            logger.error(f"Redis LRANGE error for key {key}: {e}")
            return []
    
    async def expire(self, key: str, seconds: int) -> bool:
        """Set key expiration"""
        if not self.connected or not self.redis:
            return False
        try:
            await self.redis.expire(key, seconds)
            return True
        except Exception as e:
            logger.error(f"Redis EXPIRE error for key {key}: {e}")
            return False
    
    async def ttl(self, key: str) -> int:
        """Get key TTL"""
        if not self.connected or not self.redis:
            return -1
        try:
            return await self.redis.ttl(key)
        except Exception as e:
            logger.error(f"Redis TTL error for key {key}: {e}")
            return -1


# Global Redis client instance
redis_client = RedisClient()
