import { useState } from 'react'
import { format } from 'date-fns'
import { Clock, TrendingUp, Calendar, Activity, Plus } from 'lucide-react'
import { useLogs } from '../contexts/LogContext'
import AddLogModal from '../components/AddLogModal'

const Dashboard = () => {
  const { dashboard, todayLogs, loading } = useLogs()
  const [showAddModal, setShowAddModal] = useState(false)

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const statsCards = [
    {
      title: "Today's Total",
      value: formatTime(dashboard.today?.totalMinutes || 0),
      change: `${dashboard.today?.totalEntries || 0} entries`,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Yesterday",
      value: formatTime(dashboard.yesterday?.totalMinutes || 0),
      change: "Previous day",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Weekly Average",
      value: formatTime(Math.round((dashboard.today?.totalMinutes || 0) / 7)),
      change: "per day",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ]

  if (loading || !dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's your productivity overview for {format(new Date(), 'EEEE, MMMM do')}
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Activity
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {card.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {card.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Today's Activities */}
      <div className="card">
                    <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Today's Activities
              </h2>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {todayLogs?.length || 0} entries
                </span>
              </div>
            </div>
        
                    {!todayLogs || todayLogs.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No activities logged today
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start tracking your time by adding your first activity
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              Add First Activity
            </button>
          </div>
                    ) : (
              <div className="space-y-4">
                        {todayLogs?.map((log) => (
          <div
            key={log._id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {log.activity}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {log.category} • {format(new Date(log.createdAt), 'HH:mm')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatTime(log.minutes)}
              </p>
              {log.notes && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {log.notes}
                </p>
              )}
            </div>
          </div>
        ))}
          </div>
        )}
      </div>

      {/* Add Log Modal */}
      {showAddModal && (
        <AddLogModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          selectedDate={new Date().toISOString().split('T')[0]}
        />
      )}
    </div>
  )
}

export default Dashboard 