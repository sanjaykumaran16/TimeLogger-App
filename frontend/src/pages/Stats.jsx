import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Activity, Target, Clock } from 'lucide-react'
import { useLogs } from '../contexts/LogContext'

const Stats = () => {
  const { stats, loading, fetchStats } = useLogs()
  const [timeframe, setTimeframe] = useState('week')

  // Debug logging
  console.log('Stats component - stats object:', stats)
  console.log('Stats component - uniqueActivities:', stats.uniqueActivities)
  console.log('Stats component - averageMinutesPerLog:', stats.averageMinutesPerLog)

  const handleRefresh = () => {
    fetchStats()
  }

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const statsCards = [
    {
      title: "Total Time Logged",
      value: formatTime(stats.totalMinutes),
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Entries",
      value: stats.totalEntries,
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Unique Activities",
      value: stats.uniqueActivities,
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Average per Entry",
      value: formatTime(stats.averageMinutesPerLog),
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ]

  if (loading) {
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
            Statistics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Analyze your productivity patterns and trends
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="input-field"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={handleRefresh}
            className="ml-2 px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 flex items-center"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full inline-block"></span>
            ) : null}
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Top Activities & Productivity Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Top Activities */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Activities
          </h3>
          {stats.activitySummary && stats.activitySummary.length > 0 ? (
            <div className="space-y-3">
              {stats.activitySummary.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {activity._id}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {activity.totalMinutes}m
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.count} entries
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-gray-600 dark:text-gray-400">
                No activity data available
              </span>
            </div>
          )}
        </div>

        {/* Productivity Insights */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Productivity Insights
          </h3>
          <div className="space-y-4">
            {/* Most Productive Day */}
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  Most Productive Day
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {stats.mostProductiveDay?._id || 'No data'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-blue-900 dark:text-blue-100">
                  {stats.mostProductiveDay?.totalMinutes || 0}m
                </p>
              </div>
            </div>
            {/* Longest Session */}
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">
                  Longest Session
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {stats.longestSession?.activity || 'No data'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-900 dark:text-green-100">
                  {stats.longestSession?.minutes || 0}m
                </p>
              </div>
            </div>
            {/* Weekly Average */}
            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <div>
                <p className="font-medium text-purple-900 dark:text-purple-100">
                  Weekly Average
                </p>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Per day
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-purple-900 dark:text-purple-100">
                  {stats.weekAverage || 0}m
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stats 