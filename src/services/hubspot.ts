import toast from 'react-hot-toast'

interface HubSpotConfig {
  accessToken: string
  portalId?: string
}

interface HubSpotContact {
  email?: string
  firstname?: string
  lastname?: string
  phone?: string
  company?: string
  website?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  jobtitle?: string
  hs_lead_status?: string
  opportunity_score?: number
  notes?: string
}

interface HubSpotCompany {
  name: string
  domain?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  website?: string
  numberofemployees?: number
  industry?: string
  description?: string
  opportunity_score?: number
  weaknesses?: string
  strengths?: string
}

interface HubSpotDeal {
  dealname: string
  pipeline?: string
  dealstage?: string
  amount?: number
  closedate?: string
  hs_priority?: string
  description?: string
}

class HubSpotService {
  private config: HubSpotConfig | null = null
  private headers: any = {}

  // Initialize with access token
  initialize(accessToken: string, portalId?: string) {
    this.config = { accessToken, portalId }
    this.headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('hubspot_config', JSON.stringify(this.config))
    }
  }

  // Load config from localStorage
  loadConfig() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('hubspot_config')
      if (stored) {
        const config = JSON.parse(stored)
        this.initialize(config.accessToken, config.portalId)
        return true
      }
    }
    return false
  }

  // Check if HubSpot is connected
  isConnected(): boolean {
    return !!this.config?.accessToken
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    if (!this.config) return false
    
    try {
      const response = await fetch('/api/hubspot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'testConnection',
          token: this.config.accessToken
        })
      })
      
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Connection test failed')
      }
      return data.success
    } catch (error) {
      console.error('HubSpot connection test failed:', error)
      return false
    }
  }

  // Create or update a contact
  async createOrUpdateContact(contact: HubSpotContact): Promise<any> {
    if (!this.config) throw new Error('HubSpot not configured')
    
    try {
      const response = await fetch('/api/hubspot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'createContact',
          token: this.config.accessToken,
          data: contact
        })
      })
      
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create/update contact')
      }
      return data
    } catch (error: any) {
      console.error('Failed to create/update contact:', error)
      throw new Error(error.message || 'Failed to sync with HubSpot')
    }
  }

  // Create or update a company
  async createOrUpdateCompany(company: HubSpotCompany): Promise<any> {
    if (!this.config) throw new Error('HubSpot not configured')
    
    try {
      const response = await fetch('/api/hubspot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'createCompany',
          token: this.config.accessToken,
          data: company
        })
      })
      
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create/update company')
      }
      return data
    } catch (error: any) {
      console.error('Failed to create/update company:', error)
      throw new Error(error.message || 'Failed to sync company with HubSpot')
    }
  }

  // Create a deal
  async createDeal(deal: HubSpotDeal, companyId?: string): Promise<any> {
    if (!this.config) throw new Error('HubSpot not configured')
    
    try {
      const response = await fetch('/api/hubspot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'createDeal',
          token: this.config.accessToken,
          data: deal,
          companyId
        })
      })
      
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create deal')
      }
      return data
    } catch (error: any) {
      console.error('Failed to create deal:', error)
      throw new Error(error.message || 'Failed to create deal in HubSpot')
    }
  }

  // Sync analyzed business to HubSpot
  async syncAnalyzedBusiness(business: any): Promise<void> {
    if (!this.config) {
      toast.error('HubSpot not connected. Please configure in settings.')
      return
    }
    
    try {
      // Create/update company
      const companyData: HubSpotCompany = {
        name: business.name,
        website: business.website,
        phone: business.phone,
        address: business.address,
        city: business.location?.split(',')[0]?.trim(),
        state: business.location?.split(',')[1]?.trim(),
        industry: business.category,
        opportunity_score: business.opportunityScore,
        weaknesses: business.weaknesses?.join(', '),
        strengths: business.strengths?.join(', '),
        description: `FindWorkAI Analysis:\n` +
                    `Opportunity Score: ${business.opportunityScore}%\n` +
                    `Rating: ${business.rating}/5 (${business.reviews} reviews)\n` +
                    `Analysis Date: ${new Date().toLocaleDateString()}`
      }
      
      const company = await this.createOrUpdateCompany(companyData)
      
      // Create a deal for high-opportunity businesses
      if (business.opportunityScore >= 70) {
        const dealData: HubSpotDeal = {
          dealname: `${business.name} - Website Services`,
          pipeline: 'default',
          dealstage: 'appointmentscheduled',
          amount: 5000, // Default amount, adjust as needed
          closedate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          hs_priority: business.opportunityScore >= 80 ? 'high' : 'medium',
          description: `High opportunity business identified through FindWorkAI.\n` +
                      `Opportunity Score: ${business.opportunityScore}%\n` +
                      `Key Weaknesses: ${business.weaknesses?.join(', ')}`
        }
        
        await this.createDeal(dealData, company.id)
      }
      
      toast.success(`${company.updated ? 'Updated' : 'Created'} in HubSpot: ${business.name}`)
    } catch (error: any) {
      toast.error(`HubSpot sync failed: ${error.message}`)
      throw error
    }
  }

  // Batch sync multiple businesses
  async batchSyncBusinesses(businesses: any[]): Promise<void> {
    if (!this.config) {
      toast.error('HubSpot not connected')
      return
    }
    
    let successCount = 0
    let failCount = 0
    
    for (const business of businesses) {
      try {
        await this.syncAnalyzedBusiness(business)
        successCount++
      } catch (error) {
        failCount++
        console.error(`Failed to sync ${business.name}:`, error)
      }
    }
    
    if (successCount > 0) {
      toast.success(`Synced ${successCount} businesses to HubSpot`)
    }
    if (failCount > 0) {
      toast.error(`Failed to sync ${failCount} businesses`)
    }
  }

  // Get contacts from HubSpot
  async getContacts(limit: number = 100): Promise<any[]> {
    if (!this.config) throw new Error('HubSpot not configured')
    
    try {
      const response = await fetch('/api/hubspot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getContacts',
          token: this.config.accessToken,
          limit
        })
      })
      
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch contacts')
      }
      return data.results || []
    } catch (error: any) {
      console.error('Failed to fetch contacts:', error)
      throw new Error(error.message || 'Failed to fetch contacts from HubSpot')
    }
  }

  // Get companies from HubSpot
  async getCompanies(limit: number = 100): Promise<any[]> {
    if (!this.config) throw new Error('HubSpot not configured')
    
    try {
      const response = await fetch('/api/hubspot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getCompanies',
          token: this.config.accessToken,
          limit
        })
      })
      
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch companies')
      }
      return data.results || []
    } catch (error: any) {
      console.error('Failed to fetch companies:', error)
      throw new Error(error.message || 'Failed to fetch companies from HubSpot')
    }
  }

  // Get deals from HubSpot
  async getDeals(limit: number = 100): Promise<any[]> {
    if (!this.config) throw new Error('HubSpot not configured')
    
    try {
      const response = await fetch('/api/hubspot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getDeals',
          token: this.config.accessToken,
          limit
        })
      })
      
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch deals')
      }
      return data.results || []
    } catch (error: any) {
      console.error('Failed to fetch deals:', error)
      throw new Error(error.message || 'Failed to fetch deals from HubSpot')
    }
  }

  // Send email through HubSpot
  async sendEmail(to: string, subject: string, body: string): Promise<any> {
    if (!this.config) throw new Error('HubSpot not configured')
    
    // Note: This requires HubSpot Marketing Hub
    // For now, we'll create an engagement (note) instead
    try {
      const response = await fetch('/api/hubspot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'createNote',
          token: this.config.accessToken,
          data: {
            to,
            subject,
            body
          }
        })
      })
      
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save email to HubSpot')
      }
      
      toast.success('Email draft saved to HubSpot')
      return data
    } catch (error: any) {
      console.error('Failed to create email note:', error)
      throw new Error(error.message || 'Failed to save email to HubSpot')
    }
  }

  // Disconnect HubSpot
  disconnect() {
    this.config = null
    this.headers = {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hubspot_config')
    }
    toast.success('HubSpot disconnected')
  }
}

// Export singleton instance
export const hubspotService = new HubSpotService()

// Helper function to format business for HubSpot
export function formatBusinessForHubSpot(business: any): HubSpotCompany {
  return {
    name: business.name,
    domain: business.website?.replace(/^https?:\/\//, '').replace(/\/$/, ''),
    website: business.website,
    phone: business.phone,
    address: business.address,
    city: business.location?.split(',')[0]?.trim(),
    state: business.location?.split(',')[1]?.trim(),
    industry: business.category,
    opportunity_score: business.opportunityScore,
    weaknesses: Array.isArray(business.weaknesses) ? business.weaknesses.join(', ') : business.weaknesses,
    strengths: Array.isArray(business.strengths) ? business.strengths.join(', ') : business.strengths,
    description: `FindWorkAI Analysis\nOpportunity Score: ${business.opportunityScore}%\nRating: ${business.rating}/5\nReviews: ${business.reviews}`
  }
}
