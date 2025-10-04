"""
Sandbox Manager for container lifecycle and build pipeline
"""

import asyncio
import json
import os
import shutil
import tempfile
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, AsyncGenerator
import logging
from pathlib import Path

import docker
from docker.errors import DockerException, ContainerError, ImageNotFound
import aiofiles

from app.core.config import settings
from app.core.websocket_manager import websocket_manager

logger = logging.getLogger(__name__)


class SandboxManager:
    """Manages Docker containers for code execution and testing"""
    
    def __init__(self):
        self.docker_client = docker.from_env()
        self.active_sandboxes: Dict[str, Dict[str, Any]] = {}
        self.sandbox_timeout = settings.SANDBOX_TIMEOUT
        self.max_concurrent = settings.MAX_CONCURRENT_SANDBOXES
        self.base_image = settings.SANDBOX_IMAGE
    
    async def create_sandbox(
        self,
        project_id: str,
        code: str,
        dependencies: Optional[Dict[str, Any]] = None,
        client_id: Optional[str] = None
    ) -> str:
        """
        Create a new sandbox container for code execution
        
        Args:
            project_id: Unique project identifier
            code: Generated code to execute
            dependencies: Project dependencies
            client_id: WebSocket client ID for real-time updates
            
        Returns:
            Sandbox ID
        """
        try:
            sandbox_id = str(uuid.uuid4())
            
            # Check concurrent limit
            if len(self.active_sandboxes) >= self.max_concurrent:
                raise Exception(f"Maximum concurrent sandboxes ({self.max_concurrent}) reached")
            
            # Create temporary directory for project files
            temp_dir = await self._create_project_files(code, dependencies)
            
            # Create Docker container
            container = await self._create_container(sandbox_id, temp_dir)
            
            # Store sandbox information
            self.active_sandboxes[sandbox_id] = {
                "id": sandbox_id,
                "project_id": project_id,
                "container": container,
                "temp_dir": temp_dir,
                "created_at": datetime.utcnow(),
                "status": "starting",
                "client_id": client_id
            }
            
            # Start container
            await self._start_container(sandbox_id)
            
            # Notify client
            if client_id:
                await websocket_manager.send_sandbox_update(client_id, {
                    "sandbox_id": sandbox_id,
                    "status": "created",
                    "message": "Sandbox created successfully"
                })
            
            logger.info(f"Sandbox {sandbox_id} created for project {project_id}")
            return sandbox_id
        
        except Exception as e:
            logger.error(f"Error creating sandbox: {e}")
            raise
    
    async def _create_project_files(self, code: str, dependencies: Optional[Dict[str, Any]]) -> str:
        """Create project files in temporary directory"""
        temp_dir = tempfile.mkdtemp(prefix="sandbox_")
        
        try:
            # Create package.json
            package_json = {
                "name": "generated-app",
                "version": "1.0.0",
                "type": "module",
                "scripts": {
                    "dev": "vite",
                    "build": "tsc && vite build",
                    "preview": "vite preview",
                    "test": "vitest",
                    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
                },
                "dependencies": dependencies.get("dependencies", {
                    "react": "^18.2.0",
                    "react-dom": "^18.2.0",
                    "typescript": "^5.0.0",
                    "vite": "^5.0.0",
                    "@vitejs/plugin-react": "^4.0.0"
                }),
                "devDependencies": dependencies.get("devDependencies", {
                    "@types/react": "^18.2.0",
                    "@types/react-dom": "^18.2.0",
                    "@typescript-eslint/eslint-plugin": "^6.0.0",
                    "@typescript-eslint/parser": "^6.0.0",
                    "eslint": "^8.45.0",
                    "eslint-plugin-react-hooks": "^4.6.0",
                    "eslint-plugin-react-refresh": "^0.4.3",
                    "vitest": "^0.34.0"
                })
            }
            
            # Write package.json
            async with aiofiles.open(os.path.join(temp_dir, "package.json"), "w") as f:
                await f.write(json.dumps(package_json, indent=2))
            
            # Create vite.config.ts
            vite_config = """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000
  }
})"""
            
            async with aiofiles.open(os.path.join(temp_dir, "vite.config.ts"), "w") as f:
                await f.write(vite_config)
            
            # Create tsconfig.json
            tsconfig = {
                "compilerOptions": {
                    "target": "ES2020",
                    "useDefineForClassFields": True,
                    "lib": ["ES2020", "DOM", "DOM.Iterable"],
                    "module": "ESNext",
                    "skipLibCheck": True,
                    "moduleResolution": "bundler",
                    "allowImportingTsExtensions": True,
                    "resolveJsonModule": True,
                    "isolatedModules": True,
                    "noEmit": True,
                    "jsx": "react-jsx",
                    "strict": True,
                    "noUnusedLocals": True,
                    "noUnusedParameters": True,
                    "noFallthroughCasesInSwitch": True
                },
                "include": ["src"],
                "references": [{"path": "./tsconfig.node.json"}]
            }
            
            async with aiofiles.open(os.path.join(temp_dir, "tsconfig.json"), "w") as f:
                await f.write(json.dumps(tsconfig, indent=2))
            
            # Create tsconfig.node.json
            tsconfig_node = {
                "compilerOptions": {
                    "composite": True,
                    "skipLibCheck": True,
                    "module": "ESNext",
                    "moduleResolution": "bundler",
                    "allowSyntheticDefaultImports": True
                },
                "include": ["vite.config.ts"]
            }
            
            async with aiofiles.open(os.path.join(temp_dir, "tsconfig.node.json"), "w") as f:
                await f.write(json.dumps(tsconfig_node, indent=2))
            
            # Create src directory and main files
            src_dir = os.path.join(temp_dir, "src")
            os.makedirs(src_dir, exist_ok=True)
            
            # Create main.tsx
            main_tsx = """import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)"""
            
            async with aiofiles.open(os.path.join(src_dir, "main.tsx"), "w") as f:
                await f.write(main_tsx)
            
            # Create App.tsx with generated code
            async with aiofiles.open(os.path.join(src_dir, "App.tsx"), "w") as f:
                await f.write(code)
            
            # Create index.css
            index_css = """@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}"""
            
            async with aiofiles.open(os.path.join(src_dir, "index.css"), "w") as f:
                await f.write(index_css)
            
            # Create index.html
            index_html = """<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Generated App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>"""
            
            async with aiofiles.open(os.path.join(temp_dir, "index.html"), "w") as f:
                await f.write(index_html)
            
            # Create tailwind.config.js
            tailwind_config = """/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}"""
            
            async with aiofiles.open(os.path.join(temp_dir, "tailwind.config.js"), "w") as f:
                await f.write(tailwind_config)
            
            # Create postcss.config.js
            postcss_config = """export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}"""
            
            async with aiofiles.open(os.path.join(temp_dir, "postcss.config.js"), "w") as f:
                await f.write(postcss_config)
            
            return temp_dir
        
        except Exception as e:
            logger.error(f"Error creating project files: {e}")
            # Cleanup on error
            if os.path.exists(temp_dir):
                shutil.rmtree(temp_dir)
            raise
    
    async def _create_container(self, sandbox_id: str, temp_dir: str) -> Any:
        """Create Docker container for sandbox"""
        try:
            # Create Dockerfile
            dockerfile_content = f"""FROM {self.base_image}

WORKDIR /app

# Install Node.js and npm
RUN apk add --no-cache nodejs npm

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
"""
            
            dockerfile_path = os.path.join(temp_dir, "Dockerfile")
            async with aiofiles.open(dockerfile_path, "w") as f:
                await f.write(dockerfile_content)
            
            # Build Docker image
            image_tag = f"sandbox-{sandbox_id}"
            image, build_logs = self.docker_client.images.build(
                path=temp_dir,
                tag=image_tag,
                rm=True,
                forcerm=True
            )
            
            # Create container
            container = self.docker_client.containers.create(
                image=image_tag,
                name=f"sandbox-{sandbox_id}",
                ports={'3000/tcp': None},  # Random port
                environment={
                    'NODE_ENV': 'development',
                    'VITE_HOST': '0.0.0.0'
                },
                detach=True,
                remove=True
            )
            
            return container
        
        except Exception as e:
            logger.error(f"Error creating container: {e}")
            raise
    
    async def _start_container(self, sandbox_id: str):
        """Start the container and monitor logs"""
        try:
            sandbox = self.active_sandboxes[sandbox_id]
            container = sandbox["container"]
            
            # Start container
            container.start()
            
            # Get assigned port
            container.reload()
            port_info = container.ports.get('3000/tcp', [{}])[0]
            assigned_port = port_info.get('HostPort')
            
            if not assigned_port:
                raise Exception("Failed to get assigned port")
            
            # Update sandbox info
            sandbox["status"] = "running"
            sandbox["port"] = int(assigned_port)
            sandbox["url"] = f"http://localhost:{assigned_port}"
            
            # Start log monitoring
            asyncio.create_task(self._monitor_container_logs(sandbox_id))
            
            # Notify client
            client_id = sandbox.get("client_id")
            if client_id:
                await websocket_manager.send_sandbox_update(client_id, {
                    "sandbox_id": sandbox_id,
                    "status": "running",
                    "url": sandbox["url"],
                    "port": sandbox["port"]
                })
            
            logger.info(f"Sandbox {sandbox_id} started on port {assigned_port}")
        
        except Exception as e:
            logger.error(f"Error starting container: {e}")
            sandbox["status"] = "error"
            raise
    
    async def _monitor_container_logs(self, sandbox_id: str):
        """Monitor container logs and send to client"""
        try:
            sandbox = self.active_sandboxes[sandbox_id]
            container = sandbox["container"]
            client_id = sandbox.get("client_id")
            
            # Stream logs
            for line in container.logs(stream=True, follow=True):
                try:
                    log_line = line.decode('utf-8').strip()
                    if log_line:
                        # Send log to client
                        if client_id:
                            await websocket_manager.send_console_log(client_id, {
                                "sandbox_id": sandbox_id,
                                "level": "info",
                                "message": log_line,
                                "timestamp": datetime.utcnow().isoformat()
                            })
                        
                        # Check for errors
                        if "error" in log_line.lower() or "failed" in log_line.lower():
                            logger.warning(f"Error in sandbox {sandbox_id}: {log_line}")
                
                except Exception as e:
                    logger.error(f"Error processing log line: {e}")
                    break
        
        except Exception as e:
            logger.error(f"Error monitoring logs for sandbox {sandbox_id}: {e}")
        finally:
            # Cleanup when monitoring stops
            await self.destroy_sandbox(sandbox_id)
    
    async def destroy_sandbox(self, sandbox_id: str):
        """Destroy sandbox and cleanup resources"""
        try:
            if sandbox_id not in self.active_sandboxes:
                return
            
            sandbox = self.active_sandboxes[sandbox_id]
            container = sandbox["container"]
            temp_dir = sandbox["temp_dir"]
            client_id = sandbox.get("client_id")
            
            # Stop and remove container
            try:
                container.stop(timeout=10)
                container.remove(force=True)
            except Exception as e:
                logger.warning(f"Error stopping container: {e}")
            
            # Cleanup temporary directory
            if temp_dir and os.path.exists(temp_dir):
                shutil.rmtree(temp_dir)
            
            # Remove from active sandboxes
            del self.active_sandboxes[sandbox_id]
            
            # Notify client
            if client_id:
                await websocket_manager.send_sandbox_update(client_id, {
                    "sandbox_id": sandbox_id,
                    "status": "destroyed",
                    "message": "Sandbox destroyed"
                })
            
            logger.info(f"Sandbox {sandbox_id} destroyed")
        
        except Exception as e:
            logger.error(f"Error destroying sandbox {sandbox_id}: {e}")
    
    async def cleanup_expired_sandboxes(self):
        """Cleanup expired sandboxes"""
        while True:
            try:
                current_time = datetime.utcnow()
                expired_sandboxes = []
                
                for sandbox_id, sandbox in self.active_sandboxes.items():
                    created_at = sandbox["created_at"]
                    if current_time - created_at > timedelta(seconds=self.sandbox_timeout):
                        expired_sandboxes.append(sandbox_id)
                
                for sandbox_id in expired_sandboxes:
                    logger.info(f"Cleaning up expired sandbox {sandbox_id}")
                    await self.destroy_sandbox(sandbox_id)
                
                # Wait before next cleanup cycle
                await asyncio.sleep(60)  # Check every minute
            
            except Exception as e:
                logger.error(f"Error in cleanup task: {e}")
                await asyncio.sleep(60)
    
    async def cleanup_all(self):
        """Cleanup all active sandboxes"""
        sandbox_ids = list(self.active_sandboxes.keys())
        for sandbox_id in sandbox_ids:
            await self.destroy_sandbox(sandbox_id)
    
    async def get_sandbox_status(self, sandbox_id: str) -> Optional[Dict[str, Any]]:
        """Get sandbox status"""
        if sandbox_id not in self.active_sandboxes:
            return None
        
        sandbox = self.active_sandboxes[sandbox_id]
        return {
            "id": sandbox_id,
            "status": sandbox["status"],
            "url": sandbox.get("url"),
            "port": sandbox.get("port"),
            "created_at": sandbox["created_at"].isoformat(),
            "project_id": sandbox["project_id"]
        }
    
    async def list_sandboxes(self) -> List[Dict[str, Any]]:
        """List all active sandboxes"""
        return [
            await self.get_sandbox_status(sandbox_id)
            for sandbox_id in self.active_sandboxes.keys()
        ]
    
    async def execute_command(self, sandbox_id: str, command: str) -> Dict[str, Any]:
        """Execute command in sandbox container"""
        try:
            if sandbox_id not in self.active_sandboxes:
                raise Exception("Sandbox not found")
            
            sandbox = self.active_sandboxes[sandbox_id]
            container = sandbox["container"]
            
            # Execute command
            result = container.exec_run(command, demux=True)
            
            return {
                "exit_code": result.exit_code,
                "stdout": result.output[0].decode('utf-8') if result.output[0] else "",
                "stderr": result.output[1].decode('utf-8') if result.output[1] else ""
            }
        
        except Exception as e:
            logger.error(f"Error executing command in sandbox {sandbox_id}: {e}")
            raise
