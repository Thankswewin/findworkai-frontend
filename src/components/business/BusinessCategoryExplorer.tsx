'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, MapPin, Star, Globe, Phone, Camera, ChevronRight,
  TrendingUp, Users, Building2, Sparkles, AlertCircle, Loader2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import toast from 'react-hot-toast'

// Business categories configuration
const businessCategories = [
  {
    id: 'food_beverage',
    name: 'Food & Beverage',
    icon: '🍽️',
    subcategories: [
      { id: 'restaurant', name: 'Restaurants', placeTypes: ['restaurant'] },
      { id: 'cafe', name: 'Cafes & Coffee', placeTypes: ['cafe', 'coffee_shop'] },
      { id: 'bakery', name: 'Bakeries', placeTypes: ['bakery'] },
      { id: 'bar', name: 'Bars & Pubs', placeTypes: ['bar', 'night_club'] }
    ]
  },
  {
    id: 'health_wellness',
    name: 'Health & Wellness',
    icon: '🏥',
    subcategories: [
      { id: 'medical', name: 'Medical Practices', placeTypes: ['doctor', 'hospital'] },
      { id: 'dental', name: 'Dental Clinics', placeTypes: ['dentist'] },
      { id: 'fitness', name: 'Fitness Centers', placeTypes: ['gym'] },
      { id: 'spa', name: 'Spas & Wellness', placeTypes: ['spa', 'beauty_salon'] }
    ]
  },
  {
    id: 'professional',
    name: 'Professional Services',
    icon: '💼',
    subcategories: [
      { id: 'legal', name: 'Law Firms', placeTypes: ['lawyer'] },
      { id: 'accounting', name: 'Accounting', placeTypes: ['accounting'] },
      { id: 'real_estate', name: 'Real Estate', placeTypes: ['real_estate_agency'] },
      { id: 'insurance', name: 'Insurance', placeTypes: ['insurance_agency'] }
    ]
  },
  {
    id: 'retail',
    name: 'Retail & Shopping',
    icon: '🛍️',
    subcategories: [
      { id: 'clothing', name: 'Clothing Stores', placeTypes: ['clothing_store'] },
      { id: 'electronics', name: 'Electronics', placeTypes: ['electronics_store'] },
      { id: 'furniture', name: 'Furniture', placeTypes: ['furniture_store'] },
      { id: 'general', name: 'General Stores', placeTypes: ['store', 'department_store'] }
    ]
  },
  {
    id: 'automotive',
    name: 'Automotive',
    icon: '🚗',
    subcategories: [
      { id: 'repair', name: 'Auto Repair', placeTypes: ['car_repair'] },
      { id: 'dealer', name: 'Dealerships', placeTypes: ['car_dealer'] },
      { id: 'rental', name: 'Car Rental', placeTypes: ['car_rental'] },
      { id: 'wash', name: 'Car Wash', placeTypes: ['car_wash'] }
    ]
  },
  {
    id: 'home_services',
    name: 'Home Services',
    icon: '🏠',
    subcategories: [
      { id: 'plumbing', name: 'Plumbing', placeTypes: ['plumber'] },
      { id: 'electrical', name: 'Electrical', placeTypes: ['electrician'] },
      { id: 'roofing', name: 'Roofing', placeTypes: ['roofing_contractor'] },
      { id: 'cleaning', name: 'Cleaning', placeTypes: ['laundry'] }
    ]
  }
]

interface Business {
  id: string
  name: string
  address: string
  rating: number
  totalReviews: number
  category: string
  hasWebsite: boolean
  phone?: string
  photoUrl?: string
  opportunityScore?: number
  photoAnalysis?: {
    visualScore: number
    insights: string[]
    recommendations: string[]
  }
}

