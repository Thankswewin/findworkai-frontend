'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Building2, TrendingUp, Mail, Star, Globe,
  Activity, Target, Send, Calendar, BarChart3, Brain,
  Rocket, Loader2, Plus, History, BookmarkCheck,
  ChevronRight, X, Info
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import toast from 'react-hot-toast'

// Import our new components
import { AnalysisResults } from '@/components/analysis/AnalysisResults'
import { SearchHistory } from '@/components/analysis/SearchHistory'
import { AnalyzedBusinesses } from '@/components/analysis/AnalyzedBusinesses'
import { HubSpotSettings } from '@/components/integrations/HubSpotSettings'
import { AIAgentDashboard } from '@/components/ai-agent/AIAgentDashboard'
import { BusinessAIAgentBuilder } from '@/components/ai-agent/BusinessAIAgentBuilder'
import ModernSearchBar from '@/components/search/modern-search-bar'
import ModernBusinessCard from '@/components/modern-business-card'
import ModernStatsCard from '@/components/modern-stats-card'
import AnimatedBackground from '@/components/animated-background'
import { searchBusinesses } from '@/lib/google-places'
import { hubspotService } from '@/services/hubspot'

// Local storage keys
const STORAGE_KEYS = {
  SEARCH_HISTORY: 'findworkai_search_history',
  ANALYZED_BUSINESSES: 'findworkai_analyzed_businesses',
  USER_PREFERENCES: 'findworkai_user_preferences',
  ONBOARDING_COMPLETED: 'findworkai_onboarding_completed'
}

// Helper functions for localStorage
const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  },
  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  },
  remove: (key: string) => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  }
}

