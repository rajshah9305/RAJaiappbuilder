import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'

// Layout components
import Layout from './components/Layout/Layout'
import Header from './components/Layout/Header'
import Sidebar from './components/Layout/Sidebar'

// Page components
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import GenerationPage from './pages/GenerationPage'
import SandboxPage from './pages/SandboxPage'
import ProjectsPage from './pages/ProjectsPage'
import SettingsPage from './pages/SettingsPage'

// Context providers
import { AppProvider } from './contexts/AppContext'
import { WebSocketProvider } from './contexts/WebSocketContext'

// Hooks
import { useTheme } from './hooks/useTheme'

function App() {
  const { theme } = useTheme()

  return (
    <AppProvider>
      <WebSocketProvider>
        <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
          <Router>
            <Layout>
              <Header />
              <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/generate" element={<GenerationPage />} />
                      <Route path="/sandbox/:id" element={<SandboxPage />} />
                      <Route path="/projects" element={<ProjectsPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                  </motion.div>
                </main>
              </div>
            </Layout>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: theme === 'dark' ? '#1e293b' : '#ffffff',
                  color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                  border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
                },
                success: {
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </Router>
        </div>
      </WebSocketProvider>
    </AppProvider>
  )
}

export default App
