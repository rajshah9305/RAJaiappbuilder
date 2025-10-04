import { create } from 'zustand'

interface Generation {
  id: string
  project_id?: string
  prompt: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled'
  created_at: string
  completed_at?: string
  artifacts?: Record<string, any>
  errors?: string[]
}

interface GenerationState {
  generations: Generation[]
  currentGeneration: string | null
  
  // Actions
  createGeneration: (data: { prompt: string; context?: any }) => Promise<string>
  getGenerationStatus: (id: string) => Generation | null
  getGenerationArtifacts: (id: string) => Record<string, any> | null
  updateGeneration: (id: string, updates: Partial<Generation>) => void
  setCurrentGeneration: (id: string | null) => void
}

export const useGenerationStore = create<GenerationState>((set, get) => ({
  generations: [],
  currentGeneration: null,
  
  createGeneration: async (data) => {
    const response = await fetch('/api/v1/generations/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: data.prompt,
        context: data.context,
        stream: false
      })
    })
    
    if (!response.ok) {
      throw new Error('Failed to create generation')
    }
    
    const result = await response.json()
    
    const generation: Generation = {
      id: result.generation_id,
      project_id: result.project_id,
      prompt: data.prompt,
      status: 'pending',
      created_at: result.created_at,
      artifacts: {},
      errors: []
    }
    
    set((state) => ({
      generations: [generation, ...state.generations],
      currentGeneration: result.generation_id
    }))
    
    return result.generation_id
  },
  
  getGenerationStatus: (id) => {
    const state = get()
    return state.generations.find(g => g.id === id) || null
  },
  
  getGenerationArtifacts: (id) => {
    const state = get()
    const generation = state.generations.find(g => g.id === id)
    return generation?.artifacts || null
  },
  
  updateGeneration: (id, updates) => {
    set((state) => ({
      generations: state.generations.map(g => 
        g.id === id ? { ...g, ...updates } : g
      )
    }))
  },
  
  setCurrentGeneration: (id) => {
    set({ currentGeneration: id })
  }
}))
