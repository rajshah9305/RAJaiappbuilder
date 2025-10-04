import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Lightbulb,
  Copy,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Code2,
  Zap,
  Target,
  AlertTriangle,
  Info,
  Star
} from 'lucide-react'

interface AICodeAssistantProps {
  code: string
  language: string
  cursorPosition: { line: number; column: number }
  onSuggestionApply?: (suggestion: string) => void
  className?: string
}

interface AISuggestion {
  id: string
  type: 'completion' | 'optimization' | 'bugfix' | 'enhancement' | 'refactor'
  title: string
  description: string
  code: string
  confidence: number
  reasoning: string
  tags: string[]
  upvotes: number
  downvotes: number
}

interface AIAnalysis {
  score: number
  issues: Array<{
    type: 'error' | 'warning' | 'info'
    message: string
    line: number
    column: number
    suggestion?: string
  }>
  suggestions: Array<{
    type: 'performance' | 'security' | 'maintainability' | 'readability'
    message: string
    impact: 'high' | 'medium' | 'low'
  }>
  metrics: {
    complexity: number
    readability: number
    performance: number
    security: number
  }
}

const AICodeAssistant: React.FC<AICodeAssistantProps> = ({
  code,
  language,
  cursorPosition,
  onSuggestionApply,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'suggestions' | 'analysis' | 'chat'>('suggestions')
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{
    type: 'user' | 'ai'
    message: string
    timestamp: Date
  }>>([])

  const [chatInput, setChatInput] = useState('')
  const chatRef = useRef<HTMLDivElement>(null)

  // Mock AI analysis and suggestions
  useEffect(() => {
    if (code.length > 50) {
      analyzeCode()
      generateSuggestions()
    }
  }, [code, cursorPosition])

  const analyzeCode = async () => {
    setIsLoading(true)

    // Simulate AI analysis
    setTimeout(() => {
      const mockAnalysis: AIAnalysis = {
        score: 87,
        issues: [
          {
            type: 'warning',
            message: 'Unused variable detected',
            line: 12,
            column: 5,
            suggestion: 'Consider removing or using the variable'
          },
          {
            type: 'info',
            message: 'Consider adding error handling',
            line: 25,
            column: 10,
            suggestion: 'Add try-catch block for better error management'
          }
        ],
        suggestions: [
          {
            type: 'performance',
            message: 'Use memoization for expensive calculations',
            impact: 'medium'
          },
          {
            type: 'readability',
            message: 'Extract long function into smaller components',
            impact: 'high'
          }
        ],
        metrics: {
          complexity: 6.5,
          readability: 8.2,
          performance: 7.8,
          security: 9.1
        }
      }
      setAnalysis(mockAnalysis)
      setIsLoading(false)
    }, 1500)
  }

  const generateSuggestions = async () => {
    setIsLoading(true)

    // Simulate AI suggestions
    setTimeout(() => {
      const mockSuggestions: AISuggestion[] = [
        {
          id: '1',
          type: 'completion',
          title: 'Complete function implementation',
          description: 'Add proper error handling and return type',
          code: `try {
  // Implementation here
  return result;
} catch (error) {
  console.error('Error:', error);
  throw new Error('Operation failed');
}`,
          confidence: 0.94,
          reasoning: 'Based on the function signature and context, this completes the implementation with proper error handling.',
          tags: ['completion', 'error-handling'],
          upvotes: 12,
          downvotes: 1
        },
        {
          id: '2',
          type: 'optimization',
          title: 'Performance optimization',
          description: 'Use useMemo for expensive computation',
          code: `const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);`,
          confidence: 0.89,
          reasoning: 'The computation runs on every render. Memoization will improve performance.',
          tags: ['optimization', 'react', 'performance'],
          upvotes: 8,
          downvotes: 0
        },
        {
          id: '3',
          type: 'enhancement',
          title: 'Add type safety',
          description: 'Improve type definitions for better IntelliSense',
          code: `interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
}`,
          confidence: 0.91,
          reasoning: 'Adding proper TypeScript interfaces will improve code maintainability and developer experience.',
          tags: ['typescript', 'types', 'enhancement'],
          upvotes: 15,
          downvotes: 0
        }
      ]
      setSuggestions(mockSuggestions)
      setIsLoading(false)
    }, 2000)
  }

  const handleSuggestionApply = (suggestion: AISuggestion) => {
    onSuggestionApply?.(suggestion.code)
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const newMessage = {
      type: 'user' as const,
      message: chatInput,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, newMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        type: 'ai' as const,
        message: `I understand you want to know about "${chatInput}". Based on your code context, here's what I recommend...`,
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, aiResponse])
    }, 1000)

    setChatInput('')
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'completion': return <Code2 className="w-4 h-4" />
      case 'optimization': return <Zap className="w-4 h-4" />
      case 'bugfix': return <AlertTriangle className="w-4 h-4" />
      case 'enhancement': return <Star className="w-4 h-4" />
      case 'refactor': return <RefreshCw className="w-4 h-4" />
      default: return <Lightbulb className="w-4 h-4" />
    }
  }

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'completion': return 'from-blue-500 to-blue-600'
      case 'optimization': return 'from-green-500 to-green-600'
      case 'bugfix': return 'from-red-500 to-red-600'
      case 'enhancement': return 'from-purple-500 to-purple-600'
      case 'refactor': return 'from-orange-500 to-orange-600'
      default: return 'from-slate-500 to-slate-600'
    }
  }

  const getAnalysisColor = (score: number) => {
    if (score >= 90) return 'text-green-400 bg-green-400/10'
    if (score >= 70) return 'text-blue-400 bg-blue-400/10'
    if (score >= 50) return 'text-yellow-400 bg-yellow-400/10'
    return 'text-red-400 bg-red-400/10'
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.95 }}
          className={`fixed right-6 top-1/2 transform -translate-y-1/2 w-96 h-[600px] glass-morphism rounded-2xl border border-white/20 shadow-2xl z-50 ${className}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center animate-pulse-gentle">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">AI Code Assistant</h3>
                <p className="text-white/60 text-sm">Intelligent code suggestions</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${analysis ? getAnalysisColor(analysis.score) : 'text-slate-400'}`}>
                {analysis ? `${analysis.score}%` : 'Analyzing...'}
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="btn btn-secondary btn-sm"
              >
                ×
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/20">
            {[
              { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
              { id: 'analysis', label: 'Analysis', icon: Target },
              { id: 'chat', label: 'Chat', icon: MessageCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-white bg-white/10 border-b-2 border-primary-400'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {/* Suggestions Tab */}
            <AnimatePresence mode="wait">
              {activeTab === 'suggestions' && (
                <motion.div
                  key="suggestions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full overflow-y-auto p-4 space-y-4"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
                      <span className="ml-3 text-white/60">Generating suggestions...</span>
                    </div>
                  ) : (
                    suggestions.map((suggestion) => (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 bg-gradient-to-r ${getSuggestionColor(suggestion.type)} rounded-lg flex items-center justify-center`}>
                              {getSuggestionIcon(suggestion.type)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">{suggestion.title}</h4>
                              <p className="text-white/60 text-sm">{suggestion.description}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <ThumbsUp className="w-3 h-3 text-green-400" />
                              <span className="text-xs text-white/60">{suggestion.upvotes}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ThumbsDown className="w-3 h-3 text-red-400" />
                              <span className="text-xs text-white/60">{suggestion.downvotes}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
                          <pre className="text-sm text-slate-200 font-mono whitespace-pre-wrap">
                            {suggestion.code}
                          </pre>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <Target className="w-3 h-3 text-blue-400" />
                              <span className="text-xs text-white/60">{Math.round(suggestion.confidence * 100)}% confident</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button className="btn btn-secondary btn-sm">
                              <Copy className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleSuggestionApply(suggestion)}
                              className="btn btn-primary btn-sm"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Analysis Tab */}
            <AnimatePresence mode="wait">
              {activeTab === 'analysis' && analysis && (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full overflow-y-auto p-4 space-y-6"
                >
                  {/* Score Overview */}
                  <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl p-6">
                    <h4 className="font-bold text-white mb-4">Code Quality Score</h4>
                    <div className="flex items-center space-x-4">
                      <div className={`text-3xl font-bold ${getAnalysisColor(analysis.score).split(' ')[0]}`}>
                        {analysis.score}%
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-primary-400 to-accent-400 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${analysis.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h5 className="font-semibold text-white mb-3">Detailed Metrics</h5>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(analysis.metrics).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-white/60 capitalize">{key}:</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white">{value}</span>
                            <div className="w-12 h-1 bg-slate-600 rounded-full">
                              <div
                                className="h-1 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full transition-all"
                                style={{ width: `${(value / 10) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Issues */}
                  <div className="space-y-3">
                    <h5 className="font-semibold text-white">Issues Found</h5>
                    {analysis.issues.map((issue, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${getAnalysisColor(analysis.score)}`}>
                        <div className="flex items-center space-x-2 mb-1">
                          {issue.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                          {issue.type === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                          {issue.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
                          <span className="font-medium text-white text-sm">{issue.message}</span>
                        </div>
                        <div className="text-white/60 text-xs">
                          Line {issue.line}, Column {issue.column}
                        </div>
                        {issue.suggestion && (
                          <div className="mt-2 p-2 bg-slate-800/50 rounded text-white/80 text-xs">
                            💡 {issue.suggestion}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Suggestions */}
                  <div className="space-y-3">
                    <h5 className="font-semibold text-white">Improvement Suggestions</h5>
                    {analysis.suggestions.map((suggestion, index) => (
                      <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white text-sm">{suggestion.message}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            suggestion.impact === 'high' ? 'bg-red-400/20 text-red-400' :
                            suggestion.impact === 'medium' ? 'bg-yellow-400/20 text-yellow-400' :
                            'bg-green-400/20 text-green-400'
                          }`}>
                            {suggestion.impact} impact
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Tab */}
            <AnimatePresence mode="wait">
              {activeTab === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full flex flex-col"
                >
                  <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatMessages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          msg.type === 'user'
                            ? 'bg-primary-500 text-white'
                            : 'bg-white/10 text-white/80'
                        }`}>
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-1 ${msg.type === 'user' ? 'text-primary-100' : 'text-white/60'}`}>
                            {msg.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-white/20">
                    <form onSubmit={handleChatSubmit} className="flex space-x-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask me anything about your code..."
                        className="flex-1 input bg-white/10 border-white/20 text-white placeholder-white/50"
                      />
                      <button type="submit" className="btn btn-primary btn-sm">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsVisible(!isVisible)}
        className="fixed right-6 bottom-6 w-14 h-14 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full shadow-2xl hover:shadow-primary-500/25 transition-all duration-300 z-50"
      >
        <Sparkles className="w-7 h-7 text-white mx-auto" />
      </motion.button>
    </AnimatePresence>
  )
}

export default AICodeAssistant