export default function EnhancedDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [businesses, setBusinesses] = useState<any[]>([])
  const [searchHistory, setSearchHistory] = useState<any[]>([])
  const [analyzedBusinesses, setAnalyzedBusinesses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [analyzingId, setAnalyzingId] = useState<string | null>(null)
  const [showAnalysisResults, setShowAnalysisResults] = useState(false)
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [selectedBusinessForAgent, setSelectedBusinessForAgent] = useState<any>(null)
  const [showAIAgent, setShowAIAgent] = useState(false)
  const [aiAgentType, setAIAgentType] = useState<'website' | 'content' | 'marketing'>('website')
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    noWebsiteCount: 0,
    noWebsitePercentage: 0,
    lowRatingCount: 0,
    emailsSent: 0,
    totalAnalyzed: 0,
    conversionRate: 0
  })

  // Load persisted data on mount
  useEffect(() => {
    const history = storage.get(STORAGE_KEYS.SEARCH_HISTORY) || []
    const analyzed = storage.get(STORAGE_KEYS.ANALYZED_BUSINESSES) || []
    const onboardingCompleted = storage.get(STORAGE_KEYS.ONBOARDING_COMPLETED)
    
    setSearchHistory(history.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp)
    })))
    
    setAnalyzedBusinesses(analyzed.map((item: any) => ({
      ...item,
      analyzedAt: new Date(item.analyzedAt),
      lastUpdated: new Date(item.lastUpdated)
    })))
    
    // Show onboarding if not completed
    if (!onboardingCompleted) {
      setShowOnboarding(true)
    }
    
    // Calculate stats
    updateStats(history, analyzed)
  }, [])

  // Update stats
  const updateStats = (history: any[], analyzed: any[]) => {
    const totalBusinesses = history.reduce((acc: number, item: any) => acc + (item.resultsCount || 0), 0)
    const totalAnalyzed = analyzed.length
    const converted = analyzed.filter((b: any) => b.status === 'converted').length
    const conversionRate = totalAnalyzed > 0 ? Math.round((converted / totalAnalyzed) * 100) : 0
    
    setStats({
      totalBusinesses,
      noWebsiteCount: analyzed.filter((b: any) => !b.digitalPresence?.website).length,
      noWebsitePercentage: Math.round((analyzed.filter((b: any) => !b.digitalPresence?.website).length / Math.max(totalAnalyzed, 1)) * 100),
      lowRatingCount: analyzed.filter((b: any) => (b.rating || 0) < 3.5).length,
      emailsSent: analyzed.filter((b: any) => b.status === 'contacted' || b.status === 'converted').length,
      totalAnalyzed,
      conversionRate
    })
  }

  // Enhanced search handler with history tracking
  const handleSearch = async (query: string, location: string) => {
    setIsLoading(true)
    const searchId = Date.now().toString()
    
    try {
      const results = await searchBusinesses(query, location)
      setBusinesses(results)
      
      // Create search history entry
      const historyEntry = {
        id: searchId,
        query,
        location,
        category: query,
        resultsCount: results.length,
        timestamp: new Date(),
        status: 'completed' as const,
        avgOpportunityScore: 0,
        businesses: results.map((b: any) => ({
          id: b.id,
          name: b.name,
          opportunityScore: 0,
          analyzed: false
        }))
      }
      
      // Update search history
      const updatedHistory = [historyEntry, ...searchHistory].slice(0, 50) // Keep last 50 searches
      setSearchHistory(updatedHistory)
      storage.set(STORAGE_KEYS.SEARCH_HISTORY, updatedHistory)
      
      toast.success(`Found ${results.length} businesses in ${location}`)
    } catch (error) {
      toast.error('Search failed. Please try again.')
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Enhanced analyze handler with proper results display
  const handleAnalyze = async (business: any) => {
    setAnalyzingId(business.id)
    
    try {
      // Parse location safely
      const locationParts = business.location ? business.location.split(',') : ['', '']
      const city = locationParts[0]?.trim() || 'Unknown'
      const state = locationParts[1]?.trim() || ''
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://findworkai-backend.onrender.com/api/v1'
      const response = await fetch(`${apiUrl}/demo/analyze-business`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: business.name,
          business_category: business.category || 'General',
          city: city,
          state: state,
          rating: business.rating || 0,
          total_reviews: business.totalReviews || 0,
          has_website: business.hasWebsite || false,
          website: business.website || ''
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Prepare analysis data for display
        const analysisData = {
          business: {
            id: business.id,
            name: business.name,
            category: business.category,
            address: business.location,
            phone: business.phone,
            website: business.website,
            email: business.email,
            rating: business.rating,
            reviews: business.totalReviews
          },
          analysis: {
            opportunityScore: result.opportunity_score,
            weaknesses: result.weaknesses || [],
            strengths: result.strengths || [],
            recommendations: result.recommendations || [],
            marketPosition: result.market_position || 'follower',
            digitalPresence: {
              website: business.hasWebsite,
              seo: result.seo_score || 0,
              socialMedia: result.social_media_score || 0,
              reviews: Math.min(100, (business.totalReviews / 100) * 100)
            },
            competitorAnalysis: result.competitor_analysis
          }
        }
        
        // Create analyzed business entry
        const analyzedBusiness = {
          id: business.id,
          name: business.name,
          category: business.category,
          location: business.location,
          website: business.website,
          email: business.email,
          phone: business.phone,
          rating: business.rating,
          reviews: business.totalReviews,
          opportunityScore: result.opportunity_score,
          weaknesses: result.weaknesses || [],
          strengths: result.strengths || [],
          analyzedAt: new Date(),
          lastUpdated: new Date(),
          status: 'active' as const,
          digitalPresence: {
            website: business.hasWebsite,
            seo: result.seo_score || 0,
            socialMedia: result.social_media_score || 0,
            reviews: Math.min(100, (business.totalReviews / 100) * 100)
          }
        }
        
        // Update analyzed businesses list
        const existing = analyzedBusinesses.findIndex(b => b.id === business.id)
        let updatedAnalyzed
        if (existing >= 0) {
          updatedAnalyzed = [...analyzedBusinesses]
          updatedAnalyzed[existing] = analyzedBusiness
        } else {
          updatedAnalyzed = [analyzedBusiness, ...analyzedBusinesses]
        }
        
        setAnalyzedBusinesses(updatedAnalyzed)
        storage.set(STORAGE_KEYS.ANALYZED_BUSINESSES, updatedAnalyzed)
        
        // Show analysis results
        setCurrentAnalysis(analysisData)
        setShowAnalysisResults(true)
        
        // Update stats
        updateStats(searchHistory, updatedAnalyzed)
        
        toast.success('Business analysis completed!')
      }
    } catch (error) {
      toast.error('Analysis failed. Please try again.')
      console.error('Analysis error:', error)
    } finally {
      setAnalyzingId(null)
    }
  }

  // Handle saving analysis
  const handleSaveAnalysis = () => {
    toast.success('Analysis saved to your collection')
    setShowAnalysisResults(false)
  }

  // Handle exporting analysis
  const handleExportAnalysis = () => {
    if (!currentAnalysis) return
    
    const data = JSON.stringify(currentAnalysis, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentAnalysis.business.name.replace(/\s+/g, '_')}_analysis.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Analysis exported successfully')
  }

  // Handle sharing analysis
  const handleShareAnalysis = () => {
    // In a real app, this would generate a shareable link
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard')
  }

  // Search history handlers
  const handleSelectSearch = (search: any) => {
    setBusinesses(search.businesses || [])
    toast.success(`Loaded ${search.resultsCount} businesses from history`)
  }

  const handleDeleteSearch = (id: string) => {
    const updated = searchHistory.filter(s => s.id !== id)
    setSearchHistory(updated)
    storage.set(STORAGE_KEYS.SEARCH_HISTORY, updated)
    toast.success('Search removed from history')
  }

  const handleRerunSearch = (search: any) => {
    handleSearch(search.query, search.location)
  }

  const handleExportHistory = () => {
    const data = JSON.stringify(searchHistory, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'search_history.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Search history exported')
  }

  // Analyzed businesses handlers
  const handleViewBusiness = (business: any) => {
    // Find the full analysis data
    const analysisData = {
      business: {
        ...business
      },
      analysis: {
        opportunityScore: business.opportunityScore,
        weaknesses: business.weaknesses,
        strengths: business.strengths,
        recommendations: [],
        marketPosition: 'follower',
        digitalPresence: business.digitalPresence,
        competitorAnalysis: null
      }
    }
    
    setCurrentAnalysis(analysisData)
    setShowAnalysisResults(true)
  }

  const handleUpdateStatus = (id: string, status: string) => {
    const updated = analyzedBusinesses.map(b => 
      b.id === id ? { ...b, status, lastUpdated: new Date() } : b
    )
    setAnalyzedBusinesses(updated)
    storage.set(STORAGE_KEYS.ANALYZED_BUSINESSES, updated)
    updateStats(searchHistory, updated)
    toast.success(`Status updated to ${status}`)
  }

  const handleExportBusinesses = () => {
    const data = JSON.stringify(analyzedBusinesses, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'analyzed_businesses.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Businesses exported')
  }

  const handleAddNote = (id: string, note: string) => {
    const updated = analyzedBusinesses.map(b => 
      b.id === id ? { ...b, notes: note, lastUpdated: new Date() } : b
    )
    setAnalyzedBusinesses(updated)
    storage.set(STORAGE_KEYS.ANALYZED_BUSINESSES, updated)
    toast.success('Note added')
  }

  // Complete onboarding
  const completeOnboarding = () => {
    storage.set(STORAGE_KEYS.ONBOARDING_COMPLETED, true)
    setShowOnboarding(false)
    toast.success('Welcome to FindWorkAI!')
  }

  // AI Agent quick action handlers
  const handleQuickBuildWebsite = (business: any) => {
    setSelectedBusinessForAgent(business)
    setAIAgentType('website')
    setShowAIAgent(true)
    toast.success('Opening Website Builder Agent...')
  }

  const handleQuickGenerateContent = (business: any) => {
    setSelectedBusinessForAgent(business)
    setAIAgentType('content')
    setShowAIAgent(true)
    toast.success('Opening Content Creator Agent...')
  }

  const handleQuickMarketingKit = (business: any) => {
    setSelectedBusinessForAgent(business)
    setAIAgentType('marketing')
    setShowAIAgent(true)
    toast.success('Opening Marketing Campaign Agent...')
  }

  // Onboarding content
  const onboardingSteps = [
    {
      title: 'Welcome to FindWorkAI',
      description: 'Your AI-powered business discovery platform',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold">Discover Businesses</h4>
              <p className="text-sm text-gray-600">Search for businesses in any location or category</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold">AI Analysis</h4>
              <p className="text-sm text-gray-600">Get instant opportunity scores and insights</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold">Convert Leads</h4>
              <p className="text-sm text-gray-600">Track and manage your outreach efforts</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'How It Works',
      description: 'Three simple steps to find your next client',
      content: (
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
              1
            </div>
            <div>
              <h4 className="font-semibold">Search for Businesses</h4>
              <p className="text-sm text-gray-600 mt-1">
                Enter a business type and location to discover potential clients
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
              2
            </div>
            <div>
              <h4 className="font-semibold">Analyze Opportunities</h4>
              <p className="text-sm text-gray-600 mt-1">
                Our AI evaluates each business and provides actionable insights
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
              3
            </div>
            <div>
              <h4 className="font-semibold">Reach Out & Convert</h4>
              <p className="text-sm text-gray-600 mt-1">
                Use our tools to contact businesses and track your progress
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Your Data is Saved',
      description: 'Never lose your work again',
      content: (
        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Automatic Saving</AlertTitle>
            <AlertDescription>
              All your searches and analyses are automatically saved locally
            </AlertDescription>
          </Alert>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-gray-600" />
              <span className="text-sm">Search history is preserved</span>
            </div>
            <div className="flex items-center gap-2">
              <BookmarkCheck className="h-5 w-5 text-gray-600" />
              <span className="text-sm">Analyzed businesses are tracked</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-gray-600" />
              <span className="text-sm">Progress and stats are updated</span>
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Header */}
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
                  FindWorkAI
                </h1>
                <p className="text-xs text-gray-600">Discover Real Opportunities</p>
              </div>
            </div>
            
            <nav className="flex items-center gap-4">
              {[
                { name: 'Dashboard', icon: <Activity className="h-4 w-4" /> },
                { name: 'History', icon: <History className="h-4 w-4" /> },
                { name: 'Analyzed', icon: <BookmarkCheck className="h-4 w-4" /> },
                { name: 'HubSpot', icon: <img src="https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png" className="h-4 w-4" /> },
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

              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <ModernStatsCard
                  title="Total Discovered"
                  value={stats.totalBusinesses}
                  icon={<Building2 className="h-6 w-6 text-white" />}
                  trend={`${searchHistory.length} searches`}
                  color="from-blue-500 to-blue-600"
                />
                <ModernStatsCard
                  title="Analyzed"
                  value={stats.totalAnalyzed}
                  icon={<Brain className="h-6 w-6 text-white" />}
                  trend={`${stats.conversionRate}% converted`}
                  color="from-purple-500 to-purple-600"
                />
                <ModernStatsCard
                  title="No Website"
                  value={stats.noWebsiteCount}
                  icon={<Globe className="h-6 w-6 text-white" />}
                  trend={`${stats.noWebsitePercentage}% opportunity`}
                  color="from-orange-500 to-red-500"
                />
                <ModernStatsCard
                  title="Contacted"
                  value={stats.emailsSent}
                  icon={<Mail className="h-6 w-6 text-white" />}
                  trend="Active outreach"
                  color="from-green-500 to-emerald-500"
                />
              </div>

              {/* Business Grid */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {businesses.length > 0 ? 'Search Results' : 'Recent Discoveries'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {businesses.slice(0, 6).map((business) => {
                    // Check if this business has been analyzed
                    const analyzedBusiness = analyzedBusinesses.find(b => b.id === business.id)
                    const businessWithScore = analyzedBusiness ? {
                      ...business,
                      opportunityScore: analyzedBusiness.opportunityScore,
                      analyzed: true
                    } : business
                    
                    return (
                      <ModernBusinessCard
                        key={business.id}
                        business={businessWithScore}
                        onAnalyze={handleAnalyze}
                        onGenerateEmail={() => {}}
                        onQuickBuildWebsite={handleQuickBuildWebsite}
                        onQuickGenerateContent={handleQuickGenerateContent}
                        onQuickMarketingKit={handleQuickMarketingKit}
                        isAnalyzing={analyzingId === business.id}
                        isGenerating={false}
                        showAIActions={true}
                      />
                    )
                  })}
                </div>
                
                {businesses.length === 0 && (
                  <Card className="col-span-full">
                    <CardContent className="p-12 text-center">
                      <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Search</h3>
                      <p className="text-gray-600">Search for businesses to discover new opportunities</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'History' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SearchHistory
                history={searchHistory}
                onSelectSearch={handleSelectSearch}
                onDeleteSearch={handleDeleteSearch}
                onRerunSearch={handleRerunSearch}
                onExportHistory={handleExportHistory}
              />
            </motion.div>
          )}

          {activeTab === 'Analyzed' && (
            <motion.div
              key="analyzed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AnalyzedBusinesses
                businesses={analyzedBusinesses}
                onViewBusiness={handleViewBusiness}
                onUpdateStatus={handleUpdateStatus}
                onExportData={handleExportBusinesses}
                onAddNote={handleAddNote}
              />
            </motion.div>
          )}

          {activeTab === 'HubSpot' && (
            <motion.div
              key="hubspot"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <HubSpotSettings
                analyzedBusinesses={analyzedBusinesses}
                onSyncBusinesses={(businesses) => {
                  setBusinesses(businesses)
                  toast.success('Businesses imported from HubSpot')
                }}
              />
            </motion.div>
          )}

          {activeTab === 'Analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">Performance Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Conversion Funnel</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>Discovered</span>
                            <span className="font-bold">{stats.totalBusinesses}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{width: '100%'}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>Analyzed</span>
                            <span className="font-bold">{stats.totalAnalyzed}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-600 h-2 rounded-full" style={{width: `${(stats.totalAnalyzed / Math.max(stats.totalBusinesses, 1)) * 100}%`}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>Contacted</span>
                            <span className="font-bold">{stats.emailsSent}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-600 h-2 rounded-full" style={{width: `${(stats.emailsSent / Math.max(stats.totalAnalyzed, 1)) * 100}%`}}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span>Converted</span>
                            <span className="font-bold">{analyzedBusinesses.filter(b => b.status === 'converted').length}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{width: `${stats.conversionRate}%`}}></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Key Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Avg. Opportunity Score</span>
                          <span className="text-2xl font-bold text-blue-600">
                            {analyzedBusinesses.length > 0 
                              ? Math.round(analyzedBusinesses.reduce((acc, b) => acc + b.opportunityScore, 0) / analyzedBusinesses.length)
                              : 0}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Response Rate</span>
                          <span className="text-2xl font-bold text-purple-600">
                            {stats.emailsSent > 0 
                              ? Math.round((analyzedBusinesses.filter(b => b.status === 'contacted' || b.status === 'converted').length / stats.emailsSent) * 100)
                              : 0}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Success Rate</span>
                          <span className="text-2xl font-bold text-green-600">
                            {stats.conversionRate}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Analysis Results Dialog */}
      <Dialog open={showAnalysisResults} onOpenChange={setShowAnalysisResults}>
        <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Business Analysis Results</DialogTitle>
            <DialogDescription>Detailed analysis of the selected business</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            {currentAnalysis && (
              <AnalysisResults
                business={currentAnalysis.business}
                analysis={currentAnalysis.analysis}
                onSave={handleSaveAnalysis}
                onExport={handleExportAnalysis}
                onShare={handleShareAnalysis}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Onboarding Dialog */}
      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{onboardingSteps[onboardingStep].title}</DialogTitle>
            <DialogDescription>
              {onboardingSteps[onboardingStep].description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            {onboardingSteps[onboardingStep].content}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === onboardingStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <div className="flex gap-3">
              {onboardingStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setOnboardingStep(onboardingStep - 1)}
                >
                  Previous
                </Button>
              )}
              {onboardingStep < onboardingSteps.length - 1 ? (
                <Button onClick={() => setOnboardingStep(onboardingStep + 1)}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={completeOnboarding}>
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Agent Builder Dialog */}
      <Dialog open={showAIAgent} onOpenChange={setShowAIAgent}>
        <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="flex-shrink-0 p-6 pb-0">
            <DialogTitle>AI Agent Builder</DialogTitle>
            <DialogDescription>Building AI-powered solutions for your business</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6 pt-4">
            {selectedBusinessForAgent && (
              <BusinessAIAgentBuilder
                business={selectedBusinessForAgent}
                agentType={aiAgentType}
                isOpen={showAIAgent}
                onClose={() => setShowAIAgent(false)}
                apiKey="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"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
