import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Copy,
  Download,
  Play,
  Maximize2,
  Minimize2,
  Check,
  Code,
  Users,
  MessageCircle,
  Share2,
  Clock
} from 'lucide-react'

interface CodeEditorProps {
  code: string
  language?: string
  readOnly?: boolean
  onChange?: (code: string) => void
  onRun?: () => void
  className?: string
  collaborative?: boolean
  sessionId?: string
  currentUser?: {
    id: string
    name: string
    avatar?: string
    color: string
  }
  collaborators?: Array<{
    id: string
    name: string
    avatar?: string
    color: string
    cursor?: { line: number; column: number }
    selection?: { start: { line: number; column: number }, end: { line: number; column: number } }
  }>
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language = 'typescript',
  readOnly = false,
  onChange,
  onRun,
  className = '',
  collaborative = false,
  collaborators = []
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showCollaborators, setShowCollaborators] = useState(false)
  const [comments] = useState<Array<{
    id: string
    user: string
    line: number
    content: string
    timestamp: Date
  }>>([])
  const [isConnected] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code.${language === 'typescript' ? 'ts' : language}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'F11') {
      e.preventDefault()
      setIsFullscreen(!isFullscreen)
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isFullscreen])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden ${className} ${
        isFullscreen ? 'fixed inset-0 z-50 bg-white/95 backdrop-blur-xl' : ''
      }`}
    >
      {/* Enhanced Editor Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-50/80 to-slate-100/80 border-b border-slate-200/60">
        <div className="flex items-center space-x-4">
          {/* Window Controls */}
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full shadow-sm"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-sm"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full shadow-sm"></div>
          </div>

          <div className="h-6 w-px bg-slate-300"></div>

          {/* File Info */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">
                {language === 'typescript' ? 'app.tsx' : `main.${language}`}
              </div>
              <div className="text-xs text-slate-500">{language.toUpperCase()}</div>
            </div>
          </div>

          {/* Collaboration Status */}
          {collaborative && (
            <>
              <div className="h-6 w-px bg-slate-300"></div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                  <span className="text-sm text-slate-600">
                    {isConnected ? 'Live' : 'Offline'}
                  </span>
                </div>

                <div className="flex -space-x-2">
                  {collaborators.slice(0, 3).map((collaborator, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: collaborator.color }}
                    >
                      {collaborator.name.charAt(0).toUpperCase()}
                    </motion.div>
                  ))}
                  {collaborators.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-slate-400 border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                      +{collaborators.length - 3}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowCollaborators(!showCollaborators)}
                  className="btn btn-secondary btn-sm"
                >
                  <Users className="w-4 h-4 mr-1" />
                  {collaborators.length}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Live Actions */}
          <AnimatePresence>
            {collaborative && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center space-x-2"
              >
                <button className="btn btn-secondary btn-sm">
                  <Share2 className="w-4 h-4 mr-1" />
                  Invite
                </button>

                <button className="btn btn-secondary btn-sm">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Comments
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Editor Controls */}
          {onRun && (
            <button
              onClick={onRun}
              className="btn btn-success btn-sm animate-glow"
            >
              <Play className="w-4 h-4 mr-1" />
              Run
            </button>
          )}

          <button
            onClick={handleCopy}
            className="btn btn-secondary btn-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="btn btn-secondary btn-sm"
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="btn btn-secondary btn-sm"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4 mr-1" />
                Exit
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 mr-1" />
                Fullscreen
              </>
            )}
          </button>
        </div>
      </div>

      {/* Enhanced Editor Content */}
      <div className="relative bg-slate-900/95">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          className={`w-full h-96 p-4 pl-16 font-mono text-sm text-slate-100 bg-slate-900/95 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all duration-200 ${
            readOnly ? 'cursor-default' : ''
          }`}
          style={{
            fontFamily: 'JetBrains Mono, Fira Code, monospace',
            lineHeight: '1.6',
            tabSize: 2
          }}
          placeholder="Start coding... Your AI agents are ready to assist!"
        />

        {/* Enhanced Line Numbers */}
        <div className="absolute left-0 top-0 w-12 h-full bg-slate-800/80 border-r border-slate-700/50 pointer-events-none">
          <div className="p-4 text-xs text-slate-400 font-mono leading-6">
            {code.split('\n').map((_, index) => (
              <div
                key={index}
                className={`relative ${comments.some(c => c.line === index + 1) ? 'text-blue-400' : ''}`}
              >
                {index + 1}
                {comments.some(c => c.line === index + 1) && (
                  <div className="absolute -right-1 -top-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Collaborative Cursors */}
        <AnimatePresence>
          {collaborative && collaborators.map((collaborator) => (
            collaborator.cursor && (
              <motion.div
                key={`cursor-${collaborator.id}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute pointer-events-none z-10"
                style={{
                  top: `${(collaborator.cursor.line - 1) * 24 + 16}px`,
                  left: `${48 + (collaborator.cursor.column * 8.5)}px`,
                }}
              >
                <div
                  className="w-0.5 h-6 animate-pulse"
                  style={{ backgroundColor: collaborator.color }}
                ></div>
                <div
                  className="absolute -top-6 left-1 px-2 py-1 rounded text-xs font-bold text-white whitespace-nowrap"
                  style={{ backgroundColor: collaborator.color }}
                >
                  {collaborator.name}
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Comments Sidebar */}
        <AnimatePresence>
          {showCollaborators && collaborative && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute right-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl border-l border-slate-200 shadow-2xl"
            >
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">Collaborators</h3>
                  <button
                    onClick={() => setShowCollaborators(false)}
                    className="btn btn-secondary btn-sm"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {collaborators.map((collaborator) => (
                  <motion.div
                    key={collaborator.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: collaborator.color }}
                    >
                      {collaborator.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{collaborator.name}</div>
                      <div className="text-sm text-slate-600">
                        {collaborator.cursor ? `Line ${collaborator.cursor.line}` : 'Viewing'}
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${Math.random() > 0.5 ? 'bg-green-400' : 'bg-slate-400'}`}></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Editor Footer */}
      <div className="px-6 py-3 bg-gradient-to-r from-slate-100/80 to-slate-200/80 border-t border-slate-200/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-slate-600">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live Editing</span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <span>Lines: <span className="font-bold text-slate-900">{code.split('\n').length}</span></span>
              <span>Characters: <span className="font-bold text-slate-900">{code.length}</span></span>
              <span>Language: <span className="font-bold text-slate-900">{language.toUpperCase()}</span></span>
            </div>

            {collaborative && (
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1">
                  {collaborators.slice(0, 3).map((collaborator, index) => (
                    <div
                      key={index}
                      className="w-5 h-5 rounded-full border border-white flex items-center justify-center text-xs font-bold text-white"
                      style={{ backgroundColor: collaborator.color }}
                    >
                      {collaborator.name.charAt(0).toUpperCase()}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-slate-600">
                  {collaborators.length} collaborator{collaborators.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <span>UTF-8</span>
              <span>LF</span>
            </div>

            {collaborative && (
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3" />
                <span>Auto-saved</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CodeEditor
