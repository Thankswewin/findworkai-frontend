/**
 * SmartLeads AI API Service
 * Comprehensive API client for all backend endpoints
 */

import axios, { AxiosInstance } from 'axios'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import logger from '@/lib/logger'

// API Configuration - ALWAYS use the deployed backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://findworkai-backend-1.onrender.com/api/v1'
const API_PATH = ''  // Path is already included in NEXT_PUBLIC_API_URL

// Types
export interface LoginCredentials {
  email: string
  password: string
}

export interface Business {
  id: string
  name: string
  address: string
  city: string
  state: string
  phone?: string
  website?: string
  email?: string
  rating?: number
  total_reviews?: number
  business_category?: string
  has_website?: boolean
  opportunity_score?: number
  weaknesses?: string[]
  opportunities?: string[]
  lead_status?: string
  last_contact_date?: string
}

export interface Campaign {
  id: string
  name: string
  description?: string
  campaign_type: string
  service_type: string
  status: string
  total_recipients?: number
  total_sent?: number
  open_rate?: number
  reply_rate?: number
  created_at: string
}

export interface LeadScoringCriteria {
  weight_no_website?: number
  weight_low_rating?: number
  weight_few_reviews?: number
  target_categories?: string[]
  target_locations?: string[]
  min_reviews?: number
  max_rating?: number
}

export interface DashboardMetrics {
  overview: {
    total_leads: number
    hot_leads: number
    contacted_leads: number
    converted_leads: number
    conversion_rate: number
  }
  campaigns: {
    total: number
    active: number
    completed: number
    draft: number
  }
  email_performance: {
    total_sent: number
    avg_open_rate: number
    avg_reply_rate: number
  }
  pipeline: {
    estimated_value: number
    high_value_leads: number
    medium_value_leads: number
  }
}

// API Client Class
class ApiService {
  private client: AxiosInstance
  private supabase = createClient()

