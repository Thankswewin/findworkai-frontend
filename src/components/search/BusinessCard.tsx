import React from 'react'
import { 
  Star, MapPin, Phone, Globe, Mail, Clock, 
  CheckCircle, ExternalLink, TrendingUp, Users 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

interface BusinessCardProps {
  business: {
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
    distance_km?: number
  }
  selected: boolean
  onSelect: () => void
  showDistance?: boolean
}

export default function BusinessCard({ 
  business, 
  selected, 
  onSelect,
  showDistance = false 
}: BusinessCardProps) {
  const isOpenNow = () => {
    // Simplified check - in production, use the business hours data
    const now = new Date()
    const hour = now.getHours()
    return hour >= 9 && hour < 17 // Default business hours
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 4.0) return 'text-blue-600'
    if (rating >= 3.5) return 'text-yellow-600'
    return 'text-gray-600'
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200'
    if (score >= 60) return 'bg-blue-100 text-blue-800 border-blue-200'
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  // Calculate opportunity score (simplified)
  const opportunityScore = Math.round(
    (100 - (business.rating * 20)) + // Lower rating = higher opportunity
    (business.review_count < 50 ? 20 : 0) + // Few reviews = opportunity
    (!business.website ? 30 : 0) + // No website = big opportunity
    (Math.random() * 10) // Some randomness for demo
  )

  return (
    <div 
      className={cn(
        "bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200",
        selected && "ring-2 ring-primary-500 border-primary-500"
      )}
    >
      <div className="p-6">
        <div className="flex gap-4">
          {/* Selection Checkbox */}
          <div className="flex-shrink-0 pt-1">
            <Checkbox
              checked={selected}
              onCheckedChange={onSelect}
              className="h-5 w-5"
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {business.name}
                  </h3>
                  {business.verified && (
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  )}
                  {isOpenNow() && (
                    <Badge variant="success" className="ml-2">
                      <Clock className="h-3 w-3 mr-1" />
                      Open Now
                    </Badge>
                  )}
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {business.categories.map((category, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className={cn("h-4 w-4 fill-current", getRatingColor(business.rating))} />
                    <span className={cn("font-semibold", getRatingColor(business.rating))}>
                      {business.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">
                      {business.review_count} reviews
                    </span>
                  </div>
                  {showDistance && business.distance_km && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">
                        {business.distance_km.toFixed(1)} km away
                      </span>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{business.address}</span>
                  </div>
                  {business.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <a 
                        href={`tel:${business.phone}`}
                        className="hover:text-primary-600 truncate"
                      >
                        {business.phone}
                      </a>
                    </div>
                  )}
                  {business.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <a 
                        href={`mailto:${business.email}`}
                        className="hover:text-primary-600 truncate"
                      >
                        {business.email}
                      </a>
                    </div>
                  )}
                  {business.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 flex-shrink-0" />
                      <a 
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary-600 truncate flex items-center gap-1"
                      >
                        Website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Description */}
                {business.description && (
                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                    {business.description}
                  </p>
                )}
              </div>

              {/* Opportunity Score */}
              <div className="flex-shrink-0">
                <div className="text-center">
                  <div className={cn(
                    "inline-flex flex-col items-center justify-center w-20 h-20 rounded-full border-2",
                    getScoreColor(opportunityScore)
                  )}>
                    <TrendingUp className="h-4 w-4 mb-1" />
                    <span className="text-xl font-bold">{opportunityScore}</span>
                    <span className="text-xs">Score</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">Opportunity</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-4 border-t flex gap-2">
              <Button size="sm" variant="outline">
                View Details
              </Button>
              <Button size="sm" variant="outline">
                Quick Analysis
              </Button>
              <Button size="sm">
                Generate Proposal
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
