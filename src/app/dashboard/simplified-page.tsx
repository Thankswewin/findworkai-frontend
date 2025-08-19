'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Building2, TrendingUp, Mail, Filter,
  Activity, ChevronRight, Info, Sparkles, MoreVertical,
  Globe, Calendar, Users, BarChart, Target
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Alert, AlertDescription } from '@/components/ui/alert'
import toast from 'react-hot-toast'

// Import components
import { AnalysisResults } from '@/components/analysis/AnalysisResults'
import SimplifiedSearchBar from '@/components/search/simplified-search-bar'
import SimplifiedBusinessCard from '@/components/simplified-business-card'
import SimplifiedStatsCard from '@/components/simplified-stats-card'
import LoadingSkeleton from '@/components/loading-skeleton'
import ErrorState from '@/components/error-state'
import { searchBusinesses } from '@/lib/google-places'
import analytics from '@/services/analytics'
import { BusinessAIAgentBuilder } from '@/components/ai-agent/BusinessAIAgentBuilder'

// Storage helper
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
  }
}

export default function SimplifiedDashboard() {
  const [businesses, setBusinesses] = useState<any[]>([])
  const [analyzedBusinesses, setAnalyzedBusinesses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analyzingId, setAnalyzingId] = useState<string | null>(null)
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [showAIAgent, setShowAIAgent] = useState(false)
  const [aiAgentType, setAIAgentType] = useState<'website' | 'content' | 'marketing'>('website')
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [generatedEmail, setGeneratedEmail] = useState<any>(null)
  
  // Simplified stats
  const stats = {
    discovered: businesses.length,
    analyzed: analyzedBusinesses.length,
    opportunities: analyzedBusinesses.filter(b => !b.hasWebsite).length,
    contacted: analyzedBusinesses.filter(b => b.status === 'contacted').length
  }

  // Load data on mount
  useEffect(() => {
    const analyzed = storage.get('findworkai_analyzed_businesses') || []
    setAnalyzedBusinesses(analyzed)
  }, [])

  // Simplified search handler
  const handleSearch = async (query: string, location: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const results = await searchBusinesses(query, location)
      setBusinesses(results)
      
      // Track analytics with proper service
      analytics.trackSearch(query, location, results.length)
      
      toast.success(`Found ${results.length} businesses`)
    } catch (error) {
      setError('Search failed. Please try again.')
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Simplified analyze handler
  const handleAnalyze = async (business: any) => {
    setAnalyzingId(business.id)
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://findworkai-backend.onrender.com/api/v1'
      const response = await fetch(`${apiUrl}/demo/analyze-business`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: business.name,
          business_category: business.category || 'General',
          city: business.location?.split(',')[0] || 'Unknown',
          state: business.location?.split(',')[1] || '',
          rating: business.rating || 0,
          total_reviews: business.totalReviews || 0,
          has_website: business.hasWebsite || false,
          website: business.website || ''
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        const analyzedBusiness = {
          ...business,
          opportunityScore: result.opportunity_score,
          weaknesses: result.weaknesses || [],
          analyzedAt: new Date().toISOString(),
          status: 'active'
        }
        
        const updated = [...analyzedBusinesses, analyzedBusiness]
        setAnalyzedBusinesses(updated)
        storage.set('findworkai_analyzed_businesses', updated)
        
        setSelectedBusiness(analyzedBusiness)
        setShowAnalysis(true)
        
        // Track analytics with proper service
        analytics.trackAnalysis(business.id, result.opportunity_score, business.hasWebsite)
        
        toast.success('Analysis complete!')
      }
    } catch (error) {
      toast.error('Analysis failed. Please try again.')
      console.error('Analysis error:', error)
    } finally {
      setAnalyzingId(null)
    }
  }

  // Analytics tracking helper using the analytics service
  const trackEvent = (eventName: string, properties?: any) => {
    analytics.track(eventName, properties)
  }

  // Action handlers for all features
  const handleGenerateEmail = async (business: any) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://findworkai-backend.onrender.com/api/v1'
      const response = await fetch(`${apiUrl}/demo/generate-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: business.name,
          service_type: 'digital_marketing',
          weaknesses: business.weaknesses || [],
          opportunities: business.opportunities || [],
          rating: business.rating
        })
      })
      const result = await response.json()
      if (result.success) {
        setGeneratedEmail(result.email)
        setShowEmailDialog(true)
        toast.success('Email generated successfully!')
      }
    } catch (error) {
      toast.error('Failed to generate email')
    }
  }

  const handleBuildWebsite = (business: any) => {
    // Open AI Agent in dialog for website building
    setSelectedBusiness(business)
    setAIAgentType('website')
    setShowAIAgent(true)
  }

  const handleGenerateContent = (business: any) => {
    // Open AI Agent in dialog for content generation
    setSelectedBusiness(business)
    setAIAgentType('content')
    setShowAIAgent(true)
  }

  const handleMarketingKit = (business: any) => {
    // Open AI Agent in dialog for marketing kit
    setSelectedBusiness(business)
    setAIAgentType('marketing')
    setShowAIAgent(true)
  }

  const handleAddToHubSpot = (business: any) => {
    // Add to HubSpot CRM
    toast.success('Adding to HubSpot...')
    trackEvent('hubspot_integration', { business_id: business.id })
  }

  const handleScheduleFollowUp = (business: any) => {
    // Schedule follow-up
    const followUpDate = new Date()
    followUpDate.setDate(followUpDate.getDate() + 3)
    storage.set(`followup_${business.id}`, {
      business,
      scheduledFor: followUpDate.toISOString()
    })
    toast.success(`Follow-up scheduled for ${followUpDate.toLocaleDateString()}`)
    trackEvent('followup_scheduled', { business_id: business.id })
  }

  const handleAddToCampaign = (business: any) => {
    // Add to campaign
    const campaigns = storage.get('campaigns') || []
    campaigns.push({
      business,
      addedAt: new Date().toISOString()
    })
    storage.set('campaigns', campaigns)
    toast.success('Added to campaign')
    trackEvent('campaign_added', { business_id: business.id })
  }

  const handleViewCompetitors = (business: any) => {
    // View competitors
    window.location.href = `/competitors?business=${encodeURIComponent(business.name)}&location=${encodeURIComponent(business.location)}`
  }

  const handleTrackProgress = (business: any) => {
    // Track progress
    const updated = analyzedBusinesses.map(b => 
      b.id === business.id ? { ...b, status: 'tracking' } : b
    )
    setAnalyzedBusinesses(updated)
    storage.set('findworkai_analyzed_businesses', updated)
    toast.success('Progress tracking enabled')
    trackEvent('progress_tracking', { business_id: business.id })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simplified Header - Mobile Optimized */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg">
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">FindWorkAI</h1>
                <p className="hidden sm:block text-xs text-gray-500">Discover opportunities</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="px-2 sm:px-3"
              >
                <Filter className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="px-2 sm:px-3"
              >
                <span className="hidden sm:inline">{viewMode === 'grid' ? 'List' : 'Grid'} View</span>
                <span className="sm:hidden">{viewMode === 'grid' ? '☰' : '⊞'}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Next Client</h2>
          <SimplifiedSearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Simplified Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <SimplifiedStatsCard
            title="Discovered"
            value={stats.discovered}
            icon={<Building2 className="h-5 w-5" />}
            color="blue"
          />
          <SimplifiedStatsCard
            title="Analyzed"
            value={stats.analyzed}
            icon={<TrendingUp className="h-5 w-5" />}
            color="purple"
          />
          <SimplifiedStatsCard
            title="Opportunities"
            value={stats.opportunities}
            icon={<Sparkles className="h-5 w-5" />}
            color="orange"
          />
          <SimplifiedStatsCard
            title="Contacted"
            value={stats.contacted}
            icon={<Mail className="h-5 w-5" />}
            color="green"
          />
        </div>

        {/* Error State */}
        {error && (
          <ErrorState
            message={error}
            onRetry={() => {
              setError(null)
              // Retry last action
            }}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Results Section */}
        {!isLoading && businesses.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {businesses.length} Results Found
              </h3>
              {showFilters && (
                <div className="flex gap-2">
                  <Badge variant="secondary">No Website</Badge>
                  <Badge variant="secondary">High Opportunity</Badge>
                  <Badge variant="secondary">Low Competition</Badge>
                </div>
              )}
            </div>
            
            <div className={`grid gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {businesses.map((business) => (
                <SimplifiedBusinessCard
                  key={business.id}
                  business={business}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={analyzingId === business.id}
                  viewMode={viewMode}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && businesses.length === 0 && !error && (
          <Card className="p-12">
            <CardContent className="text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Start Discovering Opportunities
              </h3>
              <p className="text-gray-600 mb-4">
                Search for businesses in your area that need your services
              </p>
              <div className="flex gap-2 justify-center">
                <Badge variant="outline">Try: "restaurants"</Badge>
                <Badge variant="outline">Try: "dentists"</Badge>
                <Badge variant="outline">Try: "law firms"</Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Analysis Dialog - Responsive and focused with all actions */}
      <Dialog open={showAnalysis} onOpenChange={setShowAnalysis}>
        <DialogContent className="sm:max-w-5xl w-[95vw] sm:w-full max-h-[85vh] sm:max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Business Analysis</DialogTitle>
            <DialogDescription>
              Opportunity assessment for {selectedBusiness?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedBusiness && (
            <div className="mt-4">
              {/* Quick Actions Bar */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      handleGenerateEmail(selectedBusiness)
                      toast.success('Generating email...')
                    }}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Generate Email
                  </Button>
                  {!selectedBusiness.hasWebsite && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        handleBuildWebsite(selectedBusiness)
                        toast.success('Opening website builder...')
                      }}
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Build Website
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      handleGenerateContent(selectedBusiness)
                      toast.success('Generating content...')
                    }}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Content
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      handleMarketingKit(selectedBusiness)
                      toast.success('Creating marketing kit...')
                    }}
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Marketing Kit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline">
                        <MoreVertical className="mr-2 h-4 w-4" />
                        More
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleAddToHubSpot(selectedBusiness)}>
                        Add to HubSpot
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleScheduleFollowUp(selectedBusiness)}>
                        Schedule Follow-up
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAddToCampaign(selectedBusiness)}>
                        Add to Campaign
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleViewCompetitors(selectedBusiness)}>
                        View Competitors
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTrackProgress(selectedBusiness)}>
                        Track Progress
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Analysis Results */}
              <AnalysisResults
                business={selectedBusiness}
                analysis={{
                  opportunityScore: selectedBusiness.opportunityScore,
                  weaknesses: selectedBusiness.weaknesses,
                  strengths: [],
                  recommendations: [],
                  marketPosition: 'follower',
                  digitalPresence: {
                    website: selectedBusiness.hasWebsite,
                    seo: 0,
                    socialMedia: 0,
                    reviews: Math.min(100, (selectedBusiness.totalReviews / 100) * 100)
                  }
                }}
                onSave={() => {
                  toast.success('Analysis saved')
                  setShowAnalysis(false)
                }}
                onExport={() => toast.success('Analysis exported')}
                onShare={() => toast.success('Link copied')}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* AI Agent Builder Dialog */}
      {showAIAgent && selectedBusiness && (
        <Dialog open={showAIAgent} onOpenChange={setShowAIAgent}>
          <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0">
            <DialogHeader className="flex-shrink-0 p-6 pb-4">
              <DialogTitle>
                {aiAgentType === 'website' && 'AI Website Builder'}
                {aiAgentType === 'content' && 'AI Content Generator'}
                {aiAgentType === 'marketing' && 'AI Marketing Kit'}
              </DialogTitle>
              <DialogDescription>
                Building AI-powered solutions for {selectedBusiness.name}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto p-6 pt-0">
              <BusinessAIAgentBuilder
                business={selectedBusiness}
                agentType={aiAgentType}
                isOpen={showAIAgent}
                onClose={() => setShowAIAgent(false)}
                apiKey="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"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Email Dialog */}
      {showEmailDialog && generatedEmail && (
        <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Generated Email</DialogTitle>
              <DialogDescription>
                Personalized outreach email for {selectedBusiness?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Subject:</h4>
                <p className="p-3 bg-gray-50 rounded-lg">{generatedEmail.subject}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Email Body:</h4>
                <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
                  {generatedEmail.body}
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedEmail.body)
                    toast.success('Email copied to clipboard!')
                  }}
                >
                  Copy to Clipboard
                </Button>
                <Button
                  onClick={() => {
                    // Open email client
                    const mailto = `mailto:?subject=${encodeURIComponent(generatedEmail.subject)}&body=${encodeURIComponent(generatedEmail.body)}`
                    window.open(mailto)
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Open in Email Client
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
