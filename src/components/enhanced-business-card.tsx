'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, MapPin, Globe, Phone, TrendingUp, 
  Loader2, Mail, ExternalLink, AlertCircle,
  Sparkles, Wand2, ChevronDown, ChevronUp,
  Shield, Zap, Users, Target, Trophy,
  AlertTriangle, CheckCircle, Info, ArrowUp,
  BarChart3, Search, Code, Smartphone
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

interface WebsiteAnalysis {
  overall_score: number
  seo?: { score: number; issues: string[]; strengths: string[] }
  performance?: { score: number; issues: string[]; strengths: string[] }
  security?: { score: number; issues: string[]; strengths: string[] }
  mobile?: { score: number; issues: string[]; strengths: string[] }
  opportunities: string[]
  recommendations: string[]
}

interface CompetitiveAnalysis {
  market_position: {
    position_tier: string
    overall_position: number
    rating_percentile: number
    review_percentile: number
    market_saturation: {
      websites_percentage: number
      average_rating: number
      total_competitors: number
    }
  }
  competitive_advantages: Array<{ type: string; description: string; impact: string }>
  competitive_gaps: Array<{ type: string; description: string; severity: string; solution: string }>
  opportunities: Array<{ type: string; description: string; potential: string; action: string }>
  recommendations: string[]
  market_summary: string
}

interface EnhancedBusinessCardProps {
  business: {
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
    opportunityScore?: number
    opportunityType?: string
    opportunityPriority?: string
    recommendedActions?: string[]
    websiteAnalysis?: WebsiteAnalysis
    competitiveAnalysis?: CompetitiveAnalysis
    marketPosition?: string
    competitiveScore?: number
    finalOpportunityScore?: number
    analyzed?: boolean
  }
  onAnalyze: (business: any) => void
  onGenerateEmail?: (business: any) => void
  onQuickBuildWebsite?: (business: any) => void
  onQuickGenerateContent?: (business: any) => void
  onQuickMarketingKit?: (business: any) => void
  isAnalyzing?: boolean
  isGenerating?: boolean
  showAIActions?: boolean
}

