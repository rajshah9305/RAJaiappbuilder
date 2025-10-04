"""
WebSocket connection manager for real-time communication
"""

import json
import asyncio
from typing import Dict, List, Any, Optional
from fastapi import WebSocket
import logging
from app.services.ai_service import AIService
from app.services.code_generator import CodeGenerator

logger = logging.getLogger(__name__)


class ConnectionManager:
    """Manages WebSocket connections and message routing"""
    
    def __init__(self):
        # Active connections: client_id -> websocket
        self.active_connections: Dict[str, WebSocket] = {}
        # Connection metadata: client_id -> metadata
        self.connection_metadata: Dict[str, Dict[str, Any]] = {}
        # Message queues for each client
        self.message_queues: Dict[str, asyncio.Queue] = {}
    
    async def connect(self, websocket: WebSocket, client_id: str, metadata: Optional[Dict[str, Any]] = None):
        """Accept a new WebSocket connection"""
        await websocket.accept()
        self.active_connections[client_id] = websocket
        self.connection_metadata[client_id] = metadata or {}
        self.message_queues[client_id] = asyncio.Queue()
        
        logger.info(f"Client {client_id} connected")
        
        # Send welcome message
        await self.send_personal_message({
            "type": "connection_established",
            "client_id": client_id,
            "timestamp": asyncio.get_event_loop().time()
        }, client_id)
    
    def disconnect(self, client_id: str):
        """Remove a WebSocket connection"""
        if client_id in self.active_connections:
            del self.active_connections[client_id]
        if client_id in self.connection_metadata:
            del self.connection_metadata[client_id]
        if client_id in self.message_queues:
            del self.message_queues[client_id]
        
        logger.info(f"Client {client_id} disconnected")
    
    async def send_personal_message(self, message: Dict[str, Any], client_id: str):
        """Send message to specific client"""
        if client_id not in self.active_connections:
            logger.warning(f"Client {client_id} not found for message")
            return False
        
        try:
            websocket = self.active_connections[client_id]
            await websocket.send_text(json.dumps(message))
            return True
        except Exception as e:
            logger.error(f"Error sending message to {client_id}: {e}")
            self.disconnect(client_id)
            return False
    
    async def broadcast(self, message: Dict[str, Any], exclude_client: Optional[str] = None):
        """Broadcast message to all connected clients"""
        disconnected_clients = []
        
        for client_id, websocket in self.active_connections.items():
            if exclude_client and client_id == exclude_client:
                continue
            
            try:
                await websocket.send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Error broadcasting to {client_id}: {e}")
                disconnected_clients.append(client_id)
        
        # Clean up disconnected clients
        for client_id in disconnected_clients:
            self.disconnect(client_id)
    
    async def handle_message(self, client_id: str, message: str):
        """Handle incoming message from client"""
        try:
            data = json.loads(message)
            message_type = data.get("type")
            
            if message_type == "ping":
                await self.send_personal_message({
                    "type": "pong",
                    "timestamp": asyncio.get_event_loop().time()
                }, client_id)
            
            elif message_type == "subscribe":
                # Subscribe to specific events
                events = data.get("events", [])
                if client_id in self.connection_metadata:
                    self.connection_metadata[client_id]["subscribed_events"] = events
                await self.send_personal_message({
                    "type": "subscription_confirmed",
                    "events": events
                }, client_id)
            
            elif message_type == "generation_request":
                # Handle code generation request
                await self._handle_generation_request(client_id, data)
            
            else:
                logger.warning(f"Unknown message type: {message_type}")
        
        except json.JSONDecodeError:
            logger.error(f"Invalid JSON from client {client_id}: {message}")
        except Exception as e:
            logger.error(f"Error handling message from {client_id}: {e}")
    
    async def _handle_generation_request(self, client_id: str, data: Dict[str, Any]):
        """Handle code generation request"""
        try:
            prompt = data.get("prompt", "")
            project_id = data.get("project_id") or f"ws_{client_id}"
            context = data.get("context", {})
            # Optionally, you can support a generation_id for resuming

            if not prompt:
                await self.send_personal_message({
                    "type": "error",
                    "message": "Prompt is required"
                }, client_id)
                return

            # Send acknowledgment
            await self.send_personal_message({
                "type": "generation_started",
                "project_id": project_id,
                "timestamp": asyncio.get_event_loop().time()
            }, client_id)

            # Start code generation using the orchestrator
            generation_id = await code_generator.kickoff_crew(
                prompt=prompt,
                project_id=project_id,
                client_id=client_id,
                context=context
            )
            # Optionally, send the generation_id to the client
            await self.send_personal_message({
                "type": "generation_id",
                "generation_id": generation_id,
                "project_id": project_id
            }, client_id)

        except Exception as e:
            logger.error(f"Error handling generation request: {e}")
            await self.send_personal_message({
                "type": "error",
                "message": "Failed to process generation request"
            }, client_id)
    
    async def send_generation_update(self, client_id: str, update: Dict[str, Any]):
        """Send generation progress update"""
        await self.send_personal_message({
            "type": "generation_update",
            "data": update,
            "timestamp": asyncio.get_event_loop().time()
        }, client_id)
    
    async def send_sandbox_update(self, client_id: str, update: Dict[str, Any]):
        """Send sandbox status update"""
        await self.send_personal_message({
            "type": "sandbox_update",
            "data": update,
            "timestamp": asyncio.get_event_loop().time()
        }, client_id)
    
    async def send_console_log(self, client_id: str, log_data: Dict[str, Any]):
        """Send console log update"""
        await self.send_personal_message({
            "type": "console_log",
            "data": log_data,
            "timestamp": asyncio.get_event_loop().time()
        }, client_id)
    
    async def send_error(self, client_id: str, error: Dict[str, Any]):
        """Send error message"""
        await self.send_personal_message({
            "type": "error",
            "data": error,
            "timestamp": asyncio.get_event_loop().time()
        }, client_id)
    
    def get_connection_count(self) -> int:
        """Get number of active connections"""
        return len(self.active_connections)
    
    def get_connection_info(self) -> List[Dict[str, Any]]:
        """Get information about all connections"""
        return [
            {
                "client_id": client_id,
                "metadata": self.connection_metadata.get(client_id, {}),
                "connected": True
            }
            for client_id in self.active_connections.keys()
        ]


# Global WebSocket manager instance
websocket_manager = ConnectionManager()

# Global AIService and CodeGenerator instances
ai_service = AIService()
code_generator = CodeGenerator(ai_service)
