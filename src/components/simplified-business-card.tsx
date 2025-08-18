'use client'

import React from 'react'
import { 
  Star, MapPin, Globe, TrendingUp, 
  Loader2, MoreVertical, ExternalLink,
  Mail, Phone
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface SimplifiedBusinessCardProps {
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
  }
  onAnalyze: (business: any) => void
  isAnalyzing?: boolean
  viewMode?: 'grid' | 'list'
}

export default function SimplifiedBusinessCard({ 
  business, 
  onAnalyze, 
  isAnalyzing,
  viewMode = 'grid'
}: SimplifiedBusinessCardProps) {
  
  const getOpportunityLabel = (score?: number) => {
    if (!score) return null
    if (score >= 70) return { label: 'High', color: 'text-green-600 bg-green-50' }
    if (score >= 40) return { label: 'Medium', color: 'text-yellow-600 bg-yellow-50' }
    return { label: 'Low', color: 'text-red-600 bg-red-50' }
  }

  const opportunity = getOpportunityLabel(business.opportunityScore)

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{business.name}</h3>
                  <p className="text-sm text-gray-600">{business.category}</p>
                </div>
                {opportunity && (
                  <Badge className={`ml-2 ${opportunity.color}`}>
                    {opportunity.label} Opportunity
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {business.location}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {business.rating} ({business.totalReviews} reviews)
                </span>
                {business.hasWebsite ? (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Has Website
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    No Website
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <Button
                onClick={() => onAnalyze(business)}
                disabled={isAnalyzing}
                size="sm"
              >
                {isAnalyzing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Analyze
                  </>
                )}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {business.website && (
                    <DropdownMenuItem onClick={() => window.open(business.website, '_blank')}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Visit Website
                    </DropdownMenuItem>
                  )}
                  {business.phone && (
                    <DropdownMenuItem>
                      <Phone className="mr-2 h-4 w-4" />
                      Call {business.phone}
                    </DropdownMenuItem>
                  )}
                  {business.email && (
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      Email Business
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{business.name}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {business.website && (
                  <DropdownMenuItem onClick={() => window.open(business.website, '_blank')}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Website
                  </DropdownMenuItem>
                )}
                {business.phone && (
                  <DropdownMenuItem>
                    <Phone className="mr-2 h-4 w-4" />
                    Call Business
                  </DropdownMenuItem>
                )}
                {business.email && (
                  <DropdownMenuItem>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm text-gray-600">{business.category}</p>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{business.location}</span>
          </div>
          
          <div className="flex items-center justify-between">
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
                No Website
              </Badge>
            )}
          </div>
        </div>

        {/* Opportunity Score (if analyzed) */}
        {opportunity && (
          <div className={`px-3 py-2 rounded-lg mb-4 ${opportunity.color}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{opportunity.label} Opportunity</span>
              <span className="text-sm font-bold">{business.opportunityScore}%</span>
            </div>
          </div>
        )}

        {/* Single Primary Action */}
        <Button
          onClick={() => onAnalyze(business)}
          disabled={isAnalyzing}
          className="w-full"
          size="sm"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : business.opportunityScore ? (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              View Analysis
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              Analyze Opportunity
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
