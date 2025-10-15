'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Mail, Target, Users, Calendar, Clock, Zap,
  CheckCircle, AlertCircle, ChevronRight, Star, MapPin,
  Filter, Settings, FileText, Send
} from 'lucide-react'
import apiService from '@/services/api'
import toast from 'react-hot-toast'

interface CampaignTemplate {
  id: string
  name: string
  description: string
  service_type: string
  target_criteria: any
  email_sequence: Array<{ day: number; subject: string }>
}

interface CreateCampaignModalProps {
  isOpen: boolean
  onClose: () => void
  onCampaignCreated: () => void
}

export default function CreateCampaignModal({ isOpen, onClose, onCampaignCreated }: CreateCampaignModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [templates, setTemplates] = useState<CampaignTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null)
  const [campaignData, setCampaignData] = useState({
    name: '',
    description: '',
    campaign_type: 'email',
    service_type: 'website_design',
    target_audience: {
      locations: [],
      categories: [],
      min_rating: 0,
      max_rating: 5,
      has_website: undefined
    },
    daily_limit: 50,
    total_limit: undefined,
    custom_email_template: ''
  })

  const totalSteps = 4

  useEffect(() => {
    if (isOpen) {
      loadTemplates()
      resetForm()
    }
  }, [isOpen])

  const loadTemplates = async () => {
    try {
      const data = await apiService.getCampaignTemplates()
      setTemplates(data.templates || [])
    } catch (error) {
      console.error('Error loading templates:', error)
    }
  }

  const resetForm = () => {
    setCurrentStep(1)
    setSelectedTemplate(null)
    setCampaignData({
      name: '',
      description: '',
      campaign_type: 'email',
      service_type: 'website_design',
      target_audience: {
        locations: [],
        categories: [],
        min_rating: 0,
        max_rating: 5,
        has_website: undefined
      },
      daily_limit: 50,
      total_limit: undefined,
      custom_email_template: ''
    })
  }

  const handleTemplateSelect = (template: CampaignTemplate) => {
    setSelectedTemplate(template)
    setCampaignData(prev => ({
      ...prev,
      name: template.name,
      description: template.description,
      service_type: template.service_type,
      target_audience: template.target_criteria
    }))
  }

  const handleCreateCampaign = async () => {
    if (!campaignData.name.trim()) {
      toast.error('Please enter a campaign name')
      return
    }

    setLoading(true)
    try {
      const response = await apiService.createCampaign({
        ...campaignData,
        follow_up_sequence: selectedTemplate?.email_sequence || []
      })

      toast.success('Campaign created successfully!')
      onCampaignCreated()
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create campaign')
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose a Template</h3>
              <p className="text-gray-600 mb-6">Start with a proven campaign template or create from scratch</p>

              <div className="space-y-4">
                <div
                  className={`border rounded-xl p-6 cursor-pointer transition-all ${
                    selectedTemplate === null
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(null)}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <FileText className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Create from Scratch</h4>
                      <p className="text-sm text-gray-600 mt-1">Build a custom campaign tailored to your needs</p>
                    </div>
                    {selectedTemplate === null && (
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                </div>

                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`border rounded-xl p-6 cursor-pointer transition-all ${
                      selectedTemplate?.id === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Target className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{template.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {template.email_sequence.length} emails
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {template.service_type.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      {selectedTemplate?.id === template.id && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Details</h3>
              <p className="text-gray-600 mb-6">Set up your basic campaign information</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    value={campaignData.name}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Q4 Website Design Campaign"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={campaignData.description}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe your campaign goals and target audience..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type
                  </label>
                  <select
                    value={campaignData.service_type}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, service_type: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="website_design">Website Design</option>
                    <option value="seo">SEO Services</option>
                    <option value="ai_chatbot">AI Chatbot</option>
                    <option value="reputation_management">Reputation Management</option>
                    <option value="social_media">Social Media Marketing</option>
                    <option value="ppc">PPC Advertising</option>
                    <option value="content_marketing">Content Marketing</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Target Audience</h3>
              <p className="text-gray-600 mb-6">Define who you want to reach with this campaign</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Target Locations
                  </label>
                  <input
                    type="text"
                    placeholder="Enter cities, states, or regions (comma separated)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => setCampaignData(prev => ({
                      ...prev,
                      target_audience: {
                        ...prev.target_audience,
                        locations: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                      }
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline h-4 w-4 mr-1" />
                    Business Categories
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., restaurants, dental, law firms"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => setCampaignData(prev => ({
                      ...prev,
                      target_audience: {
                        ...prev.target_audience,
                        categories: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                      }
                    }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Rating
                    </label>
                    <select
                      value={campaignData.target_audience.min_rating}
                      onChange={(e) => setCampaignData(prev => ({
                        ...prev,
                        target_audience: {
                          ...prev.target_audience,
                          min_rating: parseFloat(e.target.value)
                        }
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="0">Any Rating</option>
                      <option value="1">1+ Stars</option>
                      <option value="2">2+ Stars</option>
                      <option value="3">3+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Maximum Rating
                    </label>
                    <select
                      value={campaignData.target_audience.max_rating}
                      onChange={(e) => setCampaignData(prev => ({
                        ...prev,
                        target_audience: {
                          ...prev.target_audience,
                          max_rating: parseFloat(e.target.value)
                        }
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="5">Any Rating</option>
                      <option value="3">Up to 3 Stars</option>
                      <option value="3.5">Up to 3.5 Stars</option>
                      <option value="4">Up to 4 Stars</option>
                      <option value="4.5">Up to 4.5 Stars</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website Status
                  </label>
                  <select
                    value={campaignData.target_audience.has_website === undefined ? 'any' : campaignData.target_audience.has_website.toString()}
                    onChange={(e) => setCampaignData(prev => ({
                      ...prev,
                      target_audience: {
                        ...prev.target_audience,
                        has_website: e.target.value === 'any' ? undefined : e.target.value === 'true'
                      }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="any">Any Website Status</option>
                    <option value="false">No Website</option>
                    <option value="true">Has Website</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Settings</h3>
              <p className="text-gray-600 mb-6">Configure your campaign delivery settings</p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Daily Limit
                    </label>
                    <input
                      type="number"
                      value={campaignData.daily_limit}
                      onChange={(e) => setCampaignData(prev => ({ ...prev, daily_limit: parseInt(e.target.value) || 50 }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Maximum emails per day</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Target className="inline h-4 w-4 mr-1" />
                      Total Limit
                    </label>
                    <input
                      type="number"
                      value={campaignData.total_limit || ''}
                      onChange={(e) => setCampaignData(prev => ({
                        ...prev,
                        total_limit: e.target.value ? parseInt(e.target.value) : undefined
                      }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      placeholder="No limit"
                    />
                    <p className="text-xs text-gray-500 mt-1">Optional total cap</p>
                  </div>
                </div>

                {selectedTemplate && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Email Sequence Preview</h4>
                    <div className="space-y-2">
                      {selectedTemplate.email_sequence.map((email, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm">
                          <div className="p-1 bg-blue-100 rounded">
                            <Mail className="h-3 w-3 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-blue-900">Day {email.day}</p>
                            <p className="text-blue-700">{email.subject}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Campaign Summary</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Name:</strong> {campaignData.name || 'Untitled Campaign'}</p>
                    <p><strong>Service:</strong> {campaignData.service_type.replace('_', ' ')}</p>
                    <p><strong>Daily Limit:</strong> {campaignData.daily_limit} emails</p>
                    {campaignData.total_limit && (
                      <p><strong>Total Limit:</strong> {campaignData.total_limit} emails</p>
                    )}
                    <p><strong>Template:</strong> {selectedTemplate ? selectedTemplate.name : 'Custom Campaign'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Create New Campaign</h2>
                  <p className="text-gray-600 mt-1">Build an outreach campaign in 4 simple steps</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Step {currentStep} of {totalSteps}</span>
                  <span className="text-sm text-gray-500">
                    {currentStep === 1 && 'Template Selection'}
                    {currentStep === 2 && 'Campaign Details'}
                    {currentStep === 3 && 'Target Audience'}
                    {currentStep === 4 && 'Settings & Review'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {renderStepContent()}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    currentStep === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Previous
                </button>

                <div className="flex items-center gap-3">
                  {currentStep < totalSteps ? (
                    <button
                      onClick={nextStep}
                      disabled={currentStep === 1 && !selectedTemplate && templates.length > 0}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleCreateCampaign}
                      disabled={loading || !campaignData.name.trim()}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4" />
                          Create Campaign
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}