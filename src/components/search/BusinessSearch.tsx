'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Search, Filter, MapPin, Star, Globe, Phone,
  Loader2, ChevronDown, Building2, TrendingUp,
  Users, Clock, ExternalLink, BookOpen, Tag,
  Rocket, Zap, Play, CheckCircle, Circle, AlertCircle,
  FileText
} from 'lucide-react'
import apiService from '@/services/api'
import toast from 'react-hot-toast'
import { useUserContentHistory } from '@/components/user/UserContentHistory'
import { GeneratedArtifact } from '@/lib/ai-agent'

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
  const [processingBusinesses, setProcessingBusinesses] = useState<Set<string>>(new Set())

  const { addArtifact } = useUserContentHistory()
  
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

  const generateWebsite = async (business: Business, type: 'website' | 'content' | 'marketing' = 'website') => {
    try {
      // Mark as processing
      setProcessingBusinesses(prev => new Set(prev).add(business.id))

      // Create a "processing" artifact immediately
      const processingArtifact: GeneratedArtifact = {
        id: `processing-${Date.now()}`,
        name: `${business.name} - ${type} Generation`,
        type,
        content: null,
        generatedAt: new Date(),
        metadata: {
          framework: 'HTML/CSS/JS',
          responsive: true,
          seoOptimized: true,
          businessName: business.name,
          businessCategory: business.category,
          generatedByAI: true,
          isProcessing: true,
          businessData: {
            name: business.name,
            category: business.category,
            location: `${business.city}, ${business.state}`,
            address: business.address,
            phone: business.phone,
            website: business.website,
            rating: business.rating,
            reviews: business.review_count,
            verified: business.verified,
            claimed: business.claimed
          }
        }
      }

      // Add to user content immediately so they see it in "My Content"
      addArtifact(business.id, processingArtifact)
      toast.success(`Started ${type} generation for ${business.name}! Check "Your Projects" tab.`)

      // Start the actual generation in background
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://findworkai-backend-1.onrender.com/api/v1'

      const businessInfo = {
        name: business.name,
        business_category: business.category,
        city: business.city,
        state: business.state,
        address: business.address,
        phone: business.phone,
        email: null,
        rating: business.rating,
        total_reviews: business.review_count,
        has_website: !!business.website
      }

      // Call the backend API
      const response = await fetch(`${backendUrl}/mcp-enhanced/generate-fast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          business_info: businessInfo,
          framework: 'html',
          style_preference: 'modern'
        })
      })

      let finalArtifact: GeneratedArtifact

      if (response.ok) {
        const data = await response.json()
        const aiContent = data.final_output || data.output || data.response || ''

        finalArtifact = {
          id: Date.now().toString(),
          name: `${business.name} - Professional ${type}`,
          type,
          content: aiContent,
          generatedAt: new Date(),
          metadata: {
            framework: 'HTML/CSS/JS',
            responsive: true,
            seoOptimized: true,
            businessName: business.name,
            businessCategory: business.category,
            generatedByAI: true,
            aiModel: data.model_used || 'AI Service',
            isProcessing: false,
            businessData: processingArtifact.metadata?.businessData
          }
        }
      } else {
        // Fallback content if API fails
        const fallbackContent = generateFallbackWebsite(business, type)
        finalArtifact = {
          id: Date.now().toString(),
          name: `${business.name} - ${type} (Template)`,
          type,
          content: fallbackContent,
          generatedAt: new Date(),
          metadata: {
            framework: 'HTML/CSS/JS',
            responsive: true,
            seoOptimized: true,
            businessName: business.name,
            businessCategory: business.category,
            generatedByAI: false,
            isTemplate: true,
            businessData: processingArtifact.metadata?.businessData
          }
        }
      }

      // Add the final artifact to replace the processing one
      addArtifact(business.id, finalArtifact)
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} ready! Check "Your Projects" to view.`)

    } catch (error) {
      console.error('Generation error:', error)
      toast.error(`Failed to generate ${type}. Try again later.`)

      // Add a failed artifact so user knows what happened
      const failedArtifact: GeneratedArtifact = {
        id: Date.now().toString(),
        name: `${business.name} - ${type} (Failed)`,
        type,
        content: generateErrorPage(business, type),
        generatedAt: new Date(),
        metadata: {
          framework: 'HTML/CSS/JS',
          responsive: true,
          seoOptimized: false,
          businessName: business.name,
          businessCategory: business.category,
          generatedByAI: false,
          hasError: true,
          businessData: {
            name: business.name,
            category: business.category,
            location: `${business.city}, ${business.state}`,
            address: business.address,
            phone: business.phone,
            website: business.website,
            rating: business.rating,
            reviews: business.review_count
          }
        }
      }

      addArtifact(business.id, failedArtifact)
    } finally {
      // Remove from processing
      setProcessingBusinesses(prev => {
        const newSet = new Set(prev)
        newSet.delete(business.id)
        return newSet
      })
    }
  }

  const generateFallbackWebsite = (business: Business, type: string): string => {
    const primaryColor = getBusinessColor(business.category)

    if (type === 'website') {
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${business.name} - Professional ${business.category}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .brand-gradient { background: linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}CC 100%); }
        .brand-color { color: ${primaryColor}; }
    </style>
