import { create } from 'zustand'
import axios from 'axios'

// Always use deployed backend - no localhost fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://findworkai-backend-1.onrender.com/api/v1'

interface Business {
  id: string
  name: string
  category: string
  location: string
  rating: number
  totalReviews: number
  hasWebsite: boolean
  opportunityScore: number
  weaknesses: string[]
}

interface Stats {
  totalBusinesses: number
  noWebsiteCount: number
  noWebsitePercentage: number
  lowRatingCount: number
  emailsSent: number
}

interface BusinessStore {
  businesses: Business[]
  stats: Stats | null
  isLoading: boolean
  error: string | null
  
  fetchBusinesses: () => Promise<void>
  searchBusinesses: (query: string, location: string) => Promise<void>
  analyzeBusinesses: (businessIds: string[]) => Promise<void>
  generateEmail: (businessId: string, serviceType: string) => Promise<any>
}

export const useBusinessStore = create<BusinessStore>((set, get) => ({
  businesses: [],
  stats: null,
  isLoading: false,
  error: null,

  fetchBusinesses: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.get(`${API_URL}/businesses`)
      const businesses = response.data.map((b: any) => ({
        id: b.id,
        name: b.name,
        category: b.business_category,
        location: `${b.city}, ${b.state}`,
        rating: b.rating,
        totalReviews: b.total_reviews,
        hasWebsite: b.has_website,
        opportunityScore: b.opportunity_score || 50,
        weaknesses: b.weaknesses?.map((w: any) => w.description) || []
      }))
      
      // Fetch stats
      const statsResponse = await axios.get(`${API_URL}/businesses/stats/overview`)
      
      set({ 
        businesses,
        stats: {
          totalBusinesses: statsResponse.data.total_businesses,
          noWebsiteCount: statsResponse.data.no_website_count,
          noWebsitePercentage: statsResponse.data.opportunity_percentage,
          lowRatingCount: statsResponse.data.low_rating_count,
          emailsSent: 0
        },
        isLoading: false 
      })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  searchBusinesses: async (query: string, location: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post(`${API_URL}/businesses/search`, {
        query,
        location,
        radius: 5000
      })
      
      const businesses = response.data.map((b: any) => ({
        id: b.id,
        name: b.name,
        category: b.business_category,
        location: `${b.city}, ${b.state}`,
        rating: b.rating,
        totalReviews: b.total_reviews,
        hasWebsite: b.has_website,
        opportunityScore: b.opportunity_score || 50,
        weaknesses: b.weaknesses?.map((w: any) => w.description) || []
      }))
      
      set({ businesses, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  analyzeBusinesses: async (businessIds: string[]) => {
    try {
      // Use demo endpoint that doesn't require auth
      const businesses = get().businesses.filter(b => businessIds.includes(b.id))
      
      for (const business of businesses) {
        const response = await axios.post(
          `${API_URL}/demo/analyze-business`,
          {
            name: business.name,
            business_category: business.category,
            city: business.location.split(',')[0],
            state: business.location.split(',')[1]?.trim() || '',
            rating: business.rating,
            total_reviews: business.totalReviews,
            has_website: business.hasWebsite,
            website: null
          }
        )
        
        // Update business with analysis results
        if (response.data.success) {
          business.opportunityScore = response.data.opportunity_score
          business.weaknesses = response.data.analysis.weaknesses || []
        }
      }
      
      set({ businesses: [...get().businesses] })
    } catch (error: any) {
      set({ error: error.message })
    }
  },

  generateEmail: async (businessId: string, serviceType: string) => {
    try {
      // Use demo endpoint that doesn't require auth
      const business = get().businesses.find(b => b.id === businessId)
      
      if (!business) {
        throw new Error('Business not found')
      }
      
      const response = await axios.post(
        `${API_URL}/demo/generate-email`,
        {
          business_name: business.name,
          service_type: serviceType,
          weaknesses: business.weaknesses || [],
          opportunities: [],
          rating: business.rating
        }
      )
      
      return response.data
    } catch (error: any) {
      set({ error: error.message })
      throw error
    }
  }
}))
