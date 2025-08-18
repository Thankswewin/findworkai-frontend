'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, Clock, CheckCircle, AlertCircle, Send,
  Phone, Mail, MessageSquare, User, ArrowRight,
  Loader2, Plus, Filter, ChevronRight, Bell, Trophy,
  WifiOff, RefreshCw, XCircle
} from 'lucide-react'
import apiService from '@/services/api'
import toast from 'react-hot-toast'

interface FollowUp {
  id: string
  lead_id: string
  lead_name: string
  type: 'email' | 'call' | 'meeting' | 'task'
  status: 'pending' | 'completed' | 'overdue' | 'cancelled'
  priority: 'high' | 'medium' | 'low'
  scheduled_date: string
  notes: string
  outcome?: string
  next_action?: string
  contact_info: {
    email?: string
    phone?: string
  }
}

interface FollowUpStats {
  total: number
  pending: number
  completed: number
  overdue: number
  completion_rate: number
}

export default function FollowUpManager() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{ message: string; canRetry: boolean } | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [stats, setStats] = useState<FollowUpStats>({
    total: 0,
    pending: 0,
    completed: 0,
    overdue: 0,
    completion_rate: 0
  })
  
  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development'

  const [newFollowUp, setNewFollowUp] = useState({
    lead_id: '',
    type: 'email' as const,
    scheduled_date: new Date().toISOString().split('T')[0],
    priority: 'medium' as const,
    notes: ''
  })

  useEffect(() => {
    fetchFollowUps()
  }, [filterStatus])

  const fetchFollowUps = async (isRetry = false) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiService.getPendingFollowUps(30)
      const followups = response.followups || []
      
      setFollowUps(followups)
      setStats({
        total: followups.length,
        pending: followups.filter((f: any) => f.status === 'pending').length,
        completed: followups.filter((f: any) => f.status === 'completed').length,
        overdue: followups.filter((f: any) => f.status === 'overdue').length,
        completion_rate: followups.length > 0 
          ? Math.round((followups.filter((f: any) => f.status === 'completed').length / followups.length) * 100)
          : 0
      })
      
      // Reset retry count on successful fetch
      if (isRetry) {
        setRetryCount(0)
        toast.success('Follow-ups loaded successfully')
      }
    } catch (error: any) {
      console.error('Error fetching follow-ups:', error)
      
      const isNetworkError = error.code === 'ERR_NETWORK' || 
                            error.message?.includes('Network Error') ||
                            error.response?.status >= 500
      
      // In development mode ONLY, show mock data if backend is down
      if (isDevelopment && isNetworkError) {
        console.warn('Development mode: Using mock data due to backend error')
        
        const mockFollowUps: FollowUp[] = [
          {
            id: 'dev-1',
            lead_id: 'dev_lead_1',
            lead_name: 'Demo Company (Dev)',
            type: 'email',
            status: 'pending',
            priority: 'high',
            scheduled_date: new Date(Date.now() + 86400000).toISOString(),
            notes: 'Development mode: This is sample data',
            contact_info: { email: 'demo@example.com' }
          },
          {
            id: 'dev-2',
            lead_id: 'dev_lead_2',
            lead_name: 'Test Corp (Dev)',
            type: 'call',
            status: 'overdue',
            priority: 'medium',
            scheduled_date: new Date(Date.now() - 86400000).toISOString(),
            notes: 'Development mode: Backend is not running',
            contact_info: { phone: '555-TEST' }
          }
        ]
        
        setFollowUps(mockFollowUps)
        setStats({
          total: 2,
          pending: 1,
          completed: 0,
          overdue: 1,
          completion_rate: 0
        })
        
        // Show a warning toast in development
        toast('Development Mode: Showing mock data', {
          icon: '⚠️',
          duration: 4000
        })
        
        setError({
          message: 'Backend server is not available. Showing demo data for development.',
          canRetry: true
        })
      } else {
        // Production error handling
        let errorMessage = 'Unable to load follow-ups'
        let canRetry = true
        
        if (isNetworkError) {
          errorMessage = 'Connection error. Please check your internet connection and try again.'
        } else if (error.response?.status === 401) {
          errorMessage = 'You need to sign in to view follow-ups.'
          canRetry = false
        } else if (error.response?.status === 403) {
          errorMessage = 'You don\'t have permission to view follow-ups.'
          canRetry = false
        } else if (error.response?.status === 404) {
          errorMessage = 'Follow-ups service is not available.'
        }
        
        setError({ message: errorMessage, canRetry })
        setFollowUps([])
        setStats({
          total: 0,
          pending: 0,
          completed: 0,
          overdue: 0,
          completion_rate: 0
        })
        
        // Only show toast for non-retry attempts
        if (!isRetry) {
          toast.error(errorMessage)
        }
      }
    } finally {
      setLoading(false)
    }
  }
  
  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    fetchFollowUps(true)
  }

  const createFollowUp = async () => {
    try {
      await apiService.scheduleFollowUp(
        newFollowUp.lead_id,
        newFollowUp.scheduled_date,
        newFollowUp.type,
        newFollowUp.notes
      )
      toast.success('Follow-up created successfully')
      setShowCreateModal(false)
      fetchFollowUps()
      setNewFollowUp({
        lead_id: '',
        type: 'email',
        scheduled_date: new Date().toISOString().split('T')[0],
        priority: 'medium',
        notes: ''
      })
    } catch (error: any) {
      console.error('Error creating follow-up:', error)
      
      // Only allow local state updates in development mode
      if (isDevelopment && (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error'))) {
        const newFollowUpItem: FollowUp = {
          id: `dev-${Date.now()}`,
          lead_id: newFollowUp.lead_id,
          lead_name: `Lead ${newFollowUp.lead_id} (Dev)`,
          type: newFollowUp.type,
          status: 'pending',
          priority: newFollowUp.priority,
          scheduled_date: newFollowUp.scheduled_date,
          notes: newFollowUp.notes,
          contact_info: {}
        }
        setFollowUps(prev => [...prev, newFollowUpItem])
        setStats(prev => ({
          ...prev,
          total: prev.total + 1,
          pending: prev.pending + 1
        }))
        toast('Development: Follow-up created locally', { icon: '⚠️' })
        setShowCreateModal(false)
        setNewFollowUp({
          lead_id: '',
          type: 'email',
          scheduled_date: new Date().toISOString().split('T')[0],
          priority: 'medium',
          notes: ''
        })
      } else {
        // Production error handling
        const errorMessage = error.response?.status === 401
          ? 'Please sign in to create follow-ups'
          : error.response?.status === 403
          ? 'You don\'t have permission to create follow-ups'
          : 'Failed to create follow-up. Please try again.'
        
        toast.error(errorMessage)
      }
    }
  }

  const completeFollowUp = async (id: string, outcome: string) => {
    try {
      await apiService.completeFollowUp(id, outcome, '', undefined)
      toast.success('Follow-up marked as completed')
      fetchFollowUps()
    } catch (error: any) {
      console.error('Error completing follow-up:', error)
      
      // Only allow local state updates in development mode
      if (isDevelopment && (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error'))) {
        setFollowUps(prev => prev.map(f => 
          f.id === id ? { ...f, status: 'completed' as const, outcome } : f
        ))
        setStats(prev => ({
          ...prev,
          pending: Math.max(0, prev.pending - 1),
          completed: prev.completed + 1,
          completion_rate: Math.round(((prev.completed + 1) / prev.total) * 100)
        }))
        toast('Development: Follow-up completed locally', { icon: '⚠️' })
      } else {
        // Production error handling
        const errorMessage = error.response?.status === 401
          ? 'Please sign in to complete follow-ups'
          : error.response?.status === 403
          ? 'You don\'t have permission to complete this follow-up'
          : 'Failed to complete follow-up. Please try again.'
        
        toast.error(errorMessage)
      }
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />
      case 'call': return <Phone className="h-4 w-4" />
      case 'meeting': return <Calendar className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getDaysUntil = (date: string) => {
    const scheduled = new Date(date)
    const today = new Date()
    const diffTime = scheduled.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    return `In ${diffDays} days`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Follow-Up Management</h2>
          <p className="text-gray-600">Track and manage all your lead interactions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          New Follow-Up
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Completion Rate</p>
              <p className="text-2xl font-bold">{stats.completion_rate}%</p>
            </div>
            <Trophy className="h-8 w-8 text-white" />
          </div>
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="border-b border-gray-100 p-4">
          <div className="flex gap-2">
            {['all', 'pending', 'overdue', 'completed'].map((status) => (
              <motion.button
                key={status}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Follow-Up List */}
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
              <p className="mt-2 text-gray-600">Loading follow-ups...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="max-w-md mx-auto">
                {error.canRetry ? (
                  <>
                    <WifiOff className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Connection Error</h3>
                    <p className="text-gray-600 mb-6">{error.message}</p>
                    {isDevelopment && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>Development Mode:</strong> Showing mock data. Start your backend server to see real data.
                        </p>
                      </div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRetry}
                      disabled={retryCount >= 3}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                    >
                      <RefreshCw className="h-4 w-4" />
                      {retryCount >= 3 ? 'Max retries reached' : 'Try Again'}
                    </motion.button>
                    {retryCount > 0 && (
                      <p className="text-sm text-gray-500 mt-2">Retry attempt {retryCount} of 3</p>
                    )}
                  </>
                ) : (
                  <>
                    <XCircle className="h-12 w-12 mx-auto text-red-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
                    <p className="text-gray-600">{error.message}</p>
                  </>
                )}
              </div>
            </div>
          ) : followUps.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No follow-ups found</p>
              <p className="text-sm text-gray-500 mt-2">Create your first follow-up to get started</p>
            </div>
          ) : (
            followUps.map((followUp) => (
              <motion.div
                key={followUp.id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                className="p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg bg-gray-100 ${getPriorityColor(followUp.priority)}`}>
                        {getTypeIcon(followUp.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{followUp.lead_name}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="capitalize">{followUp.type}</span>
                          <span>•</span>
                          <span>{getDaysUntil(followUp.scheduled_date)}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(followUp.status)}`}>
                        {followUp.status}
                      </span>
                    </div>

                    {followUp.notes && (
                      <p className="text-sm text-gray-600 ml-11 mb-3">{followUp.notes}</p>
                    )}

                    <div className="flex items-center gap-4 ml-11">
                      {followUp.contact_info.email && (
                        <a href={`mailto:${followUp.contact_info.email}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {followUp.contact_info.email}
                        </a>
                      )}
                      {followUp.contact_info.phone && (
                        <a href={`tel:${followUp.contact_info.phone}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {followUp.contact_info.phone}
                        </a>
                      )}
                    </div>

                    {followUp.outcome && (
                      <div className="mt-3 ml-11 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-900">Outcome:</p>
                        <p className="text-sm text-green-700">{followUp.outcome}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {followUp.status === 'pending' && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => completeFollowUp(followUp.id, 'Completed successfully')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                        >
                          Complete
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                        >
                          Reschedule
                        </motion.button>
                      </>
                    )}
                    {followUp.status === 'completed' && followUp.next_action && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-1"
                      >
                        Next Action
                        <ArrowRight className="h-3 w-3" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Create Follow-Up Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-md w-full"
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Create Follow-Up</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lead ID</label>
                <input
                  type="text"
                  value={newFollowUp.lead_id}
                  onChange={(e) => setNewFollowUp({...newFollowUp, lead_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Enter lead ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newFollowUp.type}
                  onChange={(e) => setNewFollowUp({...newFollowUp, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="email">Email</option>
                  <option value="call">Call</option>
                  <option value="meeting">Meeting</option>
                  <option value="task">Task</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date</label>
                <input
                  type="date"
                  value={newFollowUp.scheduled_date}
                  onChange={(e) => setNewFollowUp({...newFollowUp, scheduled_date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={newFollowUp.priority}
                  onChange={(e) => setNewFollowUp({...newFollowUp, priority: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={newFollowUp.notes}
                  onChange={(e) => setNewFollowUp({...newFollowUp, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Add any notes..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={createFollowUp}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

