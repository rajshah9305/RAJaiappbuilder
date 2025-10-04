import React from 'react'
import { useParams } from 'react-router-dom'

const SandboxPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b border-secondary-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-secondary-900">Sandbox {id}</h1>
        <p className="text-secondary-600">Live preview and debugging environment</p>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🚀</span>
          </div>
          <h3 className="text-xl font-semibold text-secondary-900 mb-2">
            Sandbox Environment
          </h3>
          <p className="text-secondary-600">
            Sandbox {id} is loading...
          </p>
        </div>
      </div>
    </div>
  )
}

export default SandboxPage
