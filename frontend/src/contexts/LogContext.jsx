import { createContext, useContext, useReducer, useEffect } from 'react'
import axios from 'axios'

const LogContext = createContext()

const initialState = {
  logs: [],
  todayLogs: [],
  selectedDate: new Date().toISOString().split('T')[0],
  loading: false,
  error: null,
  stats: {
    totalMinutes: 0,
    totalEntries: 0,
    activitySummary: []
  },
  dashboard: {
    today: { logs: [], totalMinutes: 0, totalEntries: 0 },
    weekStats: [],
    recentActivities: [],
    topCategories: []
  }
}

const logReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    
    case 'SET_LOGS':
      return { ...state, logs: action.payload, loading: false }
    
    case 'SET_TODAY_LOGS':
      return { ...state, todayLogs: action.payload }
    
    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload }
    
    case 'ADD_LOG':
      const newLog = action.payload
      const logDate = newLog.formattedDate || new Date(newLog.date).toISOString().split('T')[0]
      const isTodayLog = logDate === state.selectedDate
      
      return {
        ...state,
        logs: [newLog, ...state.logs],
        todayLogs: isTodayLog ? [newLog, ...state.todayLogs] : state.todayLogs
      }
    
    case 'UPDATE_LOG':
      return {
        ...state,
        logs: state.logs.map(log => 
          log._id === action.payload._id ? action.payload : log
        ),
        todayLogs: state.todayLogs.map(log => 
          log._id === action.payload._id ? action.payload : log
        )
      }
    
    case 'DELETE_LOG':
      return {
        ...state,
        logs: state.logs.filter(log => log._id !== action.payload),
        todayLogs: state.todayLogs.filter(log => log._id !== action.payload)
      }
    
    case 'SET_STATS':
      return { ...state, stats: action.payload }
    
    case 'SET_DASHBOARD':
      return { ...state, dashboard: action.payload }
    
    default:
      return state
  }
}

export const LogProvider = ({ children }) => {
  const [state, dispatch] = useReducer(logReducer, initialState)

  // API base URL
  const API_BASE = '/api'

  // Fetch all logs
  const fetchLogs = async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE}/logs`, { params })
      dispatch({ type: 'SET_LOGS', payload: response.data.logs })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to fetch logs' })
    }
  }

  // Fetch logs for specific date
  const fetchLogsByDate = async (date) => {
    try {
      const response = await axios.get(`${API_BASE}/logs/date/${date}`)
      dispatch({ type: 'SET_TODAY_LOGS', payload: response.data.logs })
      dispatch({ type: 'SET_STATS', payload: {
        totalMinutes: response.data.dailyTotal,
        totalEntries: response.data.totalEntries,
        activitySummary: response.data.activitySummary
      }})
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to fetch logs for date' })
    }
  }

  // Add new log
  const addLog = async (logData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await axios.post(`${API_BASE}/logs`, logData)
      
      // Immediately add the new log to state
      dispatch({ type: 'ADD_LOG', payload: response.data.log })
      
      // Force refresh all data to ensure UI is updated
      await Promise.all([
        fetchLogs(),
        fetchLogsByDate(state.selectedDate || new Date().toISOString().split('T')[0]),
        fetchDashboard(),
        fetchStats()
      ])
      
      dispatch({ type: 'SET_LOADING', payload: false })
      return response.data.log
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to add log' })
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error
    }
  }

  // Update log
  const updateLog = async (id, logData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await axios.put(`${API_BASE}/logs/${id}`, logData)
      dispatch({ type: 'UPDATE_LOG', payload: response.data.log })
      
      // Refresh data to ensure UI is updated
      await fetchLogs()
      if (state.selectedDate) {
        await fetchLogsByDate(state.selectedDate)
      }
      await fetchDashboard()
      await fetchStats()
      
      return response.data.log
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to update log' })
      throw error
    }
  }

  // Delete log
  const deleteLog = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      await axios.delete(`${API_BASE}/logs/${id}`)
      dispatch({ type: 'DELETE_LOG', payload: id })
      
      // Refresh data to ensure UI is updated
      await fetchLogs()
      if (state.selectedDate) {
        await fetchLogsByDate(state.selectedDate)
      }
      await fetchDashboard()
      await fetchStats()
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.response?.data?.error || 'Failed to delete log' })
      throw error
    }
  }

  // Fetch dashboard data
  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${API_BASE}/dashboard`)
      dispatch({ type: 'SET_DASHBOARD', payload: response.data })
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    }
  }

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE}/stats/overview`)
      dispatch({ type: 'SET_STATS', payload: response.data })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  // Set selected date
  const setSelectedDate = (date) => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: date })
    fetchLogsByDate(date)
  }

  // Clear error
  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null })
  }

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true })
      await Promise.all([
        fetchLogs(),
        fetchDashboard(),
        fetchStats()
      ])
      dispatch({ type: 'SET_LOADING', payload: false })
    }
    loadInitialData()
  }, [])

  // Fetch logs when selected date changes
  useEffect(() => {
    if (state.selectedDate) {
      fetchLogsByDate(state.selectedDate)
    }
  }, [state.selectedDate])

  const value = {
    ...state,
    fetchLogs,
    fetchLogsByDate,
    addLog,
    updateLog,
    deleteLog,
    fetchDashboard,
    fetchStats,
    setSelectedDate,
    clearError
  }

  return (
    <LogContext.Provider value={value}>
      {children}
    </LogContext.Provider>
  )
}

export const useLogs = () => {
  const context = useContext(LogContext)
  if (!context) {
    throw new Error('useLogs must be used within a LogProvider')
  }
  return context
} 