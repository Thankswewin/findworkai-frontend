'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { debounce } from 'lodash'
import { 
  Search, Filter, MapPin, Star, CheckCircle, Clock, 
  ChevronDown, X, Loader2, AlertCircle, Building2,
  TrendingUp, Users, Calendar
} from 'lucide-react'
import { format } from 'date-fns'

import BusinessCard from '@/components/search/BusinessCard'
import FilterPanel from '@/components/search/FilterPanel'
import SearchBar from '@/components/search/SearchBar'
import SortDropdown from '@/components/search/SortDropdown'
import LoadingSkeleton from '@/components/search/LoadingSkeleton'
import EmptyState from '@/components/search/EmptyState'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { searchBusinesses } from '@/services/business-search'

// Types
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
  sort_by?: 'rating' | 'reviews' | 'distance' | 'relevance'
  order?: 'asc' | 'desc'
  page?: number
  page_size?: number
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
  business_hours?: any
  latitude?: number
  longitude?: number
  distance_km?: number
}

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  // State
  const [filters, setFilters] = useState<SearchFilters>(() => {
    // Initialize filters from URL params
    const initial: SearchFilters = {
      q: searchParams.get('q') || '',
      categories: searchParams.getAll('categories'),
      rating_min: searchParams.get('rating_min') ? Number(searchParams.get('rating_min')) : undefined,
      rating_max: searchParams.get('rating_max') ? Number(searchParams.get('rating_max')) : undefined,
      review_count_min: searchParams.get('review_count_min') ? Number(searchParams.get('review_count_min')) : undefined,
      review_count_max: searchParams.get('review_count_max') ? Number(searchParams.get('review_count_max')) : undefined,
      verified: searchParams.get('verified') === 'true',
      open_now: searchParams.get('open_now') === 'true',
      open_at: searchParams.get('open_at') || undefined,
      sort_by: (searchParams.get('sort_by') as any) || 'relevance',
      order: (searchParams.get('order') as any) || 'desc',
      page: Number(searchParams.get('page')) || 1,
      page_size: Number(searchParams.get('page_size')) || 20,
    }
    return initial
  })
  
  const [showFilters, setShowFilters] = useState(false)
  const [selectedBusinesses, setSelectedBusinesses] = useState<Set<number>>(new Set())
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)

  // Fetch user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log('Location access denied:', error)
        }
      )
    }
  }, [])

  // Update URL when filters change
  const updateURL = useCallback((newFilters: SearchFilters) => {
    const params = new URLSearchParams()
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v))
        } else {
          params.set(key, String(value))
        }
      }
    })
    
    router.push(`/search?${params.toString()}`, { scroll: false })
  }, [router])

  // Debounced search
  const debouncedUpdateURL = useCallback(
    debounce((newFilters: SearchFilters) => {
      updateURL(newFilters)
    }, 500),
    [updateURL]
  )

  // Query for businesses
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['businesses', filters],
    queryFn: () => searchBusinesses({
      ...filters,
      latitude: userLocation?.lat,
      longitude: userLocation?.lng,
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 }
    setFilters(newFilters)
    
    if (key === 'q') {
      debouncedUpdateURL(newFilters)
    } else {
      updateURL(newFilters)
    }
  }

  // Handle multiple filter changes at once
  const handleMultipleFilterChanges = (changes: Partial<SearchFilters>) => {
    const newFilters = { ...filters, ...changes, page: 1 }
    setFilters(newFilters)
    updateURL(newFilters)
  }

  // Reset filters
  const resetFilters = () => {
    const newFilters: SearchFilters = {
      q: '',
      sort_by: 'relevance',
      order: 'desc',
      page: 1,
      page_size: 20,
    }
    setFilters(newFilters)
    updateURL(newFilters)
  }

  // Handle business selection
  const toggleBusinessSelection = (businessId: number) => {
    const newSelection = new Set(selectedBusinesses)
    if (newSelection.has(businessId)) {
      newSelection.delete(businessId)
    } else {
      newSelection.add(businessId)
    }
    setSelectedBusinesses(newSelection)
  }

  // Handle bulk actions
  const handleBulkAnalysis = async () => {
    if (selectedBusinesses.size === 0) {
      toast({
        title: "No businesses selected",
        description: "Please select at least one business to analyze",
        variant: "destructive"
      })
      return
    }

    // Navigate to analysis page with selected businesses
    const ids = Array.from(selectedBusinesses).join(',')
    router.push(`/analysis?businesses=${ids}`)
  }

  // Calculate active filter count
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'q' || key === 'sort_by' || key === 'order' || key === 'page' || key === 'page_size') return false
    if (Array.isArray(value)) return value.length > 0
    return value !== undefined && value !== null && value !== false
  }).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4">
            {/* Search Bar Row */}
            <div className="flex gap-2">
              <SearchBar
                value={filters.q || ''}
                onChange={(value) => handleFilterChange('q', value)}
                placeholder="Search businesses by name, location, or category..."
                className="flex-1"
              />
              
              {/* Filter Toggle Button */}
              <Button
                variant={activeFilterCount > 0 ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge 
                    className="ml-2 bg-primary-600 text-white"
                    variant="secondary"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>

              {/* Sort Dropdown */}
              <SortDropdown
                value={filters.sort_by || 'relevance'}
                order={filters.order || 'desc'}
                onChange={(sortBy, order) => {
                  handleMultipleFilterChanges({ sort_by: sortBy, order })
                }}
              />
            </div>

            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500">Active filters:</span>
                
                {filters.categories && filters.categories.length > 0 && (
                  filters.categories.map(cat => (
                    <Badge key={cat} variant="secondary" className="gap-1">
                      {cat}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => {
                          handleFilterChange('categories', 
                            filters.categories?.filter(c => c !== cat)
                          )
                        }}
                      />
                    </Badge>
                  ))
                )}
                
                {filters.verified && (
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified Only
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange('verified', false)}
                    />
                  </Badge>
                )}
                
                {filters.open_now && (
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="h-3 w-3" />
                    Open Now
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => handleFilterChange('open_now', false)}
                    />
                  </Badge>
                )}
                
                {(filters.rating_min || filters.rating_max) && (
                  <Badge variant="secondary" className="gap-1">
                    <Star className="h-3 w-3" />
                    Rating: {filters.rating_min || 0}-{filters.rating_max || 5}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => {
                        handleMultipleFilterChanges({ 
                          rating_min: undefined, 
                          rating_max: undefined 
                        })
                      }}
                    />
                  </Badge>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onMultipleChanges={handleMultipleFilterChanges}
                onReset={resetFilters}
              />
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                {data && (
                  <p className="text-gray-600">
                    Found <span className="font-semibold">{data.total_count}</span> businesses
                    {filters.q && (
                      <> for "<span className="font-semibold">{filters.q}</span>"</>
                    )}
                  </p>
                )}
              </div>
              
              {selectedBusinesses.size > 0 && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedBusinesses(new Set())}
                  >
                    Clear Selection ({selectedBusinesses.size})
                  </Button>
                  <Button onClick={handleBulkAnalysis}>
                    Analyze Selected
                  </Button>
                </div>
              )}
            </div>

            {/* Loading State */}
            {isLoading && <LoadingSkeleton count={5} />}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">Error loading businesses</p>
                  <p className="text-sm text-red-700">{error.message}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => refetch()}
                  className="ml-auto"
                >
                  Retry
                </Button>
              </div>
            )}

            {/* Results Grid */}
            {data && !isLoading && !error && (
              <>
                {data.businesses.length === 0 ? (
                  <EmptyState 
                    onReset={resetFilters}
                    hasFilters={activeFilterCount > 0}
                  />
                ) : (
                  <>
                    <div className="grid gap-4">
                      {data.businesses.map((business: Business) => (
                        <BusinessCard
                          key={business.id}
                          business={business}
                          selected={selectedBusinesses.has(business.id)}
                          onSelect={() => toggleBusinessSelection(business.id)}
                          showDistance={userLocation !== null}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {data.total_pages > 1 && (
                      <div className="mt-8 flex justify-center gap-2">
                        <Button
                          variant="outline"
                          disabled={filters.page === 1}
                          onClick={() => handleFilterChange('page', (filters.page || 1) - 1)}
                        >
                          Previous
                        </Button>
                        
                        <div className="flex items-center gap-2">
                          {Array.from({ length: Math.min(5, data.total_pages) }, (_, i) => {
                            const page = i + 1
                            return (
                              <Button
                                key={page}
                                variant={page === filters.page ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleFilterChange('page', page)}
                              >
                                {page}
                              </Button>
                            )
                          })}
                          
                          {data.total_pages > 5 && (
                            <>
                              <span>...</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleFilterChange('page', data.total_pages)}
                              >
                                {data.total_pages}
                              </Button>
                            </>
                          )}
                        </div>
                        
                        <Button
                          variant="outline"
                          disabled={filters.page === data.total_pages}
                          onClick={() => handleFilterChange('page', (filters.page || 1) + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSkeleton count={5} />}>
      <SearchContent />
    </Suspense>
  )
}