  constructor() {
    // Ensure we only have one /api/v1 in the path
    const baseURL = API_BASE_URL.endsWith('/api/v1') 
      ? API_BASE_URL 
      : `${API_BASE_URL}${API_PATH}`
      
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add Supabase token and logging
    this.client.interceptors.request.use(async (config) => {
      // Get the current Supabase session
      const { data: { session } } = await this.supabase.auth.getSession()
      
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`
      }
      
      // Log the request
      logger.apiRequest(
        config.method?.toUpperCase() || 'GET',
        config.url || '',
        config.data
      )
      
      return config
    })

    // Response interceptor for error handling and logging
    this.client.interceptors.response.use(
      (response) => {
        // Log successful response
        logger.apiResponse(
          response.config.method?.toUpperCase() || 'GET',
          response.config.url || '',
          response.status,
          response.data
        )
        return response
      },
      async (error) => {
        // Log the error
        logger.apiError(
          error.config?.method?.toUpperCase() || 'GET',
          error.config?.url || '',
          error
        )
        
        if (error.response?.status === 401) {
          const message = error.response?.data?.detail || 'Authentication required'
          toast.error(message)
          // Don't auto-redirect, let the component handle it
        } else if (error.response?.status === 404) {
          const message = error.response?.data?.detail || 'Resource not found'
          toast.error(message)
        } else if (error.response?.status === 500) {
          const message = 'Server error. Please try again later.'
          toast.error(message)
        } else {
          const message = error.response?.data?.detail || 'An error occurred'
          toast.error(message)
        }
        return Promise.reject(error)
      }
    )
  }

  // Note: Authentication is now handled by Supabase directly
  // These methods are kept for backward compatibility but not used
  async login(credentials: LoginCredentials) {
    // Use Supabase auth instead
    throw new Error('Use Supabase auth.signInWithPassword instead')
  }

  async register(userData: any) {
    // Use Supabase auth instead
    throw new Error('Use Supabase auth.signUp instead')
  }

  logout() {
    // Use Supabase auth instead
    throw new Error('Use Supabase auth.signOut instead')
  }

  // Business Management
  async searchBusinesses(query: string, location: string, radius: number = 5000) {
    try {
      logger.info(`Searching businesses: ${query} in ${location}`, { query, location, radius }, 'BusinessSearch')
      
      const response = await this.client.post('/businesses/search', {
        query,
        location,
        radius
      })
      
      const businesses = response.data
      
      logger.info(`Found ${businesses.length} businesses`, { count: businesses.length }, 'BusinessSearch')
      
      // The backend returns an array directly, return it as is
      return businesses
    } catch (error: any) {
      logger.error('Failed to search businesses', error, { query, location }, 'BusinessSearch')
      
      // Re-throw the error to be handled by the calling component
      throw error
    }
  }

  async getBusinesses(params?: any) {
    const response = await this.client.get('/businesses/', { params })
    return response.data
  }

  async getBusiness(id: string) {
    const response = await this.client.get(`/businesses/${id}`)
    return response.data
  }

  async updateBusiness(id: string, data: any) {
    const response = await this.client.put(`/businesses/${id}`, data)
    return response.data
  }

  async deleteBusiness(id: string) {
    const response = await this.client.delete(`/businesses/${id}`)
    return response.data
  }

  async getBusinessStats() {
    const response = await this.client.get('/businesses/stats/overview')
    return response.data
  }

  async analyzeBusiness(id: string) {
    try {
      logger.info(`Analyzing business: ${id}`, { businessId: id }, 'BusinessAnalysis')
      
      const response = await this.client.post(`/businesses/${id}/analyze`)
      
      logger.info(`Analysis complete for business: ${id}`, response.data, 'BusinessAnalysis')
      
      return response.data
    } catch (error: any) {
      logger.error(`Failed to analyze business: ${id}`, error, { businessId: id }, 'BusinessAnalysis')
      
      // Provide more context in the error message
      if (error.response?.status === 404) {
        throw new Error('Business not found. It may have been deleted or the ID is incorrect.')
      } else if (error.response?.status === 500) {
        throw new Error('Analysis service is temporarily unavailable. Please try again later.')
      } else {
        throw error
      }
    }
  }

  // Lead Scoring
  async scoreLeads(criteria: LeadScoringCriteria, limit: number = 50) {
    const response = await this.client.post(`/leads/score-leads?limit=${limit}`, criteria)
    return response.data
  }

  async getHotLeads(days: number = 7, minScore: number = 70) {
    const response = await this.client.get('/leads/hot-leads', {
      params: { days_back: days, min_score: minScore }
    })
    return response.data
  }

  async autoPrioritizeLeads(category?: string, location?: string) {
    const response = await this.client.post('/leads/auto-prioritize', {
      category,
      location
    })
    return response.data
  }

  async getLeadDistribution() {
    const response = await this.client.get('/leads/lead-distribution')
    return response.data
  }

  // AI Analysis

  async bulkAnalyze(businessIds: string[]) {
    const response = await this.client.post('/analysis/bulk-analyze', {
      business_ids: businessIds
    })
    return response.data
  }

  async getOpportunities(minScore: number = 70) {
    const response = await this.client.get('/analysis/opportunities', {
      params: { min_score: minScore }
    })
    return response.data
  }

  // Campaign Management
  async createCampaign(campaignData: any) {
    const response = await this.client.post('/campaigns/create', campaignData)
    return response.data
  }

  async getCampaigns(status?: string) {
    const response = await this.client.get('/campaigns/', {
      params: status ? { status } : {}
    })
    return response.data
  }

  async getCampaignStats(campaignId: string) {
    const response = await this.client.get(`/campaigns/${campaignId}/stats`)
    return response.data
  }

  async startCampaign(campaignId: string) {
    const response = await this.client.post(`/campaigns/${campaignId}/start`)
    return response.data
  }

  async pauseCampaign(campaignId: string) {
    const response = await this.client.post(`/campaigns/${campaignId}/pause`)
    return response.data
  }

  async addLeadsToCampaign(campaignId: string, businessIds: string[]) {
    const response = await this.client.post(`/campaigns/${campaignId}/add-leads`, {
      business_ids: businessIds
    })
    return response.data
  }

  async getCampaignTemplates() {
    const response = await this.client.get('/campaigns/templates')
    return response.data
  }

  // Outreach
  async generateEmail(businessId: string, serviceType: string, tone: string = 'professional') {
    const response = await this.client.post(`/outreach/generate-email/${businessId}`, {
      service_type: serviceType,
      tone
    })
    return response.data
  }

  async batchGenerateEmails(businessIds: string[], serviceType: string, tone: string = 'professional') {
    const response = await this.client.post('/outreach/batch-generate', {
      business_ids: businessIds,
      service_type: serviceType,
      tone
    })
    return response.data
  }

  async getEmailTemplates() {
    const response = await this.client.get('/outreach/templates')
    return response.data
  }

  // Real Email Sending
  async sendEmail(businessId: string, recipientEmail: string, subject: string, body: string,
                  trackOpens: boolean = true, trackClicks: boolean = true) {
    const response = await this.client.post('/outreach/send-email', {
      business_id: businessId,
      recipient_email: recipientEmail,
      subject,
      body,
      track_opens: trackOpens,
      track_clicks: trackClicks
    })
    return response.data
  }

  async sendBatchEmails(emails: Array<{business_id: string, recipient_email: string, subject: string, body: string}>,
                        trackOpens: boolean = true, trackClicks: boolean = true) {
    const response = await this.client.post('/outreach/send-batch-emails', {
      emails,
      track_opens: trackOpens,
      track_clicks: trackClicks
    })
    return response.data
  }

  async getEmailStats() {
    const response = await this.client.get('/outreach/email-stats')
    return response.data
  }

  async markAsConverted(businessId: string, notes?: string) {
    const response = await this.client.post(`/outreach/mark-converted/${businessId}`, { notes })
    return response.data
  }

  async getFollowUpSuggestions(daysSinceContact: number = 7) {
    const response = await this.client.get('/outreach/follow-ups', {
      params: { days_since_contact: daysSinceContact }
    })
    return response.data
  }

  // Email Analytics
  async getEmailAnalytics(emailId: string) {
    const response = await this.client.get(`/email/analytics/email/${emailId}`)
    return response.data
  }

  async getCampaignAnalytics(campaignId: string) {
    const response = await this.client.get(`/email/analytics/campaign/${campaignId}`)
    return response.data
  }

  async getUserAnalytics(days: number = 30) {
    const response = await this.client.get('/email/analytics/user', {
      params: { days }
    })
    return response.data
  }

  async getAnalyticsDashboard() {
    const response = await this.client.get('/email/analytics/dashboard')
    return response.data
  }

  // Email Delivery Monitoring
  async getDeliveryStats(days: number = 30) {
    const response = await this.client.get('/email/delivery/stats', {
      params: { days }
    })
    return response.data
  }

  async getProblematicEmails(days: number = 7, limit: number = 50) {
    const response = await this.client.get('/email/delivery/problematic', {
      params: { days, limit }
    })
    return response.data
  }

  async retryFailedEmails(maxRetries: number = 10) {
    const response = await this.client.post('/email/delivery/retry-failed', null, {
      params: { max_retries: maxRetries }
    })
    return response.data
  }

  async getSuppressionList() {
    const response = await this.client.get('/email/delivery/suppression-list')
    return response.data
  }

  async addToSuppressionList(emailAddresses: string[], reason: string = 'Manual suppression') {
    const response = await this.client.post('/email/delivery/suppression-list', {
      email_addresses: emailAddresses,
      reason
    })
    return response.data
  }

  async removeFromSuppressionList(emailAddress: string) {
    const response = await this.client.delete(`/email/delivery/suppression-list/${emailAddress}`)
    return response.data
  }

  async getProviderStats() {
    const response = await this.client.get('/email/delivery/provider-stats')
    return response.data
  }

  async processWebhook(provider: string, eventData: any) {
    const response = await this.client.post(`/email/delivery/webhook/${provider}`, {
      provider,
      event_data: eventData
    })
    return response.data
  }

  // Email Templates Management
  async createTemplate(templateData: {
    name: string
    service_type: string
    subject: string
    body: string
    description?: string
    category?: string
    tags?: string[]
  }) {
    const response = await this.client.post('/email/templates/', templateData)
    return response.data
  }

  async getTemplates(params?: {
    service_type?: string
    category?: string
    is_active?: boolean
    skip?: number
    limit?: number
  }) {
    const response = await this.client.get('/email/templates/', { params })
    return response.data
  }

  async getTemplate(templateId: number) {
    const response = await this.client.get(`/email/templates/${templateId}`)
    return response.data
  }

  async updateTemplate(templateId: number, templateData: {
    name?: string
    subject?: string
    body?: string
    description?: string
    category?: string
    tags?: string[]
    is_active?: boolean
  }) {
    const response = await this.client.put(`/email/templates/${templateId}`, templateData)
    return response.data
  }

  async deleteTemplate(templateId: number) {
    const response = await this.client.delete(`/email/templates/${templateId}`)
    return response.data
  }

  async getTemplateCategories() {
    const response = await this.client.get('/email/templates/categories/list')
    return response.data
  }

  async getServiceTypes() {
    const response = await this.client.get('/email/templates/service-types/list')
    return response.data
  }

  async cloneTemplate(templateId: number, newName: string) {
    const response = await this.client.post(`/email/templates/${templateId}/clone`, null, {
      params: { new_name: newName }
    })
    return response.data
  }

  // Analytics
  async getDashboard(): Promise<DashboardMetrics> {
    const response = await this.client.get('/analytics/dashboard')
    return response.data
  }

  async getPerformanceTrend(days: number = 30) {
    const response = await this.client.get('/analytics/performance-trend', {
      params: { days }
    })
    return response.data
  }

  async getTopOpportunities(limit: number = 10) {
    const response = await this.client.get('/analytics/top-opportunities', {
      params: { limit }
    })
    return response.data
  }

  async getCampaignPerformance() {
    const response = await this.client.get('/analytics/campaign-performance')
    return response.data
  }

  async getConversionFunnel() {
    const response = await this.client.get('/analytics/conversion-funnel')
    return response.data
  }

  async getCategoryInsights() {
    const response = await this.client.get('/analytics/category-insights')
    return response.data
  }

  async getLocationInsights() {
    const response = await this.client.get('/analytics/location-insights')
    return response.data
  }

  // Export & Integration
  async exportLeads(format: 'csv' | 'json' | 'excel', filters?: any) {
    const response = await this.client.post('/export/leads', filters, {
      params: { format },
      responseType: format === 'json' ? 'json' : 'blob'
    })
    
    if (format !== 'json') {
      // Download file
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `leads_export.${format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    }
    
    return response.data
  }

  async exportCampaigns(campaignId?: string) {
    const response = await this.client.post('/export/campaigns', {
      campaign_id: campaignId
    })
    return response.data
  }

  async setupCRMIntegration(crmType: string, apiKey: string) {
    const response = await this.client.post('/export/integrate/crm', {
      crm_type: crmType,
      api_key: apiKey
    })
    return response.data
  }

  async syncToCRM(businessId: string, crmType: string) {
    const response = await this.client.post(`/export/sync/crm/${businessId}`, {
      crm_type: crmType
    })
    return response.data
  }

  async bulkSyncToCRM(businessIds: string[], crmType: string) {
    const response = await this.client.post('/export/bulk-sync/crm', {
      business_ids: businessIds,
      crm_type: crmType
    })
    return response.data
  }

  // Follow-up System
  async createFollowUpSequence(sequenceData: any) {
    const response = await this.client.post('/followup/sequences/create', sequenceData)
    return response.data
  }

  async getFollowUpTemplates() {
    const response = await this.client.get('/followup/sequences/templates')
    return response.data
  }

  async assignSequenceToLeads(sequenceId: string, businessIds: string[]) {
    const response = await this.client.post(`/followup/sequences/${sequenceId}/assign`, {
      business_ids: businessIds,
      start_immediately: true
    })
    return response.data
  }

  async getSequencePerformance(sequenceId: string) {
    const response = await this.client.get(`/followup/sequences/performance/${sequenceId}`)
    return response.data
  }

  async getPendingFollowUps(daysAhead: number = 7) {
    const response = await this.client.get('/followup/followups/pending', {
      params: { days_ahead: daysAhead }
    })
    return response.data
  }

  async scheduleFollowUp(businessId: string, date: string, type: string, notes?: string) {
    const response = await this.client.post('/followup/followups/schedule', {
      business_id: businessId,
      followup_date: date,
      followup_type: type,
      notes
    })
    return response.data
  }

  async getFollowUpCalendar(startDate?: string, endDate?: string) {
    const response = await this.client.get('/followup/followups/calendar', {
      params: { start_date: startDate, end_date: endDate }
    })
    return response.data
  }

  async completeFollowUp(businessId: string, outcome: string, notes?: string, scheduleNext?: string) {
    const response = await this.client.post(`/followup/followups/complete/${businessId}`, {
      outcome,
      notes,
      schedule_next: scheduleNext
    })
    return response.data
  }

  // Advanced Search
  async advancedSearch(filters: any, page: number = 1, pageSize: number = 50) {
    const response = await this.client.post('/search/advanced', filters, {
      params: {
        page,
        page_size: pageSize,
        sort_by: 'opportunity_score',
        sort_order: 'desc'
      }
    })
    return response.data
  }

  async smartSearch(query: string) {
    const response = await this.client.post('/search/smart-search', { query })
    return response.data
  }

  async saveSearch(name: string, filters: any, description?: string) {
    const response = await this.client.post('/search/saved-searches/create', {
      name,
      description,
      filters,
      notify_new_matches: true
    })
    return response.data
  }

  async getSavedSearches() {
    const response = await this.client.get('/search/saved-searches')
    return response.data
  }

  async getSearchSuggestions(query: string) {
    const response = await this.client.get('/search/suggestions', {
      params: { query }
    })
    return response.data
  }

  async getSearchFacets() {
    const response = await this.client.get('/search/facets')
    return response.data
  }
}

// Export singleton instance
const apiService = new ApiService()
export default apiService
