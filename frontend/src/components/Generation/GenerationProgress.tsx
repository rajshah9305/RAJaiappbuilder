import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { useGenerationStore } from '../../stores/generationStore'

interface GenerationProgressProps {
  generationId: string
}

const GenerationProgress: React.FC<GenerationProgressProps> = ({ generationId }) => {
  const { getGenerationStatus, updateGeneration } = useGenerationStore()
  const [generation, setGeneration] = useState(getGenerationStatus(generationId))

  const phases = [
    { id: 'architect', name: 'Architecture Planning', description: 'Analyzing requirements and designing system architecture' },
    { id: 'frontend', name: 'Frontend Development', description: 'Creating user interface components and interactions' },
    { id: 'backend', name: 'Backend Development', description: 'Building API endpoints and business logic' },
    { id: 'testing', name: 'Test Generation', description: 'Creating comprehensive test suites' },
    { id: 'review', name: 'Code Review', description: 'Reviewing code quality and best practices' }
  ]

  const getPhaseStatus = (phaseId: string) => {
    if (!generation) return 'pending'
    
    if (generation.status === 'failed') return 'failed'
    if (generation.status === 'completed') return 'completed'
    if (generation.status === 'in_progress') {
      // Simple logic to determine current phase
      const phaseIndex = phases.findIndex(p => p.id === phaseId)
      const currentPhase = Math.floor((Date.now() - new Date(generation.created_at).getTime()) / 30000) // 30 seconds per phase
      if (phaseIndex < currentPhase) return 'completed'
      if (phaseIndex === currentPhase) return 'in_progress'
      return 'pending'
    }
    
    return 'pending'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'in_progress':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-secondary-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 border-green-200'
      case 'in_progress':
        return 'bg-blue-100 border-blue-200'
      case 'failed':
        return 'bg-red-100 border-red-200'
      default:
        return 'bg-secondary-100 border-secondary-200'
    }
  }

  return (
    <div className="bg-white border-b border-secondary-200 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">Generation Progress</h3>
            <p className="text-sm text-secondary-600">
              Multi-agent team is working on your application...
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-secondary-600">In Progress</span>
          </div>
        </div>

        <div className="space-y-4">
          {phases.map((phase, index) => {
            const status = getPhaseStatus(phase.id)
            const isLast = index === phases.length - 1
            
            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex items-center space-x-4 p-4 rounded-lg border ${getStatusColor(status)}`}
              >
                <div className="flex-shrink-0">
                  {getStatusIcon(status)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-secondary-900">{phase.name}</h4>
                  <p className="text-sm text-secondary-600">{phase.description}</p>
                </div>
                {!isLast && (
                  <div className="w-px h-8 bg-secondary-200 ml-4"></div>
                )}
              </motion.div>
            )
          })}
        </div>

        {generation?.status === 'completed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">Generation Completed!</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Your application has been successfully generated and is ready for deployment.
            </p>
          </motion.div>
        )}

        {generation?.status === 'failed' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-900">Generation Failed</span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              There was an error during generation. Please try again.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default GenerationProgress
