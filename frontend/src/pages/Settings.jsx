import { useState } from 'react'
import { Settings as SettingsIcon, Moon, Sun, Palette, Bell, Shield, Database } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const Settings = () => {
  const { isDark, toggleTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(true)

  const settingsSections = [
    {
      title: "Appearance",
      icon: Palette,
      settings: [
        {
          label: "Dark Mode",
          description: "Switch between light and dark themes",
          type: "toggle",
          value: isDark,
          onChange: toggleTheme
        }
      ]
    },
    {
      title: "Notifications",
      icon: Bell,
      settings: [
        {
          label: "Enable Notifications",
          description: "Receive reminders and updates",
          type: "toggle",
          value: notifications,
          onChange: setNotifications
        }
      ]
    },
    {
      title: "Data & Privacy",
      icon: Shield,
      settings: [
        {
          label: "Auto Save",
          description: "Automatically save your logs",
          type: "toggle",
          value: autoSave,
          onChange: setAutoSave
        }
      ]
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Customize your TimeLogger experience
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => {
          const Icon = section.icon
          return (
            <div key={sectionIndex} className="card">
              <div className="flex items-center gap-3 mb-6">
                <Icon className="h-5 w-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
              
              <div className="space-y-4">
                {section.settings.map((setting, settingIndex) => (
                  <div key={settingIndex} className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {setting.label}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {setting.description}
                      </p>
                    </div>
                    
                    {setting.type === "toggle" && (
                      <button
                        onClick={setting.onChange}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          setting.value 
                            ? 'bg-primary-600' 
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            setting.value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* About Section */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Database className="h-5 w-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            About TimeLogger
          </h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Version
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              1.0.0
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Description
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              TimeLogger is a comprehensive time tracking application designed to help you monitor and improve your productivity. 
              Track your daily activities, analyze patterns, and boost your efficiency.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Features
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Daily activity logging</li>
              <li>• Productivity analytics</li>
              <li>• Custom categories and tags</li>
              <li>• Dark/Light theme support</li>
              <li>• Responsive design</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings 