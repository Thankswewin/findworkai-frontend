'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, Send, Users, TrendingUp, Pause, Play, Plus, 
  BarChart3, Clock, Target, ChevronRight, Loader2,
  Download, Settings, Zap, Calendar
} from 'lucide-react'
import apiService from '@/services/api'
import toast from 'react-hot-toast'

interface Campaign {
  campaign_id: string
  name: string
  campaign_type: string
  service_type: string
  status: string
  total_recipients: number
  emails_sent: number
  created_at: string
  started_at?: string
}

export default function CampaignManager() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [campaignStats, setCampaignStats] = useState<any>(null)

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      const data = await apiService.getCampaigns()
      setCampaigns(data.campaigns)
    } catch (error) {
      console.error('Error loading campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCampaignStats = async (campaignId: string) => {
    try {
      const stats = await apiService.getCampaignStats(campaignId)
      setCampaignStats(stats)
    } catch (error) {
      console.error('Error loading campaign stats:', error)
    }
  }

  const handleStartCampaign = async (campaignId: string) => {
    try {
      await apiService.startCampaign(campaignId)
      toast.success('Campaign started successfully!')
      loadCampaigns()
    } catch (error) {
      toast.error('Failed to start campaign')
    }
  }

  const handlePauseCampaign = async (campaignId: string) => {
    try {
      await apiService.pauseCampaign(campaignId)
      toast.success('Campaign paused')
      loadCampaigns()
    } catch (error) {
      toast.error('Failed to pause campaign')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="h-4 w-4" />
      case 'paused': return <Pause className="h-4 w-4" />
      case 'completed': return <BarChart3 className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Campaign Management</h2>
          <p className="text-gray-600">Create and manage your outreach campaigns</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create Campaign
        </motion.button>
      </div>

      {/* Campaign Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Campaigns</p>
              <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-bold text-green-600">
                {campaigns.filter(c => c.status === 'running').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Play className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Emails Sent</p>
              <p className="text-2xl font-bold text-purple-600">
                {campaigns.reduce((sum, c) => sum + (c.emails_sent || 0), 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Send className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Recipients</p>
              <p className="text-2xl font-bold text-orange-600">
                {campaigns.reduce((sum, c) => sum + (c.total_recipients || 0), 0)}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Your Campaigns</h3>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
            <p className="mt-2 text-gray-600">Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No campaigns yet</p>
            <p className="text-sm text-gray-500 mt-2">Create your first campaign to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {campaigns.map((campaign) => (
              <motion.div
                key={campaign.campaign_id}
                whileHover={{ backgroundColor: '#f9fafb' }}
                className="p-6 cursor-pointer"
                onClick={() => {
                  setSelectedCampaign(campaign)
                  loadCampaignStats(campaign.campaign_id)
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{campaign.name}</h4>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(campaign.status)}`}>
                        {getStatusIcon(campaign.status)}
                        {campaign.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {campaign.service_type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {campaign.total_recipients || 0} recipients
                      </span>
                      <span className="flex items-center gap-1">
                        <Send className="h-4 w-4" />
                        {campaign.emails_sent || 0} sent
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(campaign.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {campaign.status === 'draft' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStartCampaign(campaign.campaign_id)
                        }}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                      >
                        <Play className="h-5 w-5" />
                      </motion.button>
                    )}
                    {campaign.status === 'running' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePauseCampaign(campaign.campaign_id)
                        }}
                        className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200"
                      >
                        <Pause className="h-5 w-5" />
                      </motion.button>
                    )}
                    {campaign.status === 'paused' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStartCampaign(campaign.campaign_id)
                        }}
                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                      >
                        <Play className="h-5 w-5" />
                      </motion.button>
                    )}
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Campaign Details Modal */}
      {selectedCampaign && campaignStats && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setSelectedCampaign(null)
            setCampaignStats(null)
          }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{selectedCampaign.name}</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Open Rate</p>
                <p className="text-2xl font-bold text-blue-600">{campaignStats.open_rate}%</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Reply Rate</p>
                <p className="text-2xl font-bold text-green-600">{campaignStats.reply_rate}%</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Click Rate</p>
                <p className="text-2xl font-bold text-purple-600">{campaignStats.click_rate}%</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Bounce Rate</p>
                <p className="text-2xl font-bold text-red-600">{campaignStats.bounce_rate}%</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Total Recipients</span>
                <span className="font-semibold">{campaignStats.total_recipients}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Emails Sent</span>
                <span className="font-semibold">{campaignStats.total_sent}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Emails Opened</span>
                <span className="font-semibold">{campaignStats.total_opened}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Replies Received</span>
                <span className="font-semibold">{campaignStats.total_replied}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setSelectedCampaign(null)
                  setCampaignStats(null)
                }}
                className="px-6 py-2 text-gray-600 hover:text-gray-900"
              >
                Close
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Export Report
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
