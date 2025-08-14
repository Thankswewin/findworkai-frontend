// Google Places API integration for FindWorkAI
// This connects to real Google Places API for legitimate business data

interface Business {
  id: string
  name: string
  category: string
  location: string
  rating: number
  totalReviews: number
  hasWebsite: boolean
  website?: string
  phone?: string
  email?: string
  address?: string
  opportunityScore?: number
  photos?: string[]
  priceLevel?: number
  openNow?: boolean
}

export async function searchBusinesses(query: string, location: string): Promise<Business[]> {
  try {
    // Try Google Places API first
    const response = await fetch('/api/places', {
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
    
    const data = await response.json()
    
    if (!response.ok) {
      // If Google Places fails, try OpenStreetMap as fallback
      console.log('Google Places API failed, trying OpenStreetMap...')
      
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
      
      if (osmResponse.ok && osmData.businesses && osmData.businesses.length > 0) {
        console.log(`Found ${osmData.businesses.length} businesses using OpenStreetMap`)
        return osmData.businesses
      }
      
      // If both fail, show error
      if (data.setupInstructions) {
        console.error('Google Places API Setup Required:', data.setupInstructions)
      }
      throw new Error(data.error || 'Failed to search businesses')
    }
    
    return data.businesses || []
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
