import { useState } from 'react'
import { format } from 'date-fns'
import { Plus, Search, Calendar, Edit, Trash2 } from 'lucide-react'
import { useLogs } from '../contexts/LogContext'
import AddLogModal from '../components/AddLogModal'

const Logs = () => {
  const { todayLogs, selectedDate, setSelectedDate, deleteLog, loading } = useLogs()
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const filteredLogs = todayLogs.filter(log =>
    log.activity.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this log?')) {
      try {
        await deleteLog(id)
      } catch (error) {
        console.error('Failed to delete log:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Activity Logs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage your daily activities
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Log
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Activities
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Logs for {format(new Date(selectedDate), 'MMMM do, yyyy')}
          </h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {filteredLogs.length} entries
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No logs found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start tracking your time by adding your first log
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div
                key={log._id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {log.activity}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {log.category} • {format(new Date(log.createdAt), 'HH:mm')}
                    </p>
                    {log.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {log.notes}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatTime(log.minutes)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(log._id)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
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
          selectedDate={selectedDate}
        />
      )}
    </div>
  )
}

export default Logs 