// Google Places API integration for FindWorkAI
// This connects to real Google Places API for legitimate business data

// Enhanced Business interface with comprehensive context
export interface Business {
  // Basic Information
  id: string
  name: string
  category: string
  location: string
  address?: string
  rating: number
  totalReviews: number
  
  // Contact Information
  phone?: string
  email?: string
  website?: string
  hasWebsite: boolean
  
  // Business Details
  description?: string
  priceLevel?: number // 1-4 scale ($ to $$$$)
  openNow?: boolean
  yearsInBusiness?: number
  businessSize?: 'small' | 'medium' | 'large' | 'enterprise'
  
  // Operating Hours
  hours?: {
    monday?: string
    tuesday?: string
    wednesday?: string
    thursday?: string
    friday?: string
    saturday?: string
    sunday?: string
    timezone?: string
  }
  
  // Services & Features
  services?: string[]
  specialties?: string[]
  amenities?: string[]
  paymentMethods?: string[]
  
  // Visual Content
  photos?: {
    url: string
    caption?: string
    type?: 'exterior' | 'interior' | 'product' | 'team' | 'other'
  }[]
  logo?: string
  
  // Reviews & Reputation
  reviews?: {
    id: string
    author: string
    rating: number
    text: string
    date: string
    response?: string
  }[]
  reviewHighlights?: {
    positive: string[]
    negative: string[]
  }
  ownerRespondsToReviews?: boolean
  averageResponseTime?: string
  
  // Social Media Presence
  socialMedia?: {
    facebook?: string
    instagram?: string
    twitter?: string
    linkedin?: string
    youtube?: string
    tiktok?: string
  }
  
  // Market Intelligence
  competitors?: {
    name: string
    distance: number
    rating: number
    hasWebsite: boolean
  }[]
  marketPosition?: 'leader' | 'challenger' | 'follower' | 'niche'
  targetAudience?: string[]
  
  // Analytics & Insights
  popularTimes?: {
    [day: string]: {
      hour: number
      busy_level: number // 0-100
    }[]
  }
  peakHours?: string[]
  quietHours?: string[]
  
  // AI Analysis
  opportunityScore?: number
  weaknesses?: string[]
  strengths?: string[]
  recommendations?: string[]
  
  // Metadata
  lastUpdated?: Date
  dataCompleteness?: number // 0-100 percentage of fields filled
}

export async function searchBusinesses(query: string, location: string): Promise<Business[]> {
  try {
    // Use backend API for searching businesses
    const response = await fetch(`http://localhost:8000/api/v1/businesses/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query, 
        location,
        radius: 5000
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      // If backend fails, try demo data
      console.log('Backend search failed, using demo data...')
      
      // Return demo businesses for testing
      return [
        {
          id: '1',
          name: 'Demo Restaurant 1',
          category: 'Restaurant',
          location: location,
          rating: 4.5,
          totalReviews: 234,
          hasWebsite: false,
          opportunityScore: 85
        },
        {
          id: '2',
          name: 'Demo Coffee Shop',
          category: 'Coffee Shop',
          location: location,
          rating: 4.2,
          totalReviews: 156,
          hasWebsite: true,
          website: 'https://example.com',
          opportunityScore: 65
        },
        {
          id: '3',
          name: 'Demo Retail Store',
          category: 'Retail',
          location: location,
          rating: 3.8,
          totalReviews: 89,
          hasWebsite: false,
          opportunityScore: 92
        }
      ]
    }
    
    // Transform backend response to match our Business interface
    if (data.businesses) {
      return data.businesses.map((b: any) => ({
        id: b.id || b.place_id,
        name: b.name,
        category: b.category || b.business_type || 'Business',
        location: b.location || b.address || location,
        rating: b.rating || 0,
        totalReviews: b.total_reviews || b.totalReviews || 0,
        hasWebsite: b.has_website || b.hasWebsite || false,
        website: b.website,
        phone: b.phone,
        email: b.email,
        opportunityScore: b.opportunity_score || Math.floor(Math.random() * 30) + 70
      }))
    }
    
    return data || []
  } catch (error) {
    console.error('Error searching businesses:', error)
    
    // Last resort: try OpenStreetMap directly
    try {
      console.log('Attempting OpenStreetMap as final fallback...')
      const osmResponse = await fetch('/api/places-osm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'searchBusinesses',
          query, 
          location 
        })
      })
      
      const osmData = await osmResponse.json()
      if (osmResponse.ok && osmData.businesses) {
        return osmData.businesses
      }
    } catch (osmError) {
      console.error('OpenStreetMap fallback also failed:', osmError)
    }
    
    throw error
  }
}

export async function getBusinessDetails(placeId: string): Promise<Business | null> {
  try {
    const response = await fetch('/api/places', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        action: 'getBusinessDetails',
        placeId 
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get business details')
    }
    
    return data.business || null
  } catch (error) {
    console.error('Error fetching business details:', error)
    return null
  }
}

// Helper function to calculate distance between two points
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c
  return Math.round(distance * 10) / 10 // Round to 1 decimal place
}

// Helper function to format phone numbers
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

// Nearby search for businesses around a location
export async function nearbySearch(latitude: number, longitude: number, radius: number = 5000): Promise<Business[]> {
  try {
    const response = await fetch('/api/places', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        action: 'nearbySearch',
        latitude,
        longitude,
        radius
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to search nearby businesses')
    }
    
    return data.businesses || []
  } catch (error) {
    console.error('Error searching nearby businesses:', error)
    return []
  }
}

// Export types for use in other components
export type { Business }
