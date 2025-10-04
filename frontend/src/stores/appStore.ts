import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  username: string
  full_name?: string
  avatar_url?: string
}

interface AppState {
  user: User | null
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  notifications: any[]
  
  // Actions
  setUser: (user: User | null) => void
  setTheme: (theme: 'light' | 'dark') => void
  toggleSidebar: () => void
  addNotification: (notification: any) => void
  removeNotification: (id: string) => void
  logout: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      theme: 'light',
      sidebarOpen: true,
      notifications: [],
      
      setUser: (user) => set({ user }),
      
      setTheme: (theme) => set({ theme }),
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, { ...notification, id: Date.now().toString() }]
      })),
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      
      logout: () => set({ user: null, notifications: [] })
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ 
        user: state.user, 
        theme: state.theme,
        sidebarOpen: state.sidebarOpen 
      })
    }
  )
)