export function BusinessCategoryExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [location, setLocation] = useState('New York, NY')
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [analyzingBusinessId, setAnalyzingBusinessId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch businesses when category and subcategory are selected
  const fetchBusinesses = async () => {
    if (!selectedCategory || !selectedSubcategory || !location) return

    setIsLoading(true)
    setError(null)
    
    try {
      const category = businessCategories.find(c => c.id === selectedCategory)
      const subcategory = category?.subcategories.find(s => s.id === selectedSubcategory)
      
      if (!subcategory) return

      // Try to call backend API first
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://findworkai-backend.onrender.com/api/v1'
      
      try {
        const response = await fetch(`${apiUrl}/categories/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: selectedCategory,
            subcategory: selectedSubcategory,
            place_types: subcategory.placeTypes,
            location: location,
            radius: 5000, // 5km radius
            analyze_photos: true // Request automatic photo analysis
          })
        })

        if (response.ok) {
          const data = await response.json()
          
          // Transform the data to match our Business interface, including photo analysis
          const transformedBusinesses: Business[] = data.businesses.map((b: any) => ({
            id: b.place_id,
            name: b.name,
            address: b.formatted_address || b.vicinity,
            rating: b.rating || 0,
            totalReviews: b.user_ratings_total || 0,
            category: subcategory.name,
            hasWebsite: b.website ? true : false,
            phone: b.formatted_phone_number,
            photoUrl: b.photo_url,
            opportunityScore: b.opportunity_score,
            // Include photo analysis if available from backend
            photoAnalysis: b.photo_analysis ? {
              visualScore: b.photo_analysis.visual_score,
              insights: b.photo_analysis.insights,
              recommendations: b.photo_analysis.recommendations
            } : undefined
          }))

          setBusinesses(transformedBusinesses)
          toast.success(`Found ${transformedBusinesses.length} ${subcategory.name.toLowerCase()}`)
          
          // Automatically analyze photos in background for businesses without analysis
          transformedBusinesses.forEach((business) => {
            if (!business.photoAnalysis && business.photoUrl) {
              analyzeBusinessPhotosInBackground(business)
            }
          })
          
          return
        }
      } catch (apiError) {
        console.warn('Backend API unavailable, using demo data:', apiError)
      }

      // Fallback: Use demo data if backend is unavailable
      const demoBusinesses = generateDemoBusinesses(subcategory.name, selectedCategory)
      setBusinesses(demoBusinesses)
      toast.info(`Showing demo ${subcategory.name.toLowerCase()} (Backend API unavailable)`)
      
      // Auto-analyze demo businesses in background
      demoBusinesses.forEach((business) => {
        if (business.photoUrl) {
          setTimeout(() => {
            // Simulate photo analysis for demo data
            setBusinesses(prev => prev.map(b => 
              b.id === business.id 
                ? {
                    ...b,
                    photoAnalysis: {
                      visualScore: Math.floor(Math.random() * 30) + 70,
                      insights: [
                        'Modern storefront with good lighting',
                        'Clean and professional appearance',
                        'Visible signage and branding'
                      ],
                      recommendations: [
                        'Consider adding outdoor seating area',
                        'Update window displays seasonally'
                      ]
                    }
                  }
                : b
            ))
          }, Math.random() * 2000 + 1000) // Random delay between 1-3 seconds
        }
      })
      
    } catch (err) {
      console.error('Error fetching businesses:', err)
      setError('Failed to fetch businesses. Please try again.')
      toast.error('Failed to fetch businesses')
    } finally {
      setIsLoading(false)
    }
  }

  // Generate demo businesses for testing
  const generateDemoBusinesses = (subcategoryName: string, categoryId: string): Business[] => {
    const demoData: Record<string, Business[]> = {
      'restaurant': [
        {
          id: 'demo-1',
          name: 'The Garden Bistro',
          address: '123 Main St, New York, NY 10001',
          rating: 4.5,
          totalReviews: 234,
          category: subcategoryName,
          hasWebsite: false,
          phone: '(212) 555-0123',
          photoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
          opportunityScore: 85
        },
        {
          id: 'demo-2',
          name: 'Mama\'s Kitchen',
          address: '456 Oak Ave, New York, NY 10002',
          rating: 4.2,
          totalReviews: 156,
          category: subcategoryName,
          hasWebsite: true,
          phone: '(212) 555-0456',
          photoUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400',
          opportunityScore: 65
        }
      ],
      'medical': [
        {
          id: 'demo-3',
          name: 'City Medical Center',
          address: '789 Health Blvd, New York, NY 10003',
          rating: 4.7,
          totalReviews: 445,
          category: subcategoryName,
          hasWebsite: false,
          phone: '(212) 555-0789',
          photoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400',
          opportunityScore: 78
        },
        {
          id: 'demo-4',
          name: 'Family Care Clinic',
          address: '321 Wellness Way, New York, NY 10004',
          rating: 4.4,
          totalReviews: 223,
          category: subcategoryName,
          hasWebsite: true,
          phone: '(212) 555-0321',
          photoUrl: 'https://images.unsplash.com/photo-1631815588090-e4194d7d9a2f?w=400',
          opportunityScore: 72
        }
      ],
      'default': [
        {
          id: 'demo-5',
          name: `Premium ${subcategoryName} Services`,
          address: '100 Business Plaza, New York, NY 10005',
          rating: 4.3,
          totalReviews: 189,
          category: subcategoryName,
          hasWebsite: false,
          phone: '(212) 555-1000',
          photoUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400',
          opportunityScore: 82
        },
        {
          id: 'demo-6',
          name: `${subcategoryName} Experts LLC`,
          address: '200 Commerce St, New York, NY 10006',
          rating: 4.6,
          totalReviews: 312,
          category: subcategoryName,
          hasWebsite: true,
          phone: '(212) 555-2000',
          photoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
          opportunityScore: 68
        }
      ]
    }

    // Return appropriate demo data based on subcategory
    if (categoryId === 'food_beverage' && subcategoryName.toLowerCase().includes('restaurant')) {
      return demoData['restaurant']
    } else if (categoryId === 'health_wellness' && subcategoryName.toLowerCase().includes('medical')) {
      return demoData['medical']
    } else {
      return demoData['default']
    }
  }

  // Analyze business photos in background (silent, no loading state)
  const analyzeBusinessPhotosInBackground = async (business: Business) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://findworkai-backend.onrender.com/api/v1'
      const response = await fetch(`${apiUrl}/categories/analyze-photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          place_id: business.id,
          business_name: business.name,
          category: selectedCategory,
          subcategory: selectedSubcategory
        })
      })

      if (!response.ok) throw new Error('Failed to analyze photos')
      
      const data = await response.json()
      
      // Update the business with photo analysis
      setBusinesses(prev => prev.map(b => 
        b.id === business.id 
          ? {
              ...b,
              photoAnalysis: {
                visualScore: data.visual_score,
                insights: data.insights,
                recommendations: data.recommendations
              }
            }
          : b
      ))
    } catch (err) {
      console.error('Background photo analysis failed:', err)
      // Silent failure - no toast notification for background operations
    }
  }

  // Trigger search when category/subcategory changes
  useEffect(() => {
    if (selectedCategory && selectedSubcategory && location) {
      fetchBusinesses()
    }
  }, [selectedCategory, selectedSubcategory])

  return (
    <div className="space-y-6">
      {/* Location Input */}
      <div className="flex gap-2 items-center">
        <MapPin className="h-5 w-5 text-gray-500" />
        <Input
          type="text"
          placeholder="Enter location (e.g., New York, NY)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="max-w-md"
        />
        <Button 
          onClick={fetchBusinesses}
          disabled={!selectedCategory || !selectedSubcategory || !location}
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Category Selection Grid */}
      {!selectedCategory && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Select a Business Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {businessCategories.map((category) => (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <p className="text-sm font-medium">{category.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Subcategory Selection */}
      {selectedCategory && !selectedSubcategory && (
        <div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="mb-4"
          >
            ← Back to Categories
          </Button>
          <h3 className="text-lg font-semibold mb-4">
            Select a Subcategory in {businessCategories.find(c => c.id === selectedCategory)?.name}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {businessCategories
              .find(c => c.id === selectedCategory)
              ?.subcategories.map((sub) => (
                <motion.div
                  key={sub.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedSubcategory(sub.id)}
                  >
                    <CardContent className="p-4">
                      <p className="font-medium">{sub.name}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* Business Results */}
      {selectedCategory && selectedSubcategory && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSelectedSubcategory(null)
                  setBusinesses([])
                }}
              >
                ← Back
              </Button>
              <h3 className="text-lg font-semibold">
                {businessCategories.find(c => c.id === selectedCategory)?.subcategories.find(s => s.id === selectedSubcategory)?.name} in {location}
              </h3>
            </div>
            <Badge variant="secondary">
              {businesses.length} businesses found
            </Badge>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Business Cards Grid */}
          {!isLoading && businesses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <Card key={business.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {business.photoUrl && (
                    <div className="h-48 bg-gray-200 relative">
                      <img 
                        src={business.photoUrl} 
                        alt={business.name}
                        className="w-full h-full object-cover"
                      />
                      {business.photoAnalysis && (
                        <div className="absolute top-2 right-2">
                          <Badge 
                            variant={business.photoAnalysis.visualScore > 70 ? "default" : "secondary"}
                          >
                            Visual Score: {business.photoAnalysis.visualScore}%
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-lg line-clamp-1">{business.name}</h4>
                      {business.opportunityScore && (
                        <Badge variant="outline" className="ml-2">
                          {business.opportunityScore}% Opportunity
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{business.address}</p>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{business.rating}</span>
                        <span className="text-sm text-gray-500">({business.totalReviews})</span>
                      </div>
                      {business.hasWebsite ? (
                        <Badge variant="secondary">
                          <Globe className="h-3 w-3 mr-1" />
                          Has Website
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          No Website
                        </Badge>
                      )}
                    </div>

                    {/* Photo Analysis Results */}
                    {business.photoAnalysis && (
                      <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Visual Insights:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {business.photoAnalysis.insights.slice(0, 2).map((insight, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="mr-1">•</span>
                              <span>{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        variant={business.hasWebsite ? "outline" : "default"}
                      >
                        {business.hasWebsite ? (
                          <>
                            <Globe className="h-4 w-4 mr-2" />
                            View Website
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Build AI Website
                          </>
                        )}
                      </Button>
                      <Button size="sm" variant="outline">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && businesses.length === 0 && !error && (
            <Card className="p-12">
              <CardContent className="text-center">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No businesses found</h3>
                <p className="text-gray-600">Try adjusting your location or selecting a different category</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
