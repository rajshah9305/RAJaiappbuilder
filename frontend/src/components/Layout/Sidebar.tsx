import React from 'react'
import { motion } from 'framer-motion'
import { 
  Home, 
  Zap, 
  FolderOpen, 
  Settings, 
  HelpCircle,
  Activity,
  Code,
  TestTube,
  Database
} from 'lucide-react'

const Sidebar: React.FC = () => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: false },
    { name: 'Generate', href: '/generate', icon: Zap, current: true },
    { name: 'Projects', href: '/projects', icon: FolderOpen, current: false },
    { name: 'Sandboxes', href: '/sandboxes', icon: Code, current: false },
    { name: 'Tests', href: '/tests', icon: TestTube, current: false },
    { name: 'Database', href: '/database', icon: Database, current: false },
    { name: 'Activity', href: '/activity', icon: Activity, current: false },
  ]

  const secondaryNavigation = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help', href: '/help', icon: HelpCircle },
  ]

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:bg-white/50 md:border-r md:border-secondary-200">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <motion.a
              key={item.name}
              href={item.href}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                item.current
                  ? 'bg-primary-100 text-primary-900'
                  : 'text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900'
              }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  item.current ? 'text-primary-500' : 'text-secondary-400 group-hover:text-secondary-500'
                }`}
              />
              {item.name}
            </motion.a>
          ))}
        </nav>

        <div className="flex-shrink-0 flex border-t border-secondary-200 p-4">
          <nav className="flex-1 space-y-1">
            {secondaryNavigation.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-center px-2 py-2 text-sm font-medium text-secondary-700 rounded-md hover:bg-secondary-100 hover:text-secondary-900 transition-colors"
              >
                <item.icon className="mr-3 h-5 w-5 text-secondary-400 group-hover:text-secondary-500" />
                {item.name}
              </motion.a>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
