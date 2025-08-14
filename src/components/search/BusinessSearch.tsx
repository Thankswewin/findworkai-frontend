'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, Filter, MapPin, Star, Globe, Phone,
  Loader2, ChevronDown, Building2, TrendingUp,
  Users, Clock, ExternalLink, BookOpen, Tag
} from 'lucide-react'
import apiService from '@/services/api'
import toast from 'react-hot-toast'

interface Business {
  id: string
  name: string
  category: string
  rating: number
  review_count: number
  phone?: string
  website?: string
  address: string
  city: string
  state: string
  hours?: string
  price_range?: string
  claimed: boolean
  verified: boolean
  opportunity_score?: number
  last_updated: string
}

interface SearchFilters {
  min_rating?: number
  max_rating?: number
  min_reviews?: number
  has_website?: boolean
  categories?: string[]
  cities?: string[]
  verified_only?: boolean
}

export default function BusinessSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  
  const [filters, setFilters] = useState<SearchFilters>({
    min_rating: 0,
    max_rating: 5,
    min_reviews: 0,
    has_website: undefined,
    categories: [],
    cities: [],
    verified_only: false
  })

  const [categories] = useState([
    'Restaurant', 'Retail', 'Healthcare', 'Professional Services',
    'Home Services', 'Automotive', 'Beauty & Spa', 'Fitness',
    'Real Estate', 'Financial Services', 'Technology', 'Education'
  ])

  const searchBusinesses = async () => {
    try {
      setLoading(true)
      const response = await apiService.searchBusinesses(
        searchQuery,
        filters.cities?.[0] || '',
        5000 // default radius
      )
      
      setBusinesses(response.businesses || [])
      setTotalResults(response.total || 0)
      toast.success(`Found ${response.total || 0} businesses`)
    } catch (error) {
      toast.error('Failed to search businesses')
      console.error('Error searching businesses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    searchBusinesses()
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-500 fill-yellow-500' 
            : 'text-gray-300'
        }`}
      />
    ))
  }

  const getOpportunityColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-600'
    if (score >= 70) return 'bg-red-100 text-red-600'
    if (score >= 40) return 'bg-yellow-100 text-yellow-600'
    return 'bg-green-100 text-green-600'
  }

  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Business Search</h2>
        <p className="text-white/90 mb-6">
          Search and discover businesses with advanced filtering and AI-powered insights
        </p>
        
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search businesses by name, category, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900 bg-white/95 placeholder-gray-500"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-white/20 backdrop-blur text-white rounded-lg font-medium hover:bg-white/30 flex items-center gap-2"
          >
            <Filter className="h-5 w-5" />
            Filters
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-white/90 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
            Search
          </motion.button>
        </form>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="font-semibold text-gray-900 mb-4">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating Range
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.min_rating}
                  onChange={(e) => setFilters({...filters, min_rating: parseFloat(e.target.value)})}
                  className="w-20 px-2 py-1 border border-gray-300 rounded"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.max_rating}
                  onChange={(e) => setFilters({...filters, max_rating: parseFloat(e.target.value)})}
                  className="w-20 px-2 py-1 border border-gray-300 rounded"
                />
              </div>
            </div>

            {/* Reviews Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Reviews
              </label>
              <input
                type="number"
                min="0"
                value={filters.min_reviews}
                onChange={(e) => setFilters({...filters, min_reviews: parseInt(e.target.value)})}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Website Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website Status
              </label>
              <select
                value={filters.has_website === undefined ? '' : filters.has_website.toString()}
                onChange={(e) => setFilters({...filters, has_website: e.target.value === '' ? undefined : e.target.value === 'true'})}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg"
              >
                <option value="">All</option>
                <option value="true">Has Website</option>
                <option value="false">No Website</option>
              </select>
            </div>

            {/* Verified Only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.verified_only}
                  onChange={(e) => setFilters({...filters, verified_only: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Verified Only</span>
              </label>
            </div>
          </div>

          {/* Categories */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const newCategories = filters.categories?.includes(category)
                      ? filters.categories.filter(c => c !== category)
                      : [...(filters.categories || []), category]
                    setFilters({...filters, categories: newCategories})
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filters.categories?.includes(category)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Results Stats */}
      {totalResults > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing {businesses.length} of {totalResults} results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
              Page {page}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={businesses.length < 20}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Business List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 bg-white rounded-xl p-12 text-center shadow-lg">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
            <p className="mt-2 text-gray-600">Searching businesses...</p>
          </div>
        ) : businesses.length === 0 ? (
          <div className="col-span-2 bg-white rounded-xl p-12 text-center shadow-lg">
            <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No businesses found</p>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          businesses.map((business) => (
            <motion.div
              key={business.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 cursor-pointer"
              onClick={() => setSelectedBusiness(business)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{business.name}</h3>
                    {business.verified && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                        Verified
                      </span>
                    )}
                    {business.claimed && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                        Claimed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      {business.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {business.city}, {business.state}
                    </span>
                  </div>
                </div>
                {business.opportunity_score && (
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getOpportunityColor(business.opportunity_score)}`}>
                    {business.opportunity_score}% Opportunity
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex">{getRatingStars(business.rating)}</div>
                  <span className="text-sm font-medium text-gray-700">{business.rating}</span>
                  <span className="text-sm text-gray-500">({business.review_count} reviews)</span>
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  {business.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {business.phone}
                    </span>
                  )}
                  {business.website && (
                    <span className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      Website
                    </span>
                  )}
                  {business.hours && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {business.hours}
                    </span>
                  )}
                  {business.price_range && (
                    <span className="font-medium">{business.price_range}</span>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    Updated: {new Date(business.last_updated).toLocaleDateString()}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      // Add to campaign or analyze
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Analyze
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Business Detail Modal */}
      {selectedBusiness && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedBusiness.name}</h3>
                  <p className="text-gray-600">{selectedBusiness.category}</p>
                </div>
                <button
                  onClick={() => setSelectedBusiness(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{selectedBusiness.address}</p>
                  <p className="text-sm">{selectedBusiness.city}, {selectedBusiness.state}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact</p>
                  {selectedBusiness.phone && <p className="font-medium">{selectedBusiness.phone}</p>}
                  {selectedBusiness.website && (
                    <a href={selectedBusiness.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                      Visit Website <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add to Campaign
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Run AI Analysis
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