</head>
<body class="font-sans antialiased">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="container mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold brand-color">${business.name}</h1>
                <nav class="hidden md:flex space-x-6">
                    <a href="#home" class="text-gray-700 hover:text-brand-color transition">Home</a>
                    <a href="#about" class="text-gray-700 hover:text-brand-color transition">About</a>
                    <a href="#contact" class="text-gray-700 hover:text-brand-color transition">Contact</a>
                </nav>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section id="home" class="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div class="container mx-auto px-4 text-center">
            <h2 class="text-5xl font-bold mb-6 text-gray-800">
                Welcome to ${business.name}
            </h2>
            <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Professional ${business.category} services in ${business.city}, ${business.state}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#contact" class="brand-gradient text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition">
                    Get Started
                </a>
                <a href="#about" class="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
                    Learn More
                </a>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-20 bg-white">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12">
                <h3 class="text-3xl font-bold mb-4">About ${business.name}</h3>
                <p class="text-gray-600 max-w-2xl mx-auto">
                    Trusted ${business.category} business serving ${business.city} with ${business.rating}⭐ service
                </p>
            </div>
            <div class="grid md:grid-cols-3 gap-8">
                <div class="text-center p-6 border rounded-lg">
                    <div class="w-12 h-12 brand-gradient rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <span class="text-white font-bold">⭐</span>
                    </div>
                    <h4 class="font-semibold mb-2">${business.rating} Star Rated</h4>
                    <p class="text-gray-600 text-sm">Excellence in service</p>
                </div>
                <div class="text-center p-6 border rounded-lg">
                    <div class="w-12 h-12 brand-gradient rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <span class="text-white font-bold">📍</span>
                    </div>
                    <h4 class="font-semibold mb-2">Local Business</h4>
                    <p class="text-gray-600 text-sm">Serving ${business.city}</p>
                </div>
                <div class="text-center p-6 border rounded-lg">
                    <div class="w-12 h-12 brand-gradient rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <span class="text-white font-bold">✓</span>
                    </div>
                    <h4 class="font-semibold mb-2">Quality Service</h4>
                    <p class="text-gray-600 text-sm">Professional guarantee</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20 bg-gray-50">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12">
                <h3 class="text-3xl font-bold mb-4">Get In Touch</h3>
                <p class="text-gray-600">Ready to get started? Contact us today!</p>
            </div>
            <div class="max-w-2xl mx-auto">
                <div class="bg-white p-8 rounded-lg shadow-md">
                    <div class="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h4 class="font-semibold mb-2">Location</h4>
                            <p class="text-gray-600">${business.address}</p>
                        </div>
                        ${business.phone ? `
                        <div>
                            <h4 class="font-semibold mb-2">Phone</h4>
                            <p class="text-gray-600">${business.phone}</p>
                        </div>` : ''}
                    </div>
                    <form class="space-y-4">
                        <div class="grid md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Your Name" class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-color">
                            <input type="email" placeholder="Your Email" class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-color">
                        </div>
                        <textarea placeholder="Your Message" rows="4" class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand-color"></textarea>
                        <button type="submit" class="w-full brand-gradient text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8">
        <div class="container mx-auto px-4 text-center">
            <h4 class="text-xl font-bold mb-2">${business.name}</h4>
            <p class="text-gray-400 mb-4">${business.category} • ${business.city}, ${business.state}</p>
            <p class="text-sm text-gray-500">© ${new Date().getFullYear()} ${business.name}. Created with FindWorkAI.</p>
        </div>
    </footer>

    <script>
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    </script>
</body>
</html>`
    } else if (type === 'content') {
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${business.name} - Content Package</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
        <header class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800">${business.name} Content Package</h1>
            <p class="text-gray-600">${business.category} • ${business.city}</p>
        </header>

        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 class="text-xl font-semibold mb-4">Business Description</h2>
            <p class="text-gray-700">
                ${business.name} is a professional ${business.category.toLowerCase()} business located in ${business.city}, ${business.state}.
                With a ${business.rating}-star rating, we are committed to providing exceptional service to our customers.
            </p>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 class="text-xl font-semibold mb-4">Services</h2>
            <ul class="list-disc list-inside space-y-2 text-gray-700">
                <li>Professional ${business.category.toLowerCase()} services</li>
                <li>Expert consultation and support</li>
                <li>Quality guarantee on all work</li>
                <li>Exceptional customer service</li>
            </ul>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold mb-4">Contact Information</h2>
            <p><strong>Address:</strong> ${business.address}</p>
            ${business.phone ? `<p><strong>Phone:</strong> ${business.phone}</p>` : ''}
            <p><strong>Rating:</strong> ${business.rating} stars</p>
        </div>
    </div>
</body>
</html>`
    } else {
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${business.name} - Marketing Campaign</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
        <header class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-800">${business.name} Marketing Campaign</h1>
            <p class="text-gray-600">${business.category} • ${business.city}</p>
        </header>

        <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 class="text-xl font-semibold mb-4">Campaign Overview</h2>
            <p class="text-gray-700">Complete marketing package for ${business.name}, featuring social media content, email campaigns, and promotional materials.</p>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="text-lg font-semibold mb-3">Social Media Posts</h3>
                <div class="space-y-2 text-sm text-gray-700">
                    <p>🌟 Professional ${business.category.toLowerCase()} services</p>
                    <p>📍 Located in ${business.city}</p>
                    <p>⭐ ${business.rating}-star rated business</p>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="text-lg font-semibold mb-3">Email Campaign</h3>
                <div class="space-y-2 text-sm text-gray-700">
                    <p>Welcome emails for new customers</p>
                    <p>Promotional offers and discounts</p>
                    <p>Follow-up and feedback requests</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`
    }
  }

  const generateErrorPage = (business: Business, type: string): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${business.name} - Generation Issue</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center">
    <div class="max-w-2xl mx-auto p-8">
        <div class="bg-white rounded-lg shadow-lg p-8 text-center">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">⚠️</span>
            </div>
            <h1 class="text-2xl font-bold text-gray-800 mb-4">Generation Issue</h1>
            <p class="text-gray-600 mb-6">
                There was an issue generating the ${type} for ${business.name}.
                This might be due to high demand or a temporary service issue.
            </p>
            <div class="bg-gray-50 rounded-lg p-4 text-left">
                <h3 class="font-semibold mb-2">Business Details:</h3>
                <p><strong>Name:</strong> ${business.name}</p>
                <p><strong>Category:</strong> ${business.category}</p>
                <p><strong>Location:</strong> ${business.city}, ${business.state}</p>
                <p><strong>Rating:</strong> ${business.rating} stars</p>
            </div>
            <button onclick="window.location.reload()" class="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Try Again
            </button>
        </div>
    </div>
</body>
</html>`
  }

  const getBusinessColor = (category: string): string => {
    const colors: Record<string, string> = {
      'restaurant': '#dc2626',
      'healthcare': '#059669',
      'medical': '#059669',
      'law': '#1d4ed8',
      'legal': '#1d4ed8',
      'auto': '#ea580c',
      'automotive': '#ea580c',
      'beauty': '#c026d3',
      'fitness': '#16a34a',
      'retail': '#7c3aed',
      'real estate': '#0891b2',
      'education': '#0ea5e9',
      'tech': '#4f46e5',
      'technology': '#4f46e5'
    }
    return colors[category.toLowerCase()] || '#4f46e5'
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

                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs text-gray-500">
                      Updated: {new Date(business.last_updated).toLocaleDateString()}
                    </p>
                  </div>

                  {/* New Generation Buttons */}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          generateWebsite(business, 'website')
                        }}
                        disabled={processingBusinesses.has(business.id)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                          processingBusinesses.has(business.id)
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg'
                        }`}
                      >
                        {processingBusinesses.has(business.id) ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Building...
                          </>
                        ) : (
                          <>
                            <Rocket className="h-4 w-4" />
                            Build Website
                          </>
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          generateWebsite(business, 'content')
                        }}
                        disabled={processingBusinesses.has(business.id)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                          processingBusinesses.has(business.id)
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg'
                        }`}
                      >
                        {processingBusinesses.has(business.id) ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4" />
                            Content
                          </>
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          generateWebsite(business, 'marketing')
                        }}
                        disabled={processingBusinesses.has(business.id)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                          processingBusinesses.has(business.id)
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700 shadow-md hover:shadow-lg'
                        }`}
                      >
                        {processingBusinesses.has(business.id) ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <TrendingUp className="h-4 w-4" />
                            Marketing
                          </>
                        )}
                      </motion.button>
                    </div>

                    {processingBusinesses.has(business.id) && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
                        <p className="text-xs text-blue-700 flex items-center justify-center gap-1">
                          <Zap className="h-3 w-3" />
                          Generating content... Check "Your Projects" tab to see progress!
                        </p>
                      </div>
                    )}
                  </div>
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