export default function EnhancedBusinessCard({ 
  business, 
  onAnalyze, 
  onGenerateEmail,
  onQuickBuildWebsite,
  onQuickGenerateContent,
  onQuickMarketingKit,
  isAnalyzing, 
  isGenerating,
  showAIActions = false
}: EnhancedBusinessCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'website' | 'competition'>('overview')

  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-700'
    if (score >= 80) return 'bg-green-100 text-green-700 border-green-300'
    if (score >= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    if (score >= 40) return 'bg-orange-100 text-orange-700 border-orange-300'
    return 'bg-red-100 text-red-700 border-red-300'
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return 'bg-red-600 text-white animate-pulse'
      case 'high':
        return 'bg-orange-600 text-white'
      case 'medium':
        return 'bg-yellow-600 text-white'
      case 'low':
        return 'bg-blue-600 text-white'
      default:
        return 'bg-gray-600 text-white'
    }
  }

  const getOpportunityTypeIcon = (type?: string) => {
    switch (type) {
      case 'no_website':
        return <AlertCircle className="h-4 w-4" />
      case 'website_rebuild':
        return <AlertTriangle className="h-4 w-4" />
      case 'major_improvements':
        return <Zap className="h-4 w-4" />
      case 'optimization':
        return <TrendingUp className="h-4 w-4" />
      case 'maintenance':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getMarketPositionIcon = (position?: string) => {
    switch (position) {
      case 'Market Leader':
        return <Trophy className="h-4 w-4 text-yellow-600" />
      case 'Strong Competitor':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'Average Performer':
        return <Users className="h-4 w-4 text-blue-600" />
      case 'Below Average':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'Struggling':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const renderScoreBadge = (label: string, score: number, max: number = 100) => {
    const percentage = (score / max) * 100
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600">{label}</span>
        <div className="flex items-center gap-1">
          <Progress value={percentage} className="w-16 h-2" />
          <span className="text-xs font-medium">{score}</span>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`h-full hover:shadow-xl transition-all ${isExpanded ? 'shadow-lg' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg line-clamp-1">{business.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{business.category}</p>
            </div>
            
            <div className="flex flex-col gap-1 items-end">
              {/* Final Opportunity Score */}
              {business.finalOpportunityScore !== undefined && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge className={`${getScoreColor(business.finalOpportunityScore)} border`}>
                        <Target className="h-3 w-3 mr-1" />
                        {business.finalOpportunityScore}%
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Overall Opportunity Score</p>
                      <p className="text-xs">Combined website & competitive analysis</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              {/* Priority Badge */}
              {business.opportunityPriority && (
                <Badge className={`text-xs ${getPriorityColor(business.opportunityPriority)}`}>
                  {business.opportunityPriority.toUpperCase()}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{business.location}</span>
          </div>
          
          {/* Rating and Website Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{business.rating}</span>
              <span className="text-sm text-gray-500">({business.totalReviews})</span>
            </div>
            
            {business.hasWebsite ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Globe className="h-3 w-3 mr-1" />
                Has Website
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-600 border-red-600">
                <AlertCircle className="h-3 w-3 mr-1" />
                No Website
              </Badge>
            )}
          </div>

          {/* Opportunity Type and Market Position */}
          <div className="flex flex-wrap gap-2">
            {business.opportunityType && (
              <Badge variant="secondary" className="text-xs">
                {getOpportunityTypeIcon(business.opportunityType)}
                <span className="ml-1">{business.opportunityType.replace(/_/g, ' ').toUpperCase()}</span>
              </Badge>
            )}
            
            {business.marketPosition && (
              <Badge variant="secondary" className="text-xs">
                {getMarketPositionIcon(business.marketPosition)}
                <span className="ml-1">{business.marketPosition}</span>
              </Badge>
            )}
          </div>

          {/* Website Analysis Mini Summary */}
          {business.websiteAnalysis && business.hasWebsite && (
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">Website Analysis</span>
                <Badge className={`text-xs ${getScoreColor(business.websiteAnalysis.overall_score)}`}>
                  Score: {business.websiteAnalysis.overall_score}/100
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {business.websiteAnalysis.seo && (
                  <div className="flex items-center gap-1">
                    <Search className="h-3 w-3 text-gray-500" />
                    <span className="text-xs">SEO: {business.websiteAnalysis.seo.score}</span>
                  </div>
                )}
                {business.websiteAnalysis.performance && (
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-gray-500" />
                    <span className="text-xs">Speed: {business.websiteAnalysis.performance.score}</span>
                  </div>
                )}
                {business.websiteAnalysis.security && (
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-gray-500" />
                    <span className="text-xs">Security: {business.websiteAnalysis.security.score}</span>
                  </div>
                )}
                {business.websiteAnalysis.mobile && (
                  <div className="flex items-center gap-1">
                    <Smartphone className="h-3 w-3 text-gray-500" />
                    <span className="text-xs">Mobile: {business.websiteAnalysis.mobile.score}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Top Recommendations */}
          {business.recommendedActions && business.recommendedActions.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-900">Top Actions</span>
              </div>
              <ul className="space-y-1">
                {business.recommendedActions.slice(0, 3).map((action, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <CheckCircle className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-blue-800">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Competitive Insights Summary */}
          {business.competitiveAnalysis && (
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-medium text-purple-900">Market Analysis</span>
                </div>
                <Badge className="text-xs bg-purple-600 text-white">
                  {business.competitiveAnalysis.market_position.total_competitors} Competitors
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-purple-700">Position:</span>
                  <span className="ml-1 font-medium">
                    Top {100 - business.competitiveAnalysis.market_position.overall_position}%
                  </span>
                </div>
                <div>
                  <span className="text-purple-700">Digital Saturation:</span>
                  <span className="ml-1 font-medium">
                    {business.competitiveAnalysis.market_position.market_saturation.websites_percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
              
              {business.competitiveAnalysis.competitive_advantages.length > 0 && (
                <div className="mt-2">
                  <span className="text-xs text-green-700 font-medium">
                    ✓ {business.competitiveAnalysis.competitive_advantages.length} Advantages
                  </span>
                </div>
              )}
              
              {business.competitiveAnalysis.competitive_gaps.length > 0 && (
                <div className="mt-1">
                  <span className="text-xs text-orange-700 font-medium">
                    ⚠ {business.competitiveAnalysis.competitive_gaps.length} Gaps to Address
                  </span>
                </div>
              )}
            </div>
          )}
          
          {/* Contact Info */}
          {(business.phone || business.email) && (
            <div className="flex gap-2 text-sm">
              {business.phone && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Phone className="h-3 w-3" />
                  <span>{business.phone}</span>
                </div>
              )}
              {business.email && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{business.email}</span>
                </div>
              )}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => onAnalyze(business)}
              disabled={isAnalyzing}
              size="sm"
              className="flex-1"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  {business.analyzed ? 'Re-Analyze' : 'Analyze'}
                </>
              )}
            </Button>
            
            {/* Expand/Collapse for detailed view */}
            {(business.websiteAnalysis || business.competitiveAnalysis) && (
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                size="sm"
                variant="outline"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}
            
            {onGenerateEmail && (
              <Button
                onClick={() => onGenerateEmail(business)}
                disabled={isGenerating}
                size="sm"
                variant="outline"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
              </Button>
            )}
            
            {business.website && (
              <Button
                onClick={() => window.open(business.website, '_blank')}
                size="sm"
                variant="outline"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Expanded Detailed Analysis */}
          <AnimatePresence>
            {isExpanded && (business.websiteAnalysis || business.competitiveAnalysis) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t pt-4 mt-4 space-y-4"
              >
                {/* Tab Navigation */}
                <div className="flex gap-2 border-b">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-3 py-1 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === 'overview'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Overview
                  </button>
                  {business.websiteAnalysis && (
                    <button
                      onClick={() => setActiveTab('website')}
                      className={`px-3 py-1 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'website'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Website Details
                    </button>
                  )}
                  {business.competitiveAnalysis && (
                    <button
                      onClick={() => setActiveTab('competition')}
                      className={`px-3 py-1 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'competition'
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Competition
                    </button>
                  )}
                </div>

                {/* Tab Content */}
                <div className="space-y-3">
                  {activeTab === 'overview' && (
                    <>
                      {business.competitiveAnalysis?.market_summary && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <h4 className="text-sm font-medium mb-2">Market Summary</h4>
                          <p className="text-xs text-gray-700">
                            {business.competitiveAnalysis.market_summary}
                          </p>
                        </div>
                      )}
                      
                      {business.websiteAnalysis?.recommendations && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Recommendations</h4>
                          <ul className="space-y-1">
                            {business.websiteAnalysis.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <ArrowUp className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-xs">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === 'website' && business.websiteAnalysis && (
                    <div className="space-y-3">
                      {/* SEO Details */}
                      {business.websiteAnalysis.seo && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">SEO Analysis</h4>
                          <div className="space-y-2">
                            {business.websiteAnalysis.seo.strengths.length > 0 && (
                              <div>
                                <span className="text-xs text-green-700 font-medium">Strengths:</span>
                                <ul className="mt-1 space-y-0.5">
                                  {business.websiteAnalysis.seo.strengths.slice(0, 3).map((item, i) => (
                                    <li key={i} className="text-xs text-gray-600 ml-3">• {item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {business.websiteAnalysis.seo.issues.length > 0 && (
                              <div>
                                <span className="text-xs text-red-700 font-medium">Issues:</span>
                                <ul className="mt-1 space-y-0.5">
                                  {business.websiteAnalysis.seo.issues.slice(0, 3).map((item, i) => (
                                    <li key={i} className="text-xs text-gray-600 ml-3">• {item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'competition' && business.competitiveAnalysis && (
                    <div className="space-y-3">
                      {/* Competitive Advantages */}
                      {business.competitiveAnalysis.competitive_advantages.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 text-green-700">Competitive Advantages</h4>
                          <ul className="space-y-1">
                            {business.competitiveAnalysis.competitive_advantages.map((adv, i) => (
                              <li key={i} className="text-xs bg-green-50 rounded p-2">
                                <span className="font-medium">{adv.type}:</span> {adv.description}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Competitive Gaps */}
                      {business.competitiveAnalysis.competitive_gaps.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 text-orange-700">Areas for Improvement</h4>
                          <ul className="space-y-1">
                            {business.competitiveAnalysis.competitive_gaps.map((gap, i) => (
                              <li key={i} className="text-xs bg-orange-50 rounded p-2">
                                <span className="font-medium">{gap.type}:</span> {gap.description}
                                <div className="text-xs text-gray-600 mt-1">→ {gap.solution}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Agents Quick Actions */}
          {(showAIActions || business.analyzed || business.opportunityScore) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="border-t pt-3 mt-3"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">AI Quick Actions</span>
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                  POWERED BY AI
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {!business.hasWebsite && onQuickBuildWebsite && (
                  <Button
                    onClick={() => business.analyzed ? onQuickBuildWebsite(business) : onAnalyze(business)}
                    size="sm"
                    variant="outline"
                    disabled={!business.analyzed}
                    className="text-xs flex items-center gap-1 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={!business.analyzed ? "Analyze business first" : "Build website"}
                  >
                    <Globe className="h-3 w-3" />
                    Build Website
                  </Button>
                )}
                
                {business.hasWebsite && business.websiteAnalysis?.overall_score && business.websiteAnalysis.overall_score < 50 && onQuickBuildWebsite && (
                  <Button
                    onClick={() => onQuickBuildWebsite(business)}
                    size="sm"
                    variant="outline"
                    className="text-xs flex items-center gap-1 hover:bg-orange-50 hover:border-orange-300"
                  >
                    <Code className="h-3 w-3" />
                    Rebuild Site
                  </Button>
                )}
                
                {onQuickGenerateContent && (
                  <Button
                    onClick={() => business.analyzed ? onQuickGenerateContent(business) : onAnalyze(business)}
                    size="sm"
                    variant="outline"
                    disabled={!business.analyzed}
                    className="text-xs flex items-center gap-1 hover:bg-purple-50 hover:border-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={!business.analyzed ? "Analyze business first" : "Generate content kit"}
                  >
                    <Wand2 className="h-3 w-3" />
                    Content Kit
                  </Button>
                )}
                
                {onQuickMarketingKit && (
                  <Button
                    onClick={() => business.analyzed ? onQuickMarketingKit(business) : onAnalyze(business)}
                    size="sm"
                    variant="outline"
                    disabled={!business.analyzed}
                    className="text-xs flex items-center gap-1 hover:bg-green-50 hover:border-green-300 col-span-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={!business.analyzed ? "Analyze business first" : "Generate marketing campaign"}
                  >
                    <TrendingUp className="h-3 w-3" />
                    Marketing Campaign
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
