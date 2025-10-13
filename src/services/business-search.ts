import { apiClient } from '@/lib/api-client'

interface SearchFilters {
  q?: string
  categories?: string[]
  rating_min?: number
  rating_max?: number
  review_count_min?: number
  review_count_max?: number
  verified?: boolean
  open_now?: boolean
  open_at?: string
  latitude?: number
  longitude?: number
  radius_km?: number
  sort_by?: string
  order?: string
  page?: number
  page_size?: number
}

interface BusinessSearchResponse {
  businesses: Business[]
  total_count: number
  page: number
  page_size: number
  total_pages: number
  filters_applied: Record<string, any>
  cached: boolean
}

interface Business {
  id: number
  name: string
  address: string
  phone?: string
  email?: string
  website?: string
  description?: string
  rating: number
  review_count: number
  verified: boolean
  categories: string[]
  business_hours?: {
    timezone?: string
    weekly?: Record<string, Array<{ open: string; close: string }>>
  }
  latitude?: number
  longitude?: number
  distance_km?: number
}

export async function searchBusinesses(filters: SearchFilters): Promise<BusinessSearchResponse> {
  try {
    // Build query params
    const params = new URLSearchParams()
    
    // Add all filters to params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          // Handle array params (categories)
          value.forEach(v => params.append(key, v))
        } else if (typeof value === 'boolean') {
          params.append(key, value.toString())
        } else {
          params.append(key, String(value))
        }
      }
    })

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/businesses/search?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add auth header if available
          ...(typeof window !== 'undefined' && localStorage.getItem('token') 
            ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            : {}
          )
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Business search error:', error)
    throw error
  }
}

export async function getBusinessDetails(businessId: number): Promise<Business> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/businesses/${businessId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(typeof window !== 'undefined' && localStorage.getItem('token') 
            ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            : {}
          )
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch business details: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Get business details error:', error)
    throw error
  }
}

export async function refreshBusinessData(businessIds: number[]): Promise<{
  status: string
  updated_count: number
  total_requested: number
}> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/businesses/search/refresh`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(typeof window !== 'undefined' && localStorage.getItem('token') 
            ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            : {}
          )
        },
        body: JSON.stringify({ business_ids: businessIds })
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to refresh business data: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Refresh business data error:', error)
    throw error
  }
}

export async function analyzeBusinesses(businessIds: number[]): Promise<{
  analyses: Array<{
    business_id: number
    weaknesses: string[]
    opportunities: string[]
    lead_score: number
    recommendations: string[]
  }>
}> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/analysis/bulk`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(typeof window !== 'undefined' && localStorage.getItem('token') 
            ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            : {}
          )
        },
        body: JSON.stringify({ business_ids: businessIds })
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to analyze businesses: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Analyze businesses error:', error)
    throw error
  }
}

// Helper function to build Google Maps URL
export function getGoogleMapsUrl(business: Business): string {
  const query = encodeURIComponent(`${business.name} ${business.address}`)
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}

// Helper function to check if business is currently open
export function isBusinessOpen(business: Business): boolean {
  if (!business.business_hours?.weekly) {
    return false
  }

  const now = new Date()
  const dayName = now.toLocaleLowerCase().slice(0, 3) // 'mon', 'tue', etc.
  const currentTime = now.getHours() * 60 + now.getMinutes() // minutes since midnight
  
  const todayHours = business.business_hours.weekly[dayName]
  if (!todayHours || todayHours.length === 0) {
    return false
  }

  for (const period of todayHours) {
    const [openHour, openMin] = period.open.split(':').map(Number)
    const [closeHour, closeMin] = period.close.split(':').map(Number)
    
    const openTime = openHour * 60 + openMin
    const closeTime = closeHour * 60 + closeMin
    
    // Handle overnight hours
    if (closeTime < openTime) {
      if (currentTime >= openTime || currentTime <= closeTime) {
        return true
      }
    } else {
      if (currentTime >= openTime && currentTime <= closeTime) {
        return true
      }
    }
  }

  return false
}

// Categories for filtering
export const BUSINESS_CATEGORIES = [
  'Restaurant',
  'Retail',
  'Healthcare',
  'Professional Services',
  'Beauty & Spa',
  'Fitness',
  'Automotive',
  'Real Estate',
  'Education',
  'Entertainment',
  'Home Services',
  'Technology',
  'Finance',
  'Legal',
  'Manufacturing',
  'Construction',
  'Food & Beverage',
  'Hotel & Lodging',
  'Non-Profit',
  'Government',
] as const

export type BusinessCategory = typeof BUSINESS_CATEGORIES[number]
