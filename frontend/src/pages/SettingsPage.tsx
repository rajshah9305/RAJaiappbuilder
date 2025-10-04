import React from 'react'

const SettingsPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-secondary-900 mb-6">Settings</h1>
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">⚙️</span>
        </div>
        <h3 className="text-xl font-semibold text-secondary-900 mb-2">
          Settings Coming Soon
        </h3>
        <p className="text-secondary-600">
          User preferences and configuration options will be available here.
        </p>
      </div>
    </div>
  )
}

export default SettingsPage
