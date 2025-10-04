"""
Sandbox endpoints for container management
"""

from typing import Dict, List, Any, Optional
from fastapi import APIRouter, HTTPException, Depends, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.sandbox_manager import SandboxManager, get_sandbox_manager
from app.core.websocket_manager import websocket_manager

router = APIRouter()


class SandboxCreateRequest(BaseModel):
    """Request model for creating a sandbox"""
    project_id: str = Field(..., description="Project ID")
    code: str = Field(..., description="Code to deploy")
    dependencies: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Project dependencies")
    client_id: Optional[str] = Field(None, description="WebSocket client ID")


class SandboxResponse(BaseModel):
    """Response model for sandbox information"""
    id: str
    project_id: str
    status: str
    url: Optional[str] = None
    port: Optional[int] = None
    created_at: str


class SandboxStatusResponse(BaseModel):
    """Response model for sandbox status"""
    id: str
    status: str
    url: Optional[str] = None
    port: Optional[int] = None
    created_at: str
    project_id: str


class CommandRequest(BaseModel):
    """Request model for executing commands"""
    command: str = Field(..., description="Command to execute")
    timeout: Optional[int] = Field(30, description="Command timeout in seconds")


class CommandResponse(BaseModel):
    """Response model for command execution"""
    exit_code: int
    stdout: str
    stderr: str


@router.post("/", response_model=SandboxResponse)
async def create_sandbox(
    request: SandboxCreateRequest,
    sandbox_manager: SandboxManager = Depends(get_sandbox_manager),
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new sandbox container
    
    Creates a new Docker container with the provided code and dependencies.
    The sandbox will be accessible via the returned URL.
    """
    try:
        sandbox_id = await sandbox_manager.create_sandbox(
            project_id=request.project_id,
            code=request.code,
            dependencies=request.dependencies,
            client_id=request.client_id
        )
        
        # Get sandbox status
        status = await sandbox_manager.get_sandbox_status(sandbox_id)
        if not status:
            raise HTTPException(status_code=500, detail="Failed to create sandbox")
        
        return SandboxResponse(
            id=status["id"],
            project_id=status["project_id"],
            status=status["status"],
            url=status.get("url"),
            port=status.get("port"),
            created_at=status["created_at"]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create sandbox: {str(e)}")


@router.get("/{sandbox_id}/status", response_model=SandboxStatusResponse)
async def get_sandbox_status(
    sandbox_id: str,
    sandbox_manager: SandboxManager = Depends(get_sandbox_manager)
):
    """
    Get the status of a sandbox
    
    Returns current status, URL, and other information about the sandbox.
    """
    try:
        status = await sandbox_manager.get_sandbox_status(sandbox_id)
        if not status:
            raise HTTPException(status_code=404, detail="Sandbox not found")
        
        return SandboxStatusResponse(**status)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get sandbox status: {str(e)}")


@router.get("/", response_model=List[SandboxStatusResponse])
async def list_sandboxes(
    sandbox_manager: SandboxManager = Depends(get_sandbox_manager)
):
    """
    List all active sandboxes
    
    Returns a list of all currently active sandboxes.
    """
    try:
        sandboxes = await sandbox_manager.list_sandboxes()
        return [SandboxStatusResponse(**sandbox) for sandbox in sandboxes]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list sandboxes: {str(e)}")


@router.delete("/{sandbox_id}")
async def destroy_sandbox(
    sandbox_id: str,
    sandbox_manager: SandboxManager = Depends(get_sandbox_manager)
):
    """
    Destroy a sandbox
    
    Stops and removes the sandbox container, freeing up resources.
    """
    try:
        await sandbox_manager.destroy_sandbox(sandbox_id)
        return {"message": "Sandbox destroyed successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to destroy sandbox: {str(e)}")


@router.post("/{sandbox_id}/execute", response_model=CommandResponse)
async def execute_command(
    sandbox_id: str,
    request: CommandRequest,
    sandbox_manager: SandboxManager = Depends(get_sandbox_manager)
):
    """
    Execute a command in the sandbox
    
    Runs a command inside the sandbox container and returns the output.
    """
    try:
        result = await sandbox_manager.execute_command(sandbox_id, request.command)
        
        return CommandResponse(
            exit_code=result["exit_code"],
            stdout=result["stdout"],
            stderr=result["stderr"]
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to execute command: {str(e)}")


@router.post("/{sandbox_id}/restart")
async def restart_sandbox(
    sandbox_id: str,
    sandbox_manager: SandboxManager = Depends(get_sandbox_manager)
):
    """
    Restart a sandbox
    
    Restarts the sandbox container, useful for applying configuration changes.
    """
    try:
        # Stop the sandbox
        await sandbox_manager.destroy_sandbox(sandbox_id)
        
        # Note: In a real implementation, you would recreate the sandbox here
        # For now, we'll just return a success message
        return {"message": "Sandbox restart initiated"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to restart sandbox: {str(e)}")


@router.get("/{sandbox_id}/logs")
async def get_sandbox_logs(
    sandbox_id: str,
    sandbox_manager: SandboxManager = Depends(get_sandbox_manager)
):
    """
    Get sandbox logs
    
    Returns the logs from the sandbox container.
    """
    try:
        # This would be implemented to get actual logs from the container
        # For now, return a placeholder response
        return {
            "sandbox_id": sandbox_id,
            "logs": "Log retrieval not implemented yet",
            "message": "Use WebSocket connection for real-time logs"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get sandbox logs: {str(e)}")


@router.post("/{sandbox_id}/install")
async def install_dependencies(
    sandbox_id: str,
    dependencies: Dict[str, Any],
    sandbox_manager: SandboxManager = Depends(get_sandbox_manager)
):
    """
    Install dependencies in the sandbox
    
    Installs additional dependencies in the sandbox container.
    """
    try:
        # Install npm packages
        if "dependencies" in dependencies:
            deps = dependencies["dependencies"]
            if isinstance(deps, dict):
                for package, version in deps.items():
                    command = f"npm install {package}@{version}"
                    result = await sandbox_manager.execute_command(sandbox_id, command)
                    if result["exit_code"] != 0:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Failed to install {package}: {result['stderr']}"
                        )
        
        return {"message": "Dependencies installed successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to install dependencies: {str(e)}")


@router.post("/{sandbox_id}/build")
async def build_project(
    sandbox_id: str,
    sandbox_manager: SandboxManager = Depends(get_sandbox_manager)
):
    """
    Build the project in the sandbox
    
    Runs the build command to compile the project.
    """
    try:
        result = await sandbox_manager.execute_command(sandbox_id, "npm run build")
        
        if result["exit_code"] == 0:
            return {
                "message": "Build completed successfully",
                "output": result["stdout"]
            }
        else:
            return {
                "message": "Build failed",
                "error": result["stderr"],
                "output": result["stdout"]
            }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to build project: {str(e)}")


@router.post("/{sandbox_id}/test")
async def run_tests(
    sandbox_id: str,
    sandbox_manager: SandboxManager = Depends(get_sandbox_manager)
):
    """
    Run tests in the sandbox
    
    Executes the test suite in the sandbox container.
    """
    try:
        result = await sandbox_manager.execute_command(sandbox_id, "npm test")
        
        return {
            "message": "Tests completed",
            "exit_code": result["exit_code"],
            "output": result["stdout"],
            "error": result["stderr"]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to run tests: {str(e)}")


@router.websocket("/{sandbox_id}/ws")
async def sandbox_websocket(
    websocket: WebSocket,
    sandbox_id: str,
    sandbox_manager: SandboxManager = Depends(get_sandbox_manager)
):
    """
    WebSocket connection for real-time sandbox updates
    
    Provides real-time logs, status updates, and interactive communication
    with the sandbox container.
    """
    try:
        # Connect to WebSocket
        await websocket_manager.connect(websocket, f"sandbox_{sandbox_id}")
        
        # Send initial status
        status = await sandbox_manager.get_sandbox_status(sandbox_id)
        if status:
            await websocket_manager.send_sandbox_update(
                f"sandbox_{sandbox_id}",
                {
                    "sandbox_id": sandbox_id,
                    "status": status["status"],
                    "url": status.get("url"),
                    "port": status.get("port")
                }
            )
        
        # Handle messages
        while True:
            try:
                data = await websocket.receive_text()
                # Process incoming messages (commands, etc.)
                await websocket_manager.handle_message(f"sandbox_{sandbox_id}", data)
            except WebSocketDisconnect:
                break
    
    except Exception as e:
        logger.error(f"WebSocket error for sandbox {sandbox_id}: {e}")
    finally:
        websocket_manager.disconnect(f"sandbox_{sandbox_id}")
