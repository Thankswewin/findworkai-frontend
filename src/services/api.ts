/**
 * SmartLeads AI API Service
 * Comprehensive API client for all backend endpoints
 */

import axios, { AxiosInstance } from 'axios'
import toast from 'react-hot-toast'

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

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
  private token: string | null = null

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Load token from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token')
    }

    // Request interceptor to add token
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`
      }
      return config
    })

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.logout()
          window.location.href = '/login'
        }
        const message = error.response?.data?.detail || 'An error occurred'
        toast.error(message)
        return Promise.reject(error)
      }
    )
  }

  // Authentication
  async login(credentials: LoginCredentials) {
    const formData = new FormData()
    formData.append('username', credentials.email)
    formData.append('password', credentials.password)
    
    const response = await this.client.post('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    this.token = response.data.access_token
    localStorage.setItem('access_token', this.token!)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    
    return response.data
  }

  async register(userData: any) {
    const response = await this.client.post('/auth/register', userData)
    return response.data
  }

  logout() {
    this.token = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  }

  // Business Management
  async searchBusinesses(query: string, location: string, radius: number = 5000) {
    const response = await this.client.post('/businesses/search', {
      query,
      location,
      radius
    })
    return response.data
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
  async analyzeBusiness(businessId: string) {
    const response = await this.client.post(`/analysis/analyze/${businessId}`)
    return response.data
  }

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
