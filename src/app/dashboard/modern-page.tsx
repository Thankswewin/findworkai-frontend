'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, TrendingUp, Mail, Users, MapPin, BarChart3, Target, AlertCircle,
  Star, Globe, Sparkles, Zap, ChevronRight, Building2, Phone, Clock,
  CheckCircle, XCircle, ArrowUpRight, Loader2, Bot, Rocket, Brain,
  Send, Calendar, DollarSign, Activity
} from 'lucide-react'
import { useBusinessStore } from '@/store/business-store'

// Import all new components
import CampaignManager from '@/components/campaigns/CampaignManager'
import LeadScoring from '@/components/leads/LeadScoring'
import AIAnalysis from '@/components/analysis/AIAnalysis'
import BusinessSearch from '@/components/search/BusinessSearch'
import FollowUpManager from '@/components/followup/FollowUpManager'
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard'

// Animated background component
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-30"
            style={{
              background: `radial-gradient(circle, ${
                ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#EF4444'][i]
              } 0%, transparent 70%)`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            initial={{
              width: `${Math.random() * 400 + 200}px`,
              height: `${Math.random() * 400 + 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// 3D Card component with hover effects
function Card3D({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / 25
    const y = (e.clientY - rect.top - rect.height / 2) / 25
    setMousePosition({ x, y })
  }

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setMousePosition({ x: 0, y: 0 })
      }}
      style={{
        transformStyle: "preserve-3d",
        transform: isHovered
          ? `perspective(1000px) rotateX(${-mousePosition.y}deg) rotateY(${mousePosition.x}deg)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg)",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20">
        {children}
      </div>
      {isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  )
}

// Modern search bar with suggestions
function ModernSearchBar({ onSearch, isLoading }: any) {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const suggestions = {
    queries: ['restaurants', 'hotels', 'gyms', 'salons', 'clinics', 'schools', 'cafes', 'shops'],
    locations: ['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Kaduna', 'Benin City', 'New York', 'London', 'Dubai']
  }

  const handleSearch = () => {
    if (query && location) {
      onSearch(query, location)
      setShowSuggestions(false)
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.search-container')) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative search-container">
      <motion.div
        className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/20"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="What businesses are you looking for?"
              className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex-1 relative">
            <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Enter city or address"
              className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <motion.button
            onClick={handleSearch}
            disabled={isLoading || !query || !location}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <span>Discover</span>
              </div>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 p-4 z-50"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Popular Searches</p>
                <div className="space-y-1">
                  {suggestions.queries.map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setQuery(q)
                        setShowSuggestions(false)
                      }}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Popular Locations</p>
                <div className="space-y-1">
                  {suggestions.locations.map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLocation(l)
                        setShowSuggestions(false)
                      }}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Modern stats card with animation
function ModernStatsCard({ title, value, icon, trend, color }: any) {
  return (
    <Card3D>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
            {icon}
          </div>
          {trend && (
            <span className="text-sm font-medium text-green-600 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {trend}
            </span>
          )}
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {value}
          </p>
        </motion.div>
        <p className="text-sm text-gray-600 mt-1">{title}</p>
      </div>
    </Card3D>
  )
}

// Modern business card with glassmorphism
function ModernBusinessCard({ business, onAnalyze, onGenerateEmail, isAnalyzing, isGenerating }: any) {
  const getOpportunityColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500'
    if (score >= 60) return 'from-yellow-500 to-orange-500'
    return 'from-gray-500 to-gray-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden group"
    >
      {/* Gradient Header */}
      <div className={`h-2 bg-gradient-to-r ${getOpportunityColor(business.opportunityScore)}`} />
      
      <div className="p-6">
        {/* Business Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-600" />
              {business.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {business.location}
            </p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getOpportunityColor(business.opportunityScore)} text-white`}>
              <Zap className="h-3 w-3 mr-1" />
              {business.opportunityScore}% Opportunity
            </div>
          </div>
        </div>

        {/* Business Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50/50 rounded-xl">
            <div className="flex items-center justify-center text-yellow-500 mb-1">
              <Star className="h-5 w-5 fill-current" />
            </div>
            <p className="text-sm font-semibold">{business.rating}</p>
            <p className="text-xs text-gray-500">Rating</p>
          </div>
          <div className="text-center p-3 bg-gray-50/50 rounded-xl">
            <div className="flex items-center justify-center mb-1">
              {business.hasWebsite ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <p className="text-sm font-semibold">{business.hasWebsite ? 'Yes' : 'No'}</p>
            <p className="text-xs text-gray-500">Website</p>
          </div>
          <div className="text-center p-3 bg-gray-50/50 rounded-xl">
            <div className="flex items-center justify-center text-blue-500 mb-1">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold">{business.totalReviews}</p>
            <p className="text-xs text-gray-500">Reviews</p>
          </div>
        </div>

        {/* Issues Preview */}
        {business.weaknesses && business.weaknesses.length > 0 && (
          <div className="mb-4 p-3 bg-orange-50/50 rounded-xl border border-orange-200/50">
            <p className="text-xs font-medium text-orange-800 mb-1">Key Issues Detected:</p>
            <p className="text-xs text-orange-600">
              {business.weaknesses.slice(0, 2).join(' • ')}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <motion.button
            onClick={() => onAnalyze(business)}
            disabled={isAnalyzing}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium text-sm shadow-lg hover:shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Bot className="h-4 w-4" />
                Analyze
              </>
            )}
          </motion.button>
          
          <motion.button
            onClick={() => onGenerateEmail(business)}
            disabled={isGenerating}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium text-sm shadow-lg hover:shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Email
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function ModernDashboard() {
  const { businesses, stats, fetchBusinesses, searchBusinesses } = useBusinessStore()
  const [isLoading, setIsLoading] = useState(false)
  const [analyzingId, setAnalyzingId] = useState<string | null>(null)
  const [generatingId, setGeneratingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [showQuickActions, setShowQuickActions] = useState(false)

  useEffect(() => {
    fetchBusinesses()
  }, [])

  const handleSearch = async (query: string, location: string) => {
    setIsLoading(true)
    try {
      await searchBusinesses(query, location)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalyze = async (business: any) => {
    setAnalyzingId(business.id)
    try {
      // Call the analysis API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://findworkai-backend.onrender.com/api/v1'
      const response = await fetch(`${apiUrl}/demo/analyze-business`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: business.name,
          business_category: business.category,
          city: business.location.split(',')[0],
          state: business.location.split(',')[1]?.trim() || '',
          rating: business.rating,
          total_reviews: business.totalReviews,
          has_website: business.hasWebsite,
          website: null
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert(`Analysis Complete!\n\nOpportunity Score: ${result.opportunity_score}%\nWeaknesses: ${result.weaknesses_count}\nOpportunities: ${result.opportunities_count}\n\nCheck the business card for updated score!`)
      }
    } catch (error) {
      alert('Analysis failed. Please try again.')
    } finally {
      setAnalyzingId(null)
    }
  }

  const handleGenerateEmail = async (business: any) => {
    setGeneratingId(business.id)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://findworkai-backend.onrender.com/api/v1'
      const response = await fetch(`${apiUrl}/demo/generate-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          business_name: business.name,
          service_type: 'website_design',
          weaknesses: business.weaknesses || [],
          opportunities: [],
          rating: business.rating
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert(`Email Generated!\n\nSubject: ${result.email.subject}\n\n${result.email.body}`)
      }
    } catch (error) {
      alert('Email generation failed. Please try again.')
    } finally {
      setGeneratingId(null)
    }
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Modern Header */}
      <header className="relative z-10 bg-white/70 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <motion.div
                className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Rocket className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SmartLeads AI
                </h1>
                <p className="text-xs text-gray-600">Discover • Analyze • Convert</p>
              </div>
            </div>
            
            <nav className="flex items-center gap-4">
              {[
                { name: 'Dashboard', icon: <Activity className="h-4 w-4" /> },
                { name: 'Search', icon: <Search className="h-4 w-4" /> },
                { name: 'Leads', icon: <Target className="h-4 w-4" /> },
                { name: 'Campaigns', icon: <Send className="h-4 w-4" /> },
                { name: 'Analysis', icon: <Brain className="h-4 w-4" /> },
                { name: 'Follow-ups', icon: <Calendar className="h-4 w-4" /> },
                { name: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> }
              ].map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === item.name 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </motion.button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'Dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Search Section */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Discover New Opportunities</h2>
                <p className="text-gray-600 mb-6">Find businesses that need your services</p>
                <ModernSearchBar onSearch={handleSearch} isLoading={isLoading} />
              </div>

              {/* Quick Actions */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('Search')}
                    className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg"
                  >
                    <Search className="h-8 w-8 mb-2" />
                    <p className="font-medium">Find Businesses</p>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('Leads')}
                    className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg"
                  >
                    <Target className="h-8 w-8 mb-2" />
                    <p className="font-medium">Score Leads</p>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('Campaigns')}
                    className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg"
                  >
                    <Send className="h-8 w-8 mb-2" />
                    <p className="font-medium">Launch Campaign</p>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('Analytics')}
                    className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-lg"
                  >
                    <BarChart3 className="h-8 w-8 mb-2" />
                    <p className="font-medium">View Analytics</p>
                  </motion.button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <ModernStatsCard
                  title="Total Businesses"
                  value={stats?.totalBusinesses || 0}
                  icon={<Building2 className="h-6 w-6 text-white" />}
                  trend="+12%"
                  color="from-blue-500 to-blue-600"
                />
                <ModernStatsCard
                  title="No Website"
                  value={stats?.noWebsiteCount || 0}
                  icon={<Globe className="h-6 w-6 text-white" />}
                  trend={`${stats?.noWebsitePercentage || 0}%`}
                  color="from-orange-500 to-red-500"
                />
                <ModernStatsCard
                  title="Low Rating"
                  value={stats?.lowRatingCount || 0}
                  icon={<Star className="h-6 w-6 text-white" />}
                  trend="High opportunity"
                  color="from-yellow-500 to-orange-500"
                />
                <ModernStatsCard
                  title="Emails Sent"
                  value={stats?.emailsSent || 0}
                  icon={<Mail className="h-6 w-6 text-white" />}
                  trend="+5 today"
                  color="from-purple-500 to-pink-500"
                />
              </div>

              {/* Business Grid */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Discoveries</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {businesses.map((business) => (
                    <ModernBusinessCard
                      key={business.id}
                      business={business}
                      onAnalyze={handleAnalyze}
                      onGenerateEmail={handleGenerateEmail}
                      isAnalyzing={analyzingId === business.id}
                      isGenerating={generatingId === business.id}
                    />
                  ))}
                </div>
                
                {businesses.length === 0 && (
                  <Card3D className="col-span-full">
                    <div className="p-12 text-center">
                      <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No businesses found</h3>
                      <p className="text-gray-600">Try searching for businesses in your area to get started</p>
                    </div>
                  </Card3D>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'Search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <BusinessSearch />
            </motion.div>
          )}

          {activeTab === 'Leads' && (
            <motion.div
              key="leads"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <LeadScoring />
            </motion.div>
          )}

          {activeTab === 'Campaigns' && (
            <motion.div
              key="campaigns"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CampaignManager />
            </motion.div>
          )}

          {activeTab === 'Analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AIAnalysis />
            </motion.div>
          )}

          {activeTab === 'Follow-ups' && (
            <motion.div
              key="followups"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <FollowUpManager />
            </motion.div>
          )}

          {activeTab === 'Analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AnalyticsDashboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
