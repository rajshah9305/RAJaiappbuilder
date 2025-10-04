import { useEffect } from 'react'
import { useAppStore } from '../stores/appStore'

export const useTheme = () => {
  const { theme, setTheme } = useAppStore()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  return {
    theme,
    toggleTheme,
    setTheme
  }
}
