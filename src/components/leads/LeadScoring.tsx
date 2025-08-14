'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Target, TrendingUp, AlertCircle, Star, Filter,
  ChevronRight, Loader2, Download, Zap, Trophy,
  Users, MapPin, Globe, DollarSign
} from 'lucide-react'
import apiService from '@/services/api'
import toast from 'react-hot-toast'

interface ScoredLead {
  business_id: string
  business_name: string
  score: number
  reasons: string[]
  priority: 'high' | 'medium' | 'low'
  recommended_service: string
  estimated_value: number
  contact_info: {
    phone?: string
    website?: string
    address?: string
  }
}

export default function LeadScoring() {
  const [scoredLeads, setScoredLeads] = useState<ScoredLead[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [totalValue, setTotalValue] = useState(0)
  const [statistics, setStatistics] = useState({
    total_scored: 0,
    high_priority: 0,
    medium_priority: 0,
    low_priority: 0
  })

  // Scoring criteria
  const [criteria, setCriteria] = useState({
    weight_no_website: 30,
    weight_low_rating: 20,
    weight_few_reviews: 15,
    target_categories: [] as string[],
    target_locations: [] as string[]
  })

  const scoreLeads = async () => {
    try {
      setLoading(true)
      const response = await apiService.scoreLeads(criteria, 100)
      setScoredLeads(response.leads)
      setStatistics({
        total_scored: response.total_scored,
        high_priority: response.high_priority,
        medium_priority: response.medium_priority,
        low_priority: response.low_priority
      })
      setTotalValue(response.total_estimated_value)
      toast.success(`Scored ${response.total_scored} leads successfully!`)
    } catch (error) {
      toast.error('Failed to score leads')
      console.error('Error scoring leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-green-600'
  }

  const exportLeads = async () => {
    try {
      await apiService.exportLeads('csv', { min_opportunity_score: 40 })
      toast.success('Leads exported successfully!')
    } catch (error) {
      toast.error('Failed to export leads')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead Scoring & Prioritization</h2>
          <p className="text-gray-600">AI-powered lead scoring to identify your best opportunities</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportLeads}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scoreLeads}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Zap className="h-5 w-5" />
            )}
            Score Leads
          </motion.button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Scored</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.total_scored}</p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600">{statistics.high_priority}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Medium Priority</p>
              <p className="text-2xl font-bold text-yellow-600">{statistics.medium_priority}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Priority</p>
              <p className="text-2xl font-bold text-green-600">{statistics.low_priority}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Total Value</p>
              <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-white" />
          </div>
        </motion.div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="font-semibold text-gray-900 mb-4">Scoring Criteria</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                No Website Weight ({criteria.weight_no_website}%)
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={criteria.weight_no_website}
                onChange={(e) => setCriteria({...criteria, weight_no_website: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Low Rating Weight ({criteria.weight_low_rating}%)
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={criteria.weight_low_rating}
                onChange={(e) => setCriteria({...criteria, weight_low_rating: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Few Reviews Weight ({criteria.weight_few_reviews}%)
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={criteria.weight_few_reviews}
                onChange={(e) => setCriteria({...criteria, weight_few_reviews: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Scored Leads List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Scored Leads</h3>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
            <p className="mt-2 text-gray-600">Scoring leads...</p>
          </div>
        ) : scoredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No leads scored yet</p>
            <p className="text-sm text-gray-500 mt-2">Click "Score Leads" to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {scoredLeads.map((lead) => (
              <motion.div
                key={lead.business_id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                className="p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{lead.business_name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(lead.priority)}`}>
                        {lead.priority.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className={`font-bold ${getScoreColor(lead.score)}`}>{lead.score}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      {lead.contact_info.phone && (
                        <span className="flex items-center gap-1">
                          📞 {lead.contact_info.phone}
                        </span>
                      )}
                      {lead.contact_info.website && (
                        <span className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          Website
                        </span>
                      )}
                      {lead.contact_info.address && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {lead.contact_info.address}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Recommended Service:</span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                          {lead.recommended_service}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {lead.reasons.map((reason, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-6">
                    <p className="text-sm text-gray-600">Est. Value</p>
                    <p className="text-xl font-bold text-green-600">${lead.estimated_value.toLocaleString()}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                      Contact Lead
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
