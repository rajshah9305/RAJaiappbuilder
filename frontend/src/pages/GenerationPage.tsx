import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Code,
  TestTube,
  Eye,
  Download,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Settings,
  Palette,
  Database,
  Smartphone,
  Globe,
  Layers,
  Zap,
  Target,
  Lightbulb,
  ChevronDown,
  Star,
  BookmarkPlus,
  History,
  Layout,
  Cpu,
  Terminal,
  Shield,
  Rocket
} from 'lucide-react'
import { useGenerationStore } from '../stores/generationStore'
import { useWebSocket } from '../contexts/WebSocketContext'
import CodeEditor from '../components/CodeEditor/CodeEditor'
import GenerationProgress from '../components/Generation/GenerationProgress'
import ArtifactViewer from '../components/Generation/ArtifactViewer'
import InteractivePlayground from '../components/Playground/InteractivePlayground'
import AICodeAssistant from '../components/AI/AICodeAssistant'

const GenerationPage: React.FC = () => {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentGeneration, setCurrentGeneration] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [selectedFramework, setSelectedFramework] = useState('nextjs')
  const [showPlayground, setShowPlayground] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
  
  const { 
    generations, 
    createGeneration, 
    getGenerationStatus, 
    getGenerationArtifacts 
  } = useGenerationStore()
  
  const { sendMessage, isConnected } = useWebSocket()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Advanced template system
  const templates = [
    {
      id: 'ecommerce',
      name: 'E-commerce Platform',
      description: 'Modern online store with product catalog, cart, and checkout',
      icon: Globe,
      category: 'Business',
      complexity: 'Advanced',
      features: ['Product Management', 'Shopping Cart', 'Payment Integration', 'Order Tracking'],
      preview: '🛒'
    },
    {
      id: 'dashboard',
      name: 'Analytics Dashboard',
      description: 'Data visualization and business intelligence dashboard',
      icon: Target,
      category: 'Analytics',
      complexity: 'Intermediate',
      features: ['Charts & Graphs', 'Real-time Data', 'Export Functions', 'Custom Reports'],
      preview: '📊'
    },
    {
      id: 'social',
      name: 'Social Platform',
      description: 'Community platform with user profiles and interactions',
      icon: Shield,
      category: 'Social',
      complexity: 'Advanced',
      features: ['User Profiles', 'Posts & Comments', 'Real-time Chat', 'Media Upload'],
      preview: '👥'
    },
    {
      id: 'taskmanager',
      name: 'Task Manager',
      description: 'Project management with kanban boards and team collaboration',
      icon: CheckCircle,
      category: 'Productivity',
      complexity: 'Intermediate',
      features: ['Kanban Boards', 'Team Assignment', 'Progress Tracking', 'File Attachments'],
      preview: '✅'
    }
  ]

  const frameworks = [
    { id: 'nextjs', name: 'Next.js', description: 'React framework with SSR', icon: Layers },
    { id: 'react', name: 'React', description: 'Component-based UI library', icon: Code },
    { id: 'vue', name: 'Vue.js', description: 'Progressive JavaScript framework', icon: Globe },
    { id: 'svelte', name: 'Svelte', description: 'Cybernetically enhanced web apps', icon: Zap },
    { id: 'angular', name: 'Angular', description: 'Enterprise web framework', icon: Shield }
  ]

  const aiAgents = [
    { name: 'Architect', role: 'System Design', status: 'active', progress: 100 },
    { name: 'Frontend Dev', role: 'UI Components', status: 'active', progress: 85 },
    { name: 'Backend Dev', role: 'API Development', status: 'active', progress: 70 },
    { name: 'Tester', role: 'Quality Assurance', status: 'pending', progress: 0 },
    { name: 'Reviewer', role: 'Code Review', status: 'pending', progress: 0 }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || isGenerating) return

    setIsGenerating(true)
    try {
      const generationId = await createGeneration({
        prompt: prompt.trim(),
        context: {
          framework: 'nextjs',
          styling: 'tailwind',
          features: ['authentication', 'database', 'api']
        }
      })
      
      setCurrentGeneration(generationId)
      setPrompt('')
    } catch (error) {
      console.error('Failed to start generation:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDeploy = async (generationId: string) => {
    try {
      // Deploy generation to sandbox
      const response = await fetch(`/api/v1/generations/${generationId}/deploy`, {
        method: 'POST'
      })
      
      if (response.ok) {
        const data = await response.json()
        // Redirect to sandbox page
        window.location.href = `/sandbox/${data.sandbox_id}`
      }
    } catch (error) {
      console.error('Failed to deploy:', error)
    }
  }

  const examplePrompts = [
    "Create a modern e-commerce website with product catalog, shopping cart, and checkout",
    "Build a task management app with user authentication and real-time collaboration",
    "Design a blog platform with markdown support and comment system",
    "Make a dashboard for analytics with charts and data visualization"
  ]

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Elite Header */}
      <div className="glass-morphism border-b border-white/20 px-8 py-6 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center animate-pulse-gentle">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">AI Code Generation</h1>
              <p className="text-white/70">Advanced multi-agent development platform</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-6"
          >
            {/* Live AI Agents Status */}
            <div className="hidden lg:flex items-center space-x-3">
              {aiAgents.slice(0, 3).map((agent, index) => (
                <motion.div
                  key={agent.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-2 glass-morphism rounded-lg px-3 py-2"
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-medium">{agent.name}</span>
                  <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${agent.progress}%` }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Connection Status */}
            <div className="flex items-center space-x-2 glass-morphism rounded-lg px-4 py-2">
              <div className={`w-3 h-3 rounded-full animate-pulse ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-white text-sm font-medium">
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          {/* Template Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-morphism border-b border-white/20 p-8 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Choose Your Starting Point</h2>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Advanced</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {templates.map((template) => (
                <motion.button
                  key={template.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedTemplate === template.id
                      ? 'border-primary-400 bg-primary-500/20 glass-morphism'
                      : 'border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="text-2xl mb-2">{template.preview}</div>
                  <h3 className="font-semibold text-white text-sm mb-1">{template.name}</h3>
                  <p className="text-white/60 text-xs">{template.category}</p>
                </motion.button>
              ))}
            </div>

            {/* Framework Selection */}
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-white mb-3">Choose Framework</label>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                      {frameworks.map((framework) => (
                        <button
                          key={framework.id}
                          onClick={() => setSelectedFramework(framework.id)}
                          className={`p-3 rounded-lg border transition-all duration-300 ${
                            selectedFramework === framework.id
                              ? 'border-primary-400 bg-primary-500/20'
                              : 'border-white/20 bg-white/10 hover:bg-white/20'
                          }`}
                        >
                          <framework.icon className="w-6 h-6 text-white mx-auto mb-2" />
                          <div className="text-white text-sm font-medium">{framework.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Enhanced Prompt Input */}
          <div className="p-8 flex-1 overflow-hidden">
            <form onSubmit={handleSubmit} className="h-full flex flex-col">
              <div className="flex-1 mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full"
                >
                  <label htmlFor="prompt" className="block text-lg font-semibold text-white mb-4">
                    Describe Your Vision
                  </label>
                  <textarea
                    ref={textareaRef}
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={
                      selectedTemplate
                        ? `Customize your ${templates.find(t => t.id === selectedTemplate)?.name}...`
                        : "Describe the application you want to build in natural language..."
                    }
                    className="w-full h-full min-h-[200px] p-6 border-2 border-white/20 bg-white/10 backdrop-blur-sm rounded-2xl focus:border-primary-400 focus:ring-4 focus:ring-primary-400/20 text-white placeholder-white/50 resize-none transition-all duration-300"
                    disabled={isGenerating}
                  />
                </motion.div>
              </div>

              {/* Enhanced Controls */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Smart Suggestions */}
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <span className="text-white/70 text-sm">AI Suggestions:</span>
                  </div>

                  {examplePrompts.slice(0, 2).map((example, index) => (
                    <motion.button
                      key={index}
                      type="button"
                      onClick={() => setPrompt(example)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white/80 hover:text-white text-sm transition-all duration-300"
                    >
                      {example.length > 30 ? `${example.substring(0, 30)}...` : example}
                    </motion.button>
                  ))}

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {/* Smart prompt enhancement AI */}}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Enhance Prompt
                  </button>
                </div>

                <motion.button
                  type="submit"
                  disabled={!prompt.trim() || isGenerating}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary btn-xl"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-3" />
                      Generate Application
                      <Rocket className="w-5 h-5 ml-3" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>

          {/* Generation Results */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {currentGeneration ? (
                <motion.div
                  key={currentGeneration}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full flex flex-col"
                >
                  <GenerationProgress generationId={currentGeneration} />
                  
                  <div className="flex-1 flex">
                    <div className="flex-1 flex flex-col">
                      <div className="bg-white border-b border-secondary-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-secondary-900">Generated Code</h3>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setShowPreview(!showPreview)}
                              className="btn btn-secondary btn-sm"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              {showPreview ? 'Hide' : 'Show'} Preview
                            </button>

                            <button
                              onClick={() => {
                                setShowPlayground(!showPlayground)
                                setDebugMode(!debugMode)
                              }}
                              className={`btn btn-sm ${showPlayground ? 'btn-warning' : 'btn-primary'}`}
                            >
                              <Terminal className="w-4 h-4 mr-1" />
                              {showPlayground ? 'Exit' : 'Playground'}
                            </button>

                            <button
                              onClick={() => handleDeploy(currentGeneration)}
                              className="btn btn-success btn-sm animate-glow"
                            >
                              <Play className="w-4 h-4 mr-1" />
                              Deploy
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 overflow-hidden">
                        <ArtifactViewer generationId={currentGeneration} />
                      </div>
                    </div>
                    
                    {showPreview && !showPlayground && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '50%' }}
                        exit={{ width: 0 }}
                        className="border-l border-white/20 bg-slate-800/50"
                      >
                        <div className="h-full flex flex-col">
                          <div className="glass-morphism border-b border-white/20 px-6 py-4 backdrop-blur-xl">
                            <h4 className="font-bold text-white">Live Preview</h4>
                          </div>
                          <div className="flex-1 p-6">
                            <div className="w-full h-full bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl border border-white/10 flex items-center justify-center">
                              <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-bounce-gentle">
                                  <Eye className="w-10 h-10 text-white" />
                                </div>
                                <p className="text-white/70 text-lg mb-2">Preview will appear here</p>
                                <p className="text-white/50 text-sm">Deploy to see live preview</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {showPlayground && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '60%' }}
                        exit={{ width: 0 }}
                        className="border-l border-white/20"
                      >
                        <InteractivePlayground
                          code={currentGeneration ? 'console.log("Hello from playground!");' : ''}
                          language={selectedFramework}
                          className="h-full"
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Code className="w-12 h-12 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                      Ready to Generate Code?
                    </h3>
                    <p className="text-secondary-600 max-w-md">
                      Describe your application idea in natural language and our AI agents will create 
                      a complete, production-ready application for you.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* AI Code Assistant */}
      <AICodeAssistant
        code={currentGeneration ? 'const example = "AI-powered development";' : ''}
        language={selectedFramework}
        cursorPosition={cursorPosition}
        onSuggestionApply={(suggestion) => {
          console.log('Applying AI suggestion:', suggestion)
          // Here you would integrate with the code editor to apply suggestions
        }}
      />
    </div>
  )
}

export default GenerationPage
