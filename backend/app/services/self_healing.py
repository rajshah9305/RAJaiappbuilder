"""
Self-Healing Service for automatic error detection and repair
"""

import asyncio
import json
import re
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from enum import Enum

from app.services.ai_service import AIService
from app.services.sandbox_manager import SandboxManager
from app.core.websocket_manager import websocket_manager

logger = logging.getLogger(__name__)


class ErrorType(Enum):
    """Error type enumeration"""
    IMPORT_ERROR = "import_error"
    SYNTAX_ERROR = "syntax_error"
    TYPE_ERROR = "type_error"
    RUNTIME_ERROR = "runtime_error"
    BUILD_ERROR = "build_error"
    TEST_ERROR = "test_error"
    LINT_ERROR = "lint_error"
    UNKNOWN = "unknown"


class SelfHealingService:
    """Service for automatic error detection and repair"""
    
    def __init__(self, ai_service: AIService, sandbox_manager: SandboxManager):
        self.ai_service = ai_service
        self.sandbox_manager = sandbox_manager
        self.error_patterns = self._load_error_patterns()
        self.fix_attempts: Dict[str, List[Dict[str, Any]]] = {}
        self.max_retry_attempts = 3
    
    def _load_error_patterns(self) -> Dict[ErrorType, List[str]]:
        """Load error detection patterns"""
        return {
            ErrorType.IMPORT_ERROR: [
                r"ModuleNotFoundError: No module named '(\w+)'",
                r"Cannot resolve module '(\w+)'",
                r"import.*not found",
                r"require.*not found"
            ],
            ErrorType.SYNTAX_ERROR: [
                r"SyntaxError: (.+)",
                r"Unexpected token",
                r"Expected (.+) but found (.+)",
                r"Unterminated string literal"
            ],
            ErrorType.TYPE_ERROR: [
                r"TypeError: (.+)",
                r"Cannot read property '(\w+)' of undefined",
                r"undefined is not a function",
                r"Property '(\w+)' does not exist"
            ],
            ErrorType.RUNTIME_ERROR: [
                r"RuntimeError: (.+)",
                r"ReferenceError: (.+)",
                r"RangeError: (.+)",
                r"URIError: (.+)"
            ],
            ErrorType.BUILD_ERROR: [
                r"Build failed",
                r"Compilation error",
                r"Webpack error",
                r"Vite error",
                r"TypeScript error"
            ],
            ErrorType.TEST_ERROR: [
                r"Test failed",
                r"AssertionError",
                r"Expect (.+) to be (.+)",
                r"Timeout"
            ],
            ErrorType.LINT_ERROR: [
                r"ESLint error",
                r"Prettier error",
                r"Style error",
                r"Formatting error"
            ]
        }
    
    async def monitor_sandboxes(self):
        """Monitor all active sandboxes for errors"""
        while True:
            try:
                for sandbox_id in list(self.sandbox_manager.active_sandboxes.keys()):
                    await self._check_sandbox_errors(sandbox_id)
                
                # Wait before next check
                await asyncio.sleep(10)  # Check every 10 seconds
            
            except Exception as e:
                logger.error(f"Error in sandbox monitoring: {e}")
                await asyncio.sleep(30)  # Wait longer on error
    
    async def _check_sandbox_errors(self, sandbox_id: str):
        """Check for errors in specific sandbox"""
        try:
            sandbox = self.sandbox_manager.active_sandboxes.get(sandbox_id)
            if not sandbox:
                return
            
            # Get recent logs
            logs = await self._get_sandbox_logs(sandbox_id)
            
            # Analyze logs for errors
            errors = await self._analyze_logs_for_errors(logs)
            
            # Process each error
            for error in errors:
                await self._process_error(sandbox_id, error)
        
        except Exception as e:
            logger.error(f"Error checking sandbox {sandbox_id}: {e}")
    
    async def _get_sandbox_logs(self, sandbox_id: str) -> List[str]:
        """Get recent logs from sandbox"""
        try:
            # Execute command to get recent logs
            result = await self.sandbox_manager.execute_command(
                sandbox_id,
                "tail -n 50 /var/log/app.log 2>/dev/null || echo 'No app logs'"
            )
            
            logs = []
            if result["stdout"]:
                logs.extend(result["stdout"].split('\n'))
            if result["stderr"]:
                logs.extend(result["stderr"].split('\n'))
            
            return [log.strip() for log in logs if log.strip()]
        
        except Exception as e:
            logger.error(f"Error getting logs for sandbox {sandbox_id}: {e}")
            return []
    
    async def _analyze_logs_for_errors(self, logs: List[str]) -> List[Dict[str, Any]]:
        """Analyze logs to detect errors"""
        errors = []
        
        for log_line in logs:
            for error_type, patterns in self.error_patterns.items():
                for pattern in patterns:
                    match = re.search(pattern, log_line, re.IGNORECASE)
                    if match:
                        error = {
                            "type": error_type.value,
                            "message": log_line,
                            "pattern": pattern,
                            "match": match.groups() if match.groups() else [],
                            "timestamp": datetime.utcnow().isoformat()
                        }
                        errors.append(error)
                        break
        
        return errors
    
    async def _process_error(self, sandbox_id: str, error: Dict[str, Any]):
        """Process detected error and attempt fix"""
        try:
            error_type = error["type"]
            error_message = error["message"]
            
            # Check if we've already tried to fix this error
            if self._has_attempted_fix(sandbox_id, error):
                return
            
            # Attempt automatic fix
            fix_result = await self._attempt_automatic_fix(sandbox_id, error)
            
            # Record fix attempt
            self._record_fix_attempt(sandbox_id, error, fix_result)
            
            # Notify client
            client_id = self.sandbox_manager.active_sandboxes[sandbox_id].get("client_id")
            if client_id:
                await websocket_manager.send_console_log(client_id, {
                    "sandbox_id": sandbox_id,
                    "level": "info",
                    "message": f"Self-healing: {fix_result['action']}",
                    "timestamp": datetime.utcnow().isoformat()
                })
        
        except Exception as e:
            logger.error(f"Error processing error: {e}")
    
    def _has_attempted_fix(self, sandbox_id: str, error: Dict[str, Any]) -> bool:
        """Check if we've already attempted to fix this error"""
        if sandbox_id not in self.fix_attempts:
            self.fix_attempts[sandbox_id] = []
        
        error_hash = hash(error["message"])
        for attempt in self.fix_attempts[sandbox_id]:
            if attempt["error_hash"] == error_hash:
                return True
        
        return False
    
    async def _attempt_automatic_fix(self, sandbox_id: str, error: Dict[str, Any]) -> Dict[str, Any]:
        """Attempt to automatically fix the error"""
        try:
            error_type = error["type"]
            error_message = error["message"]
            
            if error_type == ErrorType.IMPORT_ERROR.value:
                return await self._fix_import_error(sandbox_id, error)
            elif error_type == ErrorType.SYNTAX_ERROR.value:
                return await self._fix_syntax_error(sandbox_id, error)
            elif error_type == ErrorType.TYPE_ERROR.value:
                return await self._fix_type_error(sandbox_id, error)
            elif error_type == ErrorType.BUILD_ERROR.value:
                return await self._fix_build_error(sandbox_id, error)
            elif error_type == ErrorType.LINT_ERROR.value:
                return await self._fix_lint_error(sandbox_id, error)
            else:
                return await self._fix_generic_error(sandbox_id, error)
        
        except Exception as e:
            logger.error(f"Error in automatic fix: {e}")
            return {
                "action": "failed",
                "error": str(e),
                "success": False
            }
    
    async def _fix_import_error(self, sandbox_id: str, error: Dict[str, Any]) -> Dict[str, Any]:
        """Fix import/module errors"""
        try:
            error_message = error["message"]
            
            # Extract module name from error
            module_match = re.search(r"module named '(\w+)'", error_message)
            if not module_match:
                return {"action": "could_not_parse", "success": False}
            
            module_name = module_match.group(1)
            
            # Check if it's a missing npm package
            if self._is_npm_package(module_name):
                # Install the package
                install_result = await self.sandbox_manager.execute_command(
                    sandbox_id,
                    f"npm install {module_name}"
                )
                
                if install_result["exit_code"] == 0:
                    return {
                        "action": f"installed_package_{module_name}",
                        "success": True,
                        "details": install_result["stdout"]
                    }
                else:
                    return {
                        "action": f"failed_to_install_{module_name}",
                        "success": False,
                        "error": install_result["stderr"]
                    }
            else:
                # Try to fix import path
                return await self._fix_import_path(sandbox_id, error)
        
        except Exception as e:
            logger.error(f"Error fixing import error: {e}")
            return {"action": "failed", "error": str(e), "success": False}
    
    async def _fix_syntax_error(self, sandbox_id: str, error: Dict[str, Any]) -> Dict[str, Any]:
        """Fix syntax errors using AI"""
        try:
            # Get the problematic file
            file_content = await self._get_file_content(sandbox_id, error)
            if not file_content:
                return {"action": "file_not_found", "success": False}
            
            # Use AI to fix syntax error
            fixed_code = await self.ai_service.fix_code_errors(file_content, error["message"])
            
            if fixed_code and fixed_code != file_content:
                # Write fixed code back
                await self._write_file_content(sandbox_id, error, fixed_code)
                
                return {
                    "action": "fixed_syntax_error",
                    "success": True,
                    "details": "Syntax error fixed using AI"
                }
            else:
                return {
                    "action": "could_not_fix_syntax",
                    "success": False,
                    "error": "AI could not fix the syntax error"
                }
        
        except Exception as e:
            logger.error(f"Error fixing syntax error: {e}")
            return {"action": "failed", "error": str(e), "success": False}
    
    async def _fix_type_error(self, sandbox_id: str, error: Dict[str, Any]) -> Dict[str, Any]:
        """Fix type errors using AI"""
        try:
            # Get the problematic file
            file_content = await self._get_file_content(sandbox_id, error)
            if not file_content:
                return {"action": "file_not_found", "success": False}
            
            # Use AI to fix type error
            fixed_code = await self.ai_service.fix_code_errors(file_content, error["message"])
            
            if fixed_code and fixed_code != file_content:
                # Write fixed code back
                await self._write_file_content(sandbox_id, error, fixed_code)
                
                return {
                    "action": "fixed_type_error",
                    "success": True,
                    "details": "Type error fixed using AI"
                }
            else:
                return {
                    "action": "could_not_fix_type",
                    "success": False,
                    "error": "AI could not fix the type error"
                }
        
        except Exception as e:
            logger.error(f"Error fixing type error: {e}")
            return {"action": "failed", "error": str(e), "success": False}
    
    async def _fix_build_error(self, sandbox_id: str, error: Dict[str, Any]) -> Dict[str, Any]:
        """Fix build errors"""
        try:
            # Try to rebuild the project
            build_result = await self.sandbox_manager.execute_command(
                sandbox_id,
                "npm run build"
            )
            
            if build_result["exit_code"] == 0:
                return {
                    "action": "rebuild_successful",
                    "success": True,
                    "details": "Project rebuilt successfully"
                }
            else:
                # Try to fix dependencies
                install_result = await self.sandbox_manager.execute_command(
                    sandbox_id,
                    "npm install --force"
                )
                
                if install_result["exit_code"] == 0:
                    return {
                        "action": "reinstalled_dependencies",
                        "success": True,
                        "details": "Dependencies reinstalled"
                    }
                else:
                    return {
                        "action": "build_failed",
                        "success": False,
                        "error": build_result["stderr"]
                    }
        
        except Exception as e:
            logger.error(f"Error fixing build error: {e}")
            return {"action": "failed", "error": str(e), "success": False}
    
    async def _fix_lint_error(self, sandbox_id: str, error: Dict[str, Any]) -> Dict[str, Any]:
        """Fix linting errors"""
        try:
            # Run ESLint with --fix
            lint_result = await self.sandbox_manager.execute_command(
                sandbox_id,
                "npx eslint . --fix"
            )
            
            if lint_result["exit_code"] == 0:
                return {
                    "action": "lint_fixed",
                    "success": True,
                    "details": "Linting errors fixed automatically"
                }
            else:
                # Try Prettier
                prettier_result = await self.sandbox_manager.execute_command(
                    sandbox_id,
                    "npx prettier --write ."
                )
                
                if prettier_result["exit_code"] == 0:
                    return {
                        "action": "prettier_fixed",
                        "success": True,
                        "details": "Code formatted with Prettier"
                    }
                else:
                    return {
                        "action": "lint_failed",
                        "success": False,
                        "error": lint_result["stderr"]
                    }
        
        except Exception as e:
            logger.error(f"Error fixing lint error: {e}")
            return {"action": "failed", "error": str(e), "success": False}
    
    async def _fix_generic_error(self, sandbox_id: str, error: Dict[str, Any]) -> Dict[str, Any]:
        """Fix generic errors using AI"""
        try:
            # Get current code
            code = await self._get_current_code(sandbox_id)
            if not code:
                return {"action": "no_code_found", "success": False}
            
            # Use AI to fix the error
            fixed_code = await self.ai_service.fix_code_errors(code, error["message"])
            
            if fixed_code and fixed_code != code:
                # Write fixed code
                await self._write_current_code(sandbox_id, fixed_code)
                
                return {
                    "action": "ai_fixed_error",
                    "success": True,
                    "details": "Error fixed using AI"
                }
            else:
                return {
                    "action": "ai_could_not_fix",
                    "success": False,
                    "error": "AI could not fix the error"
                }
        
        except Exception as e:
            logger.error(f"Error fixing generic error: {e}")
            return {"action": "failed", "error": str(e), "success": False}
    
    def _is_npm_package(self, module_name: str) -> bool:
        """Check if module name is likely an npm package"""
        # Common npm packages
        npm_packages = [
            'react', 'vue', 'angular', 'express', 'lodash', 'moment',
            'axios', 'jquery', 'bootstrap', 'tailwindcss', 'typescript'
        ]
        
        return module_name.lower() in npm_packages or len(module_name) > 3
    
    async def _get_file_content(self, sandbox_id: str, error: Dict[str, Any]) -> Optional[str]:
        """Get content of file with error"""
        try:
            # Try to find the file with error
            find_result = await self.sandbox_manager.execute_command(
                sandbox_id,
                "find . -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' | head -5"
            )
            
            if find_result["exit_code"] == 0:
                files = find_result["stdout"].strip().split('\n')
                for file_path in files:
                    if file_path:
                        content_result = await self.sandbox_manager.execute_command(
                            sandbox_id,
                            f"cat {file_path}"
                        )
                        if content_result["exit_code"] == 0:
                            return content_result["stdout"]
            
            return None
        
        except Exception as e:
            logger.error(f"Error getting file content: {e}")
            return None
    
    async def _write_file_content(self, sandbox_id: str, error: Dict[str, Any], content: str):
        """Write fixed content to file"""
        try:
            # Find the file to write to
            find_result = await self.sandbox_manager.execute_command(
                sandbox_id,
                "find . -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' | head -1"
            )
            
            if find_result["exit_code"] == 0:
                file_path = find_result["stdout"].strip()
                if file_path:
                    # Write content to file
                    write_result = await self.sandbox_manager.execute_command(
                        sandbox_id,
                        f"cat > {file_path} << 'EOF'\n{content}\nEOF"
                    )
                    
                    if write_result["exit_code"] == 0:
                        logger.info(f"Fixed code written to {file_path}")
        
        except Exception as e:
            logger.error(f"Error writing file content: {e}")
    
    async def _get_current_code(self, sandbox_id: str) -> Optional[str]:
        """Get current code from sandbox"""
        return await self._get_file_content(sandbox_id, {})
    
    async def _write_current_code(self, sandbox_id: str, content: str):
        """Write current code to sandbox"""
        await self._write_file_content(sandbox_id, {}, content)
    
    def _record_fix_attempt(self, sandbox_id: str, error: Dict[str, Any], fix_result: Dict[str, Any]):
        """Record fix attempt for tracking"""
        if sandbox_id not in self.fix_attempts:
            self.fix_attempts[sandbox_id] = []
        
        attempt = {
            "error_hash": hash(error["message"]),
            "error_type": error["type"],
            "fix_result": fix_result,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        self.fix_attempts[sandbox_id].append(attempt)
        
        # Keep only recent attempts
        if len(self.fix_attempts[sandbox_id]) > 10:
            self.fix_attempts[sandbox_id] = self.fix_attempts[sandbox_id][-10:]
    
    async def get_fix_attempts(self, sandbox_id: str) -> List[Dict[str, Any]]:
        """Get fix attempts for sandbox"""
        return self.fix_attempts.get(sandbox_id, [])
    
    async def manual_fix_request(self, sandbox_id: str, error_message: str) -> Dict[str, Any]:
        """Manually request fix for specific error"""
        try:
            error = {
                "type": "manual",
                "message": error_message,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            fix_result = await self._attempt_automatic_fix(sandbox_id, error)
            self._record_fix_attempt(sandbox_id, error, fix_result)
            
            return fix_result
        
        except Exception as e:
            logger.error(f"Error in manual fix request: {e}")
            return {
                "action": "failed",
                "error": str(e),
                "success": False
            }
