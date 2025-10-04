import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  Square,
  Bug,
  Terminal,
  Eye,
  Settings,
  Zap,
  Activity,
  Database,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  Search,
  Filter,
  GitMerge
} from 'lucide-react'

interface InteractivePlaygroundProps {
  code: string
  language?: string
  onCodeChange?: (code: string) => void
  className?: string
}

interface DebugSession {
  id: string
  name: string
  status: 'running' | 'paused' | 'stopped' | 'error'
  startTime: Date
  breakpoints: number[]
  variables: Record<string, any>
  callStack: string[]
  console: Array<{
    type: 'log' | 'error' | 'warn' | 'info'
    message: string
    timestamp: Date
  }>
}

const InteractivePlayground: React.FC<InteractivePlaygroundProps> = ({
  code,
  language = 'typescript',
  onCodeChange,
  className = ''
}) => {
  const [isRunning, setIsRunning] = useState(false)
  const [debugSession, setDebugSession] = useState<DebugSession | null>(null)
  const [showConsole, setShowConsole] = useState(true)
  const [showVariables, setShowVariables] = useState(true)
  const [showCallStack, setShowCallStack] = useState(false)
  const [selectedBreakpoint, setSelectedBreakpoint] = useState<number | null>(null)
  const [consoleOutput, setConsoleOutput] = useState<Array<{
    type: 'log' | 'error' | 'warn' | 'info'
    message: string
    timestamp: Date
  }>>([])

  const consoleRef = useRef<HTMLDivElement>(null)

  // Mock debug session data
  useEffect(() => {
    if (isRunning) {
      const session: DebugSession = {
        id: 'debug-001',
        name: 'Interactive Session',
        status: 'running',
        startTime: new Date(),
        breakpoints: [5, 12, 18],
        variables: {
          'user': { name: 'John Doe', age: 30, active: true },
          'count': 42,
          'items': ['apple', 'banana', 'cherry'],
          'config': { theme: 'dark', notifications: true }
        },
        callStack: [
          'App.render()',
          'Dashboard.loadData()',
          'API.fetchUsers()',
          'UserService.getProfile()'
        ],
        console: [
          { type: 'log', message: 'Application started successfully', timestamp: new Date() },
          { type: 'info', message: 'Connected to development server', timestamp: new Date() },
          { type: 'warn', message: 'Using deprecated API endpoint', timestamp: new Date() }
        ]
      }
      setDebugSession(session)
      setConsoleOutput(session.console)
    } else {
      setDebugSession(null)
    }
  }, [isRunning])

  const handleRun = async () => {
    setIsRunning(true)
    // Simulate code execution
    setTimeout(() => {
      addConsoleMessage('log', 'Code executed successfully')
      setIsRunning(false)
    }, 2000)
  }

  const handleDebug = () => {
    setIsRunning(!isRunning)
  }

  const handleStop = () => {
    setIsRunning(false)
    addConsoleMessage('info', 'Execution stopped by user')
  }

  const addConsoleMessage = (type: 'log' | 'error' | 'warn' | 'info', message: string) => {
    setConsoleOutput(prev => [...prev, {
      type,
      message,
      timestamp: new Date()
    }])
  }

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />
      case 'warn': return <AlertCircle className="w-4 h-4 text-yellow-400" />
      case 'info': return <CheckCircle className="w-4 h-4 text-blue-400" />
      default: return <CheckCircle className="w-4 h-4 text-green-400" />
    }
  }

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'warn': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'info': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      default: return 'text-green-400 bg-green-400/10 border-green-400/20'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden ${className}`}
    >
      {/* Playground Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-b border-slate-600/50">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <Terminal className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">Interactive Playground</h3>
            <p className="text-slate-400 text-sm">Live debugging and execution</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Execution Controls */}
          <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg p-1">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className={`btn btn-sm ${isRunning ? 'btn-secondary' : 'btn-success'}`}
            >
              <Play className="w-4 h-4 mr-1" />
              Run
            </button>

            <button
              onClick={handleDebug}
              className={`btn btn-sm ${isRunning ? 'btn-warning' : 'btn-primary'}`}
            >
              <Bug className="w-4 h-4 mr-1" />
              Debug
            </button>

            <button
              onClick={handleStop}
              disabled={!isRunning}
              className="btn btn-error btn-sm"
            >
              <Square className="w-4 h-4 mr-1" />
              Stop
            </button>
          </div>

          {/* Status Indicator */}
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getStatusColor(isRunning ? 'info' : 'log')}`}>
            <div className={`w-2 h-2 rounded-full animate-pulse ${isRunning ? 'bg-green-400' : 'bg-slate-400'}`}></div>
            <span className="text-sm font-medium text-white">
              {isRunning ? 'Running' : 'Ready'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex h-96">
        {/* Main Execution Area */}
        <div className="flex-1 flex flex-col">
          {/* Console Output */}
          <div className="flex-1 bg-slate-900 border-b border-slate-700">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-white">Console Output</span>
                <div className="badge badge-primary">{consoleOutput.length}</div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="btn btn-secondary btn-sm">
                  <Filter className="w-4 h-4 mr-1" />
                  Filter
                </button>
                <button
                  onClick={() => setConsoleOutput([])}
                  className="btn btn-secondary btn-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div ref={consoleRef} className="p-4 h-64 overflow-y-auto scrollbar-thin scrollbar-elite">
              <AnimatePresence>
                {consoleOutput.map((output, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`flex items-start space-x-3 mb-2 p-3 rounded-lg border ${getStatusColor(output.type)}`}
                  >
                    {getStatusIcon(output.type)}
                    <div className="flex-1">
                      <div className="text-sm font-mono text-slate-200">{output.message}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        {output.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {consoleOutput.length === 0 && (
                <div className="text-center text-slate-400 py-8">
                  <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Console output will appear here</p>
                  <p className="text-sm mt-1">Click "Run" to execute your code</p>
                </div>
              )}
            </div>
          </div>

          {/* Live Preview */}
          <div className="h-32 bg-slate-800 border-t border-slate-700">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-600">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-white">Live Preview</span>
              </div>
              <button className="btn btn-secondary btn-sm">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 h-full">
              <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Eye className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">Preview will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Panel */}
        <AnimatePresence>
          {debugSession && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '320px', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-slate-700 bg-slate-800/50"
            >
              <div className="p-4 h-full overflow-y-auto">
                {/* Variables Panel */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowVariables(!showVariables)}
                    className="flex items-center justify-between w-full text-left mb-3"
                  >
                    <div className="flex items-center space-x-2">
                      <Database className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-white">Variables</span>
                    </div>
                    {showVariables ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>

                  <AnimatePresence>
                    {showVariables && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-2"
                      >
                        {Object.entries(debugSession.variables).map(([key, value]) => (
                          <div key={key} className="bg-slate-700/50 rounded p-3">
                            <div className="text-sm font-medium text-slate-200 mb-1">{key}</div>
                            <div className="text-xs text-slate-400 font-mono">
                              {JSON.stringify(value, null, 2)}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Call Stack */}
                <div className="mb-6">
                  <button
                    onClick={() => setShowCallStack(!showCallStack)}
                    className="flex items-center justify-between w-full text-left mb-3"
                  >
                    <div className="flex items-center space-x-2">
                      <GitMerge className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-white">Call Stack</span>
                    </div>
                    {showCallStack ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>

                  <AnimatePresence>
                    {showCallStack && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-1"
                      >
                        {debugSession.callStack.map((call, index) => (
                          <div
                            key={index}
                            className={`text-sm p-2 rounded cursor-pointer transition-colors ${
                              index === 0 ? 'bg-blue-500/20 text-blue-300' : 'text-slate-300 hover:bg-slate-700/50'
                            }`}
                          >
                            {call}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Performance Metrics */}
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Activity className="w-4 h-4 text-green-400" />
                    <span className="font-medium text-white">Performance</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-slate-300">
                      <span>Execution Time:</span>
                      <span className="text-green-400">1.2s</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Memory Usage:</span>
                      <span className="text-blue-400">45MB</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>CPU Usage:</span>
                      <span className="text-yellow-400">12%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default InteractivePlayground