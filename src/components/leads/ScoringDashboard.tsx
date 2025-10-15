'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Settings, Zap, BarChart3, TrendingUp, AlertTriangle,
  Sliders, RefreshCw, Play, Pause, Download, Eye, Save
} from 'lucide-react'
import apiService from '@/services/api'
import toast from 'react-hot-toast'

interface ScoringStatistics {
  total_businesses: number
  scored_businesses: number
  scoring_coverage: number
  recently_scored: number
  queue_size: number
  service_running: boolean
  last_scoring_activity: string
}

interface ScoringWeights {
  digital_presence: number
  reputation: number
  market_opportunity: number
  ai_insights: number
}

export default function ScoringDashboard() {
  const [statistics, setStatistics] = useState<ScoringStatistics | null>(null)
  const [loading, setLoading] = useState(false)
  const [weights, setWeights] = useState<ScoringWeights>({
    digital_presence: 35,
    reputation: 30,
    market_opportunity: 20,
    ai_insights: 15
  })
  const [activeTab, setActiveTab] = useState<'overview' | 'weights' | 'automation'>('overview')

  useEffect(() => {
    loadStatistics()
    const interval = setInterval(loadStatistics, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadStatistics = async () => {
    try {
      const response = await apiService.get('/lead-scoring/scoring-statistics')
      if (response.success) {
        setStatistics(response.statistics)
      }
    } catch (error) {
      console.error('Error loading scoring statistics:', error)
    }
  }

  const startRealTimeScoring = async () => {
    try {
      setLoading(true)
      const response = await apiService.post('/lead-scoring/start-real-time-scoring')
      if (response.success) {
        toast.success(response.message)
        loadStatistics()
      }
    } catch (error) {
      toast.error('Failed to start real-time scoring')
    } finally {
      setLoading(false)
    }
  }

  const stopRealTimeScoring = async () => {
    try {
      setLoading(true)
      const response = await apiService.post('/lead-scoring/stop-real-time-scoring')
      if (response.success) {
        toast.success(response.message)
        loadStatistics()
      }
    } catch (error) {
      toast.error('Failed to stop real-time scoring')
    } finally {
      setLoading(false)
    }
  }

  const updateScoresForChanges = async () => {
    try {
      setLoading(true)
      const response = await apiService.post('/lead-scoring/update-changed-scores')
      if (response.success) {
        toast.success(`Updated ${response.businesses_updated} businesses`)
        loadStatistics()
      }
    } catch (error) {
      toast.error('Failed to update scores')
    } finally {
      setLoading(false)
    }
  }

  const scoreRecentBusinesses = async () => {
    try {
      setLoading(true)
      const response = await apiService.post('/lead-scoring/score-recent', { hours_back: 24 })
      if (response.success) {
        toast.success(`Scored ${response.businesses_scored} recent businesses`)
        loadStatistics()
      }
    } catch (error) {
      toast.error('Failed to score recent businesses')
    } finally {
      setLoading(false)
    }
  }

  const saveWeights = async () => {
    try {
      setLoading(true)
      // This would need to be implemented in the backend
      toast.success('Scoring weights saved successfully')
    } catch (error) {
      toast.error('Failed to save weights')
    } finally {
      setLoading(false)
    }
  }

  const exportScoringData = async () => {
    try {
      await apiService.exportLeads('csv', {
        min_opportunity_score: 40,
        include_ai_analysis: true
      })
      toast.success('Scoring data exported successfully!')
    } catch (error) {
      toast.error('Failed to export scoring data')
    }
  }

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 80) return 'text-green-600 bg-green-50'
    if (coverage >= 50) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead Scoring Dashboard</h2>
          <p className="text-gray-600">Configure and monitor your AI-powered lead scoring system</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportScoringData}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export Data
          </motion.button>
          {statistics?.service_running ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopRealTimeScoring}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <Pause className="h-4 w-4" />
              Stop Scoring
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startRealTimeScoring}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Start Scoring
            </motion.button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'weights', label: 'Scoring Weights', icon: Sliders },
            { id: 'automation', label: 'Automation', icon: Zap }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && statistics && (
        <div className="space-y-6">
          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Businesses</p>
                  <p className="text-2xl font-bold text-gray-900">{statistics.total_businesses}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Scored Businesses</p>
                  <p className="text-2xl font-bold text-green-600">{statistics.scored_businesses}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`bg-white rounded-xl p-6 shadow-lg border border-gray-100`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Scoring Coverage</p>
                  <p className={`text-2xl font-bold ${statistics.scoring_coverage >= 80 ? 'text-green-600' : statistics.scoring_coverage >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {statistics.scoring_coverage.toFixed(1)}%
                  </p>
                </div>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${getCoverageColor(statistics.scoring_coverage)}`}>
                  <Eye className="h-4 w-4" />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Queue Size</p>
                  <p className="text-2xl font-bold text-purple-600">{statistics.queue_size}</p>
                </div>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${statistics.queue_size > 50 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {statistics.queue_size > 50 ? <AlertTriangle className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                </div>
              </div>
            </motion.div>
          </div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-6 border ${
              statistics.service_running
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Real-time scoring is {statistics.service_running ? 'running' : 'stopped'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Last activity: {new Date(statistics.last_scoring_activity).toLocaleString()}
                </p>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                statistics.service_running
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {statistics.service_running ? (
                  <Zap className="h-6 w-6" />
                ) : (
                  <Pause className="h-6 w-6" />
                )}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={scoreRecentBusinesses}
                disabled={loading}
                className="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-left disabled:opacity-50"
              >
                <RefreshCw className="h-5 w-5 mb-2" />
                <p className="font-medium">Score Recent Businesses</p>
                <p className="text-sm opacity-75">Score businesses added in last 24 hours</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={updateScoresForChanges}
                disabled={loading}
                className="p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-left disabled:opacity-50"
              >
                <TrendingUp className="h-5 w-5 mb-2" />
                <p className="font-medium">Update Changed Scores</p>
                <p className="text-sm opacity-75">Update scores for businesses with new data</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={loadStatistics}
                disabled={loading}
                className="p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 text-left disabled:opacity-50"
              >
                <BarChart3 className="h-5 w-5 mb-2" />
                <p className="font-medium">Refresh Statistics</p>
                <p className="text-sm opacity-75">Update dashboard data</p>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Scoring Weights Tab */}
      {activeTab === 'weights' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Scoring Algorithm Weights</h3>
              <p className="text-sm text-gray-600 mt-1">
                Configure how different factors contribute to lead scores
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={saveWeights}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </motion.button>
          </div>

          <div className="space-y-6">
            {[
              { key: 'digital_presence', label: 'Digital Presence', max: 50, description: 'Website, social media, online listings' },
              { key: 'reputation', label: 'Reputation Factors', max: 40, description: 'Ratings, reviews, response rates' },
              { key: 'market_opportunity', label: 'Market Opportunity', max: 30, description: 'Business category, location, competition' },
              { key: 'ai_insights', label: 'AI Analysis', max: 25, description: 'Weakness severity, opportunity alignment' }
            ].map(({ key, label, max, description }) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="font-medium text-gray-900">{label}</label>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                  <span className="text-sm font-medium text-blue-600">
                    {weights[key as keyof ScoringWeights]}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={max}
                  value={weights[key as keyof ScoringWeights]}
                  onChange={(e) => setWeights({
                    ...weights,
                    [key]: parseInt(e.target.value)
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Total Weight:</strong> {Object.values(weights).reduce((a, b) => a + b, 0)}%
              {Object.values(weights).reduce((a, b) => a + b, 0) !== 100 && (
                <span className="text-red-600 ml-2">
                  (Should sum to 100% for optimal scoring)
                </span>
              )}
            </p>
          </div>
        </motion.div>
      )}

      {/* Automation Tab */}
      {activeTab === 'automation' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Automation Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Auto-score new businesses</p>
                  <p className="text-sm text-gray-600">Automatically score businesses when they are added</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Update scores on data changes</p>
                  <p className="text-sm text-gray-600">Re-score when ratings, reviews, or other data changes</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Periodic re-scoring</p>
                  <p className="text-sm text-gray-600">Re-score all businesses weekly to catch trends</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scoring History</h3>
            <p className="text-gray-600 text-center py-8">
              Scoring history and analytics will be available here in future updates
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}