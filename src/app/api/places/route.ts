import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || ''
const GOOGLE_PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place'

interface PlaceSearchRequest {
  query: string
  location: string
  radius?: number
  type?: string
}

interface BusinessData {
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
  photos?: string[]
  priceLevel?: number
  openNow?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...params } = body

    if (!GOOGLE_PLACES_API_KEY) {
      // If no API key is configured, return a helpful error message
      return NextResponse.json({
        error: 'Google Places API key not configured. Please add GOOGLE_PLACES_API_KEY to your .env.local file',
        setupInstructions: {
          step1: 'Go to https://console.cloud.google.com/',
          step2: 'Enable Places API',
          step3: 'Create an API key',
          step4: 'Add to .env.local: GOOGLE_PLACES_API_KEY=your_key_here'
        }
      }, { status: 500 })
    }

    switch (action) {
      case 'searchBusinesses':
        return await searchBusinesses(params)
      
      case 'getBusinessDetails':
        return await getBusinessDetails(params.placeId)
      
      case 'nearbySearch':
        return await nearbySearch(params)
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Places API error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to process request' 
    }, { status: 500 })
  }
}

async function searchBusinesses(params: PlaceSearchRequest) {
  const { query, location, radius = 5000, type = 'establishment' } = params
  
  try {
    // First, geocode the location to get coordinates
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_PLACES_API_KEY}`
    console.log('Geocoding URL:', geocodeUrl.replace(GOOGLE_PLACES_API_KEY, 'API_KEY_HIDDEN'))
    
    const geocodeResponse = await fetch(geocodeUrl)
    const geocodeData = await geocodeResponse.json()
    
    console.log('Geocode response status:', geocodeData.status)
    if (geocodeData.error_message) {
      console.error('Geocode error:', geocodeData.error_message)
    }
    
    if (geocodeData.status !== 'OK' || !geocodeData.results[0]) {
      throw new Error(`Geocoding failed: ${geocodeData.status} - ${geocodeData.error_message || 'No results found'}`)
    }
    
    const { lat, lng } = geocodeData.results[0].geometry.location
    
    // Text search for businesses
    const searchUrl = `${GOOGLE_PLACES_BASE_URL}/textsearch/json?query=${encodeURIComponent(query)}&location=${lat},${lng}&radius=${radius}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`
    
    const searchResponse = await fetch(searchUrl)
    const searchData = await searchResponse.json()
    
    if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
      throw new Error(`Places API error: ${searchData.status}`)
    }
    
    // Transform the results into our business format
    const businesses: BusinessData[] = searchData.results?.map((place: any) => ({
      id: place.place_id,
      name: place.name,
      category: place.types?.[0]?.replace(/_/g, ' ') || 'Business',
      location: place.formatted_address || location,
      rating: place.rating || 0,
      totalReviews: place.user_ratings_total || 0,
      hasWebsite: false, // Will be determined in details call
      address: place.formatted_address,
      photos: place.photos?.map((photo: any) => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
      ),
      priceLevel: place.price_level,
      openNow: place.opening_hours?.open_now
    })) || []
    
    return NextResponse.json({ 
      businesses,
      nextPageToken: searchData.next_page_token 
    })
  } catch (error: any) {
    console.error('Search businesses error:', error)
    return NextResponse.json({ 
      error: error.message,
      businesses: [] 
    }, { status: 500 })
  }
}

async function getBusinessDetails(placeId: string) {
  try {
    const detailsUrl = `${GOOGLE_PLACES_BASE_URL}/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,types,price_level,opening_hours,photos,reviews,business_status,geometry&key=${GOOGLE_PLACES_API_KEY}`
    
    const response = await fetch(detailsUrl)
    const data = await response.json()
    
    if (data.status !== 'OK') {
      throw new Error(`Places API error: ${data.status}`)
    }
    
    const place = data.result
    
    const business: BusinessData = {
      id: placeId,
      name: place.name,
      category: place.types?.[0]?.replace(/_/g, ' ') || 'Business',
      location: place.formatted_address,
      rating: place.rating || 0,
      totalReviews: place.user_ratings_total || 0,
      hasWebsite: !!place.website,
      website: place.website,
      phone: place.formatted_phone_number,
      address: place.formatted_address,
      photos: place.photos?.slice(0, 5).map((photo: any) => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
      ),
      priceLevel: place.price_level,
      openNow: place.opening_hours?.open_now
    }
    
    return NextResponse.json({ business })
  } catch (error: any) {
    console.error('Get business details error:', error)
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 })
  }
}

async function nearbySearch(params: any) {
  const { latitude, longitude, radius = 5000, type = 'establishment' } = params
  
  try {
    const nearbyUrl = `${GOOGLE_PLACES_BASE_URL}/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`
    
    const response = await fetch(nearbyUrl)
    const data = await response.json()
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Places API error: ${data.status}`)
    }
    
    const businesses: BusinessData[] = data.results?.map((place: any) => ({
      id: place.place_id,
      name: place.name,
      category: place.types?.[0]?.replace(/_/g, ' ') || 'Business',
      location: place.vicinity,
      rating: place.rating || 0,
      totalReviews: place.user_ratings_total || 0,
      hasWebsite: false,
      address: place.vicinity,
      photos: place.photos?.map((photo: any) => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
      ),
      priceLevel: place.price_level,
      openNow: place.opening_hours?.open_now
    })) || []
    
    return NextResponse.json({ 
      businesses,
      nextPageToken: data.next_page_token 
    })
  } catch (error: any) {
    console.error('Nearby search error:', error)
    return NextResponse.json({ 
      error: error.message,
      businesses: [] 
    }, { status: 500 })
  }
}
