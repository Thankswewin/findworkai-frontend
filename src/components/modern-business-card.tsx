'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Star, MapPin, Globe, Phone, TrendingUp, 
  Loader2, Mail, ExternalLink, AlertCircle,
  Sparkles, Wand2, ChevronDown, ChevronUp
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface ModernBusinessCardProps {
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

export default function ModernBusinessCard({ 
  business, 
  onAnalyze, 
  onGenerateEmail,
  onQuickBuildWebsite,
  onQuickGenerateContent,
  onQuickMarketingKit,
  isAnalyzing, 
  isGenerating,
  showAIActions = false
}: ModernBusinessCardProps) {
  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-700'
    if (score >= 70) return 'bg-green-100 text-green-700'
    if (score >= 40) return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full hover:shadow-xl transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-lg line-clamp-1">{business.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{business.category}</p>
            </div>
            {business.opportunityScore && (
              <Badge className={getScoreColor(business.opportunityScore)}>
                {business.opportunityScore}%
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{business.location}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{business.rating}</span>
              <span className="text-sm text-gray-500">({business.totalReviews})</span>
            </div>
            
            {business.hasWebsite ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Globe className="h-3 w-3 mr-1" />
                Website
              </Badge>
            ) : (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                <AlertCircle className="h-3 w-3 mr-1" />
                No Website
              </Badge>
            )}
          </div>
          
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
                  Analyze
                </>
              )}
            </Button>
            
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

          {/* AI Agents Quick Actions - Show after analysis */}
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
                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">NEW</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {!business.hasWebsite && onQuickBuildWebsite && (
                  <Button
                    onClick={() => onQuickBuildWebsite(business)}
                    size="sm"
                    variant="outline"
                    className="text-xs flex items-center gap-1 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Globe className="h-3 w-3" />
                    Quick Website
                  </Button>
                )}
                
                {onQuickGenerateContent && (
                  <Button
                    onClick={() => onQuickGenerateContent(business)}
                    size="sm"
                    variant="outline"
                    className="text-xs flex items-center gap-1 hover:bg-purple-50 hover:border-purple-300"
                  >
                    <Wand2 className="h-3 w-3" />
                    Content Kit
                  </Button>
                )}
                
                {onQuickMarketingKit && (
                  <Button
                    onClick={() => onQuickMarketingKit(business)}
                    size="sm"
                    variant="outline"
                    className="text-xs flex items-center gap-1 hover:bg-green-50 hover:border-green-300 col-span-2"
                  >
                    <TrendingUp className="h-3 w-3" />
                    Marketing Campaign
                  </Button>
                )}
              </div>
              
              <div className="text-xs text-gray-500 text-center mt-2">
                🤖 Powered by AI Agents
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
