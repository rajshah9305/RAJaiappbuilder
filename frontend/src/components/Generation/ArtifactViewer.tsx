import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Code, 
  TestTube, 
  Database, 
  Eye, 
  Download,
  Copy,
  Check
} from 'lucide-react'
import { useGenerationStore } from '../../stores/generationStore'

interface ArtifactViewerProps {
  generationId: string
}

const ArtifactViewer: React.FC<ArtifactViewerProps> = ({ generationId }) => {
  const { getGenerationArtifacts } = useGenerationStore()
  const [artifacts, setArtifacts] = useState<Record<string, any> | null>(null)
  const [selectedArtifact, setSelectedArtifact] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const fetchArtifacts = async () => {
      try {
        const response = await fetch(`/api/v1/generations/${generationId}/artifacts`)
        if (response.ok) {
          const data = await response.json()
          setArtifacts(data.artifacts)
          // Set first artifact as selected
          const artifactKeys = Object.keys(data.artifacts)
          if (artifactKeys.length > 0) {
            setSelectedArtifact(artifactKeys[0])
          }
        }
      } catch (error) {
        console.error('Failed to fetch artifacts:', error)
      }
    }

    fetchArtifacts()
  }, [generationId])

  const artifactTypes = [
    { key: 'architecture', name: 'Architecture', icon: Database, color: 'text-blue-600' },
    { key: 'frontend', name: 'Frontend Code', icon: Code, color: 'text-green-600' },
    { key: 'backend', name: 'Backend Code', icon: Database, color: 'text-purple-600' },
    { key: 'tests', name: 'Tests', icon: TestTube, color: 'text-orange-600' },
    { key: 'review', name: 'Code Review', icon: FileText, color: 'text-red-600' }
  ]

  const copyToClipboard = async (text: string, artifactKey: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(artifactKey)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  if (!artifacts) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Code className="w-6 h-6 text-secondary-600" />
          </div>
          <p className="text-secondary-600">Loading artifacts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex">
      {/* Artifact List */}
      <div className="w-64 bg-secondary-50 border-r border-secondary-200 flex flex-col">
        <div className="p-4 border-b border-secondary-200">
          <h4 className="font-semibold text-secondary-900">Generated Artifacts</h4>
        </div>
        <div className="flex-1 overflow-y-auto">
          {artifactTypes.map((type) => {
            const hasArtifact = artifacts[type.key]
            return (
              <button
                key={type.key}
                onClick={() => setSelectedArtifact(type.key)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-secondary-100 transition-colors ${
                  selectedArtifact === type.key ? 'bg-primary-100 border-r-2 border-primary-500' : ''
                }`}
                disabled={!hasArtifact}
              >
                <type.icon className={`w-5 h-5 ${type.color} ${!hasArtifact ? 'opacity-50' : ''}`} />
                <span className={`font-medium ${!hasArtifact ? 'text-secondary-400' : 'text-secondary-900'}`}>
                  {type.name}
                </span>
                {!hasArtifact && (
                  <span className="text-xs text-secondary-400 ml-auto">Not available</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Artifact Content */}
      <div className="flex-1 flex flex-col">
        {selectedArtifact && artifacts[selectedArtifact] && (
          <>
            <div className="p-4 border-b border-secondary-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {artifactTypes.find(t => t.key === selectedArtifact)?.icon && (
                    React.createElement(
                      artifactTypes.find(t => t.key === selectedArtifact)!.icon,
                      { className: `w-5 h-5 ${artifactTypes.find(t => t.key === selectedArtifact)!.color}` }
                    )
                  )}
                  <h4 className="font-semibold text-secondary-900">
                    {artifactTypes.find(t => t.key === selectedArtifact)?.name}
                  </h4>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(artifacts[selectedArtifact], selectedArtifact)}
                    className="inline-flex items-center px-3 py-1 text-sm bg-secondary-100 text-secondary-700 rounded-md hover:bg-secondary-200 transition-colors"
                  >
                    {copied === selectedArtifact ? (
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
                  <button className="inline-flex items-center px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <div className="h-full p-4 bg-secondary-50">
                <div className="h-full bg-white rounded-lg border border-secondary-200 overflow-hidden">
                  <pre className="h-full overflow-auto p-4 text-sm font-mono text-secondary-900 whitespace-pre-wrap">
                    {artifacts[selectedArtifact]}
                  </pre>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedArtifact && !artifacts[selectedArtifact] && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-secondary-400" />
              </div>
              <h4 className="font-semibold text-secondary-900 mb-2">No Content Available</h4>
              <p className="text-secondary-600">
                This artifact is not yet available or failed to generate.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArtifactViewer
