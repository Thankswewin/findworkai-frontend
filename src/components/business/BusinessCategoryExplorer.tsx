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
import BusinessCard from '@/components/business-card'
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

interface BusinessCategoryExplorerProps {
  onAnalyze?: (business: any) => void
  onBuildWebsite?: (business: any) => void
  onGenerateEmail?: (business: any) => void
  onGenerateSMS?: (business: any) => void
  onAnalyzeWebsite?: (business: any) => void
  selectedBusiness?: any
  setSelectedBusiness?: (business: any) => void
  showAIAgent?: boolean
  setShowAIAgent?: (show: boolean) => void
  aiAgentType?: 'website' | 'content' | 'marketing'
  setAIAgentType?: (type: 'website' | 'content' | 'marketing') => void
  showEmailDialog?: boolean
  setShowEmailDialog?: (show: boolean) => void
  generatedEmail?: any
  setGeneratedEmail?: (email: any) => void
}

export function BusinessCategoryExplorer(props: BusinessCategoryExplorerProps) {
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

      // Try to call backend API first - Use same URL as dashboard
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://findworkai-backend-1.onrender.com/api/v1'
      
      try {
        const response = await fetch(`${apiUrl}/categories/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: selectedCategory,
            subcategory: selectedSubcategory,
            place_types: subcategory.placeTypes,
            location: location,
            radius: 5000 // 5km radius
          })
        })

        if (response.ok) {
          const data = await response.json()
          
          // Transform the data to match our Business interface, including photo analysis
          const transformedBusinesses: Business[] = data.businesses.map((b: any) => ({
            id: b.place_id,
            name: b.name,
            address: b.formatted_address || b.vicinity,
            location: b.formatted_address || b.vicinity, // BusinessCard expects 'location'
            rating: b.rating || 0,
            totalReviews: b.user_ratings_total || 0,
            category: subcategory.name,
            hasWebsite: b.website ? true : false,
            website: b.website,
            phone: b.formatted_phone_number,
            email: b.email,
            photoUrl: b.photo_url,
            opportunityScore: b.opportunity_score || (b.website ? 30 : 70),
            place_id: b.place_id,
            // Include photo analysis if available from backend
            photoAnalysis: b.photo_analysis ? {
              visualScore: b.photo_analysis.visual_score,
              insights: b.photo_analysis.insights,
              recommendations: b.photo_analysis.recommendations
            } : undefined
          }))

          setBusinesses(transformedBusinesses)
          toast.success(`Found ${transformedBusinesses.length} ${subcategory.name.toLowerCase()}`)
          
          return
        }
      } catch (apiError) {
        console.warn('Backend API unavailable, using demo data:', apiError)

        // Fallback to demo data when API fails
        const demoBusinesses: Business[] = [
          {
            id: 'demo_1',
            name: 'The Garden Bistro',
            address: '123 Main St, New York, NY',
            rating: 4.5,
            totalReviews: 128,
            category: subcategory.name,
            hasWebsite: false,
            phone: '+1 (212) 555-0123',
            photoUrl: 'https://picsum.photos/seed/bistro1/400/300.jpg',
            opportunityScore: 85,
          },
          {
            id: 'demo_2',
            name: 'Sushi Paradise',
            address: '456 Oak Ave, New York, NY',
            rating: 4.2,
            totalReviews: 94,
            category: subcategory.name,
            hasWebsite: true,
            website: 'https://sushiparadise.com',
            phone: '+1 (212) 555-0456',
            photoUrl: 'https://picsum.photos/seed/sushi2/400/300.jpg',
            opportunityScore: 45,
          },
          {
            id: 'demo_3',
            name: 'Pasta House',
            address: '789 Pine St, New York, NY',
            rating: 4.7,
            totalReviews: 203,
            category: subcategory.name,
            hasWebsite: false,
            phone: '+1 (212) 555-0789',
            photoUrl: 'https://picsum.photos/seed/pasta3/400/300.jpg',
            opportunityScore: 78,
          },
          {
            id: 'demo_4',
            name: 'Burger Palace',
            address: '321 Elm St, New York, NY',
            rating: 4.1,
            totalReviews: 156,
            category: subcategory.name,
            hasWebsite: true,
            website: 'https://burgerpalace.com',
            phone: '+1 (212) 555-0321',
            photoUrl: 'https://picsum.photos/seed/burger4/400/300.jpg',
            opportunityScore: 52,
          },
          {
            id: 'demo_5',
            name: 'Cafe Corner',
            address: '654 Maple Dr, New York, NY',
            rating: 4.6,
            totalReviews: 87,
            category: subcategory.name,
            hasWebsite: false,
            phone: '+1 (212) 555-0654',
            photoUrl: 'https://picsum.photos/seed/cafe5/400/300.jpg',
            opportunityScore: 82,
          },
          {
            id: 'demo_6',
            name: 'Pizza Express',
            address: '987 Cedar Ln, New York, NY',
            rating: 4.3,
            totalReviews: 142,
            category: subcategory.name,
            hasWebsite: true,
            website: 'https://pizzaexpress.com',
            phone: '+1 (212) 555-0987',
            photoUrl: 'https://picsum.photos/seed/pizza6/400/300.jpg',
            opportunityScore: 58,
          }
        ]

        setBusinesses(demoBusinesses)
        toast.success(`Found ${demoBusinesses.length} demo ${subcategory.name.toLowerCase()} (Demo Mode)`)
        return
      }
      
    } catch (err) {
      console.error('Error fetching businesses:', err)
      setError('Failed to fetch businesses. Please try again.')
      toast.error('Failed to fetch businesses')
    } finally {
      setIsLoading(false)
    }
  }


  // Analyze business photos in background (silent, no loading state)
  const analyzeBusinessPhotosInBackground = async (business: Business) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://findworkai-backend-1.onrender.com/api/v1'
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
              {businesses.map((business) => {
                // Transform business data to match BusinessCard interface
                const businessForCard = {
                  ...business,
                  location: business.address // BusinessCard expects 'location' not 'address'
                }
                
                return (
                  <BusinessCard
                    key={business.id}
                    business={businessForCard}
                    onAnalyze={props.onAnalyze || ((b) => toast.info('Analysis not configured'))}
                    onBuildWebsite={props.onBuildWebsite || ((b) => toast.info('Website builder not configured'))}
                    onGenerateEmail={props.onGenerateEmail || ((b) => toast.info('Email generation not configured'))}
                    onGenerateSMS={props.onGenerateSMS || ((b) => toast.info('SMS generation not configured'))}
                    onAnalyzeWebsite={props.onAnalyzeWebsite || ((b) => {
                      if (b.website) {
                        window.open(b.website, '_blank')
                      } else {
                        toast.info('No website to view')
                      }
                    })}
                    isAnalyzing={analyzingBusinessId === business.id}
                    viewMode="grid"
                  />
                )
              })}
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
