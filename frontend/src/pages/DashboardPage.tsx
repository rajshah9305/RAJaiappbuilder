import React from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, 
  Code, 
  TestTube, 
  Database, 
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Play
} from 'lucide-react'

const DashboardPage: React.FC = () => {
  const stats = [
    { label: 'Total Generations', value: '24', icon: Zap, color: 'text-primary-600', bgColor: 'bg-primary-100' },
    { label: 'Active Sandboxes', value: '3', icon: Code, color: 'text-accent-600', bgColor: 'bg-accent-100' },
    { label: 'Tests Passed', value: '156', icon: TestTube, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { label: 'Success Rate', value: '94%', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' }
  ]

  const recentGenerations = [
    {
      id: '1',
      name: 'E-commerce Website',
      status: 'completed',
      created_at: '2 hours ago',
      progress: 100
    },
    {
      id: '2',
      name: 'Task Management App',
      status: 'in_progress',
      created_at: '1 hour ago',
      progress: 75
    },
    {
      id: '3',
      name: 'Blog Platform',
      status: 'failed',
      created_at: '3 hours ago',
      progress: 0
    }
  ]

  const recentActivity = [
    {
      type: 'generation_completed',
      message: 'E-commerce website generation completed',
      timestamp: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      type: 'sandbox_created',
      message: 'New sandbox created for Task Management App',
      timestamp: '1 hour ago',
      icon: Code,
      color: 'text-blue-600'
    },
    {
      type: 'test_failed',
      message: 'Tests failed for Blog Platform',
      timestamp: '3 hours ago',
      icon: AlertCircle,
      color: 'text-red-600'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
        <p className="text-secondary-600 mt-2">Welcome back! Here's what's happening with your projects.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-soft hover:shadow-medium transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-secondary-600">{stat.label}</p>
                <p className="text-3xl font-bold text-secondary-900 mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Generations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-soft"
        >
          <div className="p-6 border-b border-secondary-200">
            <h3 className="text-lg font-semibold text-secondary-900">Recent Generations</h3>
          </div>
          <div className="p-6 space-y-4">
            {recentGenerations.map((generation) => (
              <div key={generation.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <Code className="w-5 h-5 text-secondary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">{generation.name}</p>
                    <p className="text-sm text-secondary-600">{generation.created_at}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {generation.status === 'completed' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </span>
                  )}
                  {generation.status === 'in_progress' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <Clock className="w-3 h-3 mr-1" />
                      In Progress
                    </span>
                  )}
                  {generation.status === 'failed' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Failed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl shadow-soft"
        >
          <div className="p-6 border-b border-secondary-200">
            <h3 className="text-lg font-semibold text-secondary-900">Recent Activity</h3>
          </div>
          <div className="p-6 space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-8 h-8 ${activity.color.includes('green') ? 'bg-green-100' : activity.color.includes('blue') ? 'bg-blue-100' : 'bg-red-100'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <activity.icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-900">{activity.message}</p>
                  <p className="text-sm text-secondary-600">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-xl shadow-soft p-6"
      >
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors">
            <Zap className="w-5 h-5 text-primary-600" />
            <span className="font-medium text-secondary-900">New Generation</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors">
            <Code className="w-5 h-5 text-accent-600" />
            <span className="font-medium text-secondary-900">View Sandboxes</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors">
            <TestTube className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-secondary-900">Run Tests</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardPage
