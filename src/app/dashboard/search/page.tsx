'use client'

import React, { useState } from 'react'
import { Search, MapPin, Filter, Building2, Phone, Globe, Star, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import toast from 'react-hot-toast'
import apiService from '@/services/api'

interface Business {
  id: string
  name: string
  address: string
  city: string
  state: string
  phone?: string
  website?: string
  rating?: number
  total_reviews?: number
  business_category?: string
  has_website?: boolean
}

export default function SearchLeadsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [radius, setRadius] = useState('5000')
  const [isLoading, setIsLoading] = useState(false)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim() || !location.trim()) {
      toast.error('Please enter both search query and location')
      return
    }

    setIsLoading(true)
    try {
      const results = await apiService.searchBusinesses(searchQuery, location, parseInt(radius))
      setBusinesses(results.businesses || [])
      setHasSearched(true)
      toast.success(`Found ${results.businesses?.length || 0} businesses`)
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Failed to search businesses')
      setBusinesses([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Search Leads</h2>
        <p className="text-muted-foreground">
          Find new businesses to add to your lead pipeline
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Business Search</span>
          </CardTitle>
          <CardDescription>
            Search for businesses by industry, service, or business type
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search-query">Search Query</Label>
              <Input
                id="search-query"
                placeholder="e.g., restaurants, dentists, plumbers"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="e.g., San Francisco, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="space-y-2">
              <Label htmlFor="radius">Search Radius</Label>
              <Select value={radius} onValueChange={setRadius}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1000">1 km</SelectItem>
                  <SelectItem value="2000">2 km</SelectItem>
                  <SelectItem value="5000">5 km</SelectItem>
                  <SelectItem value="10000">10 km</SelectItem>
                  <SelectItem value="25000">25 km</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1" />
            <Button 
              onClick={handleSearch} 
              disabled={isLoading}
              className="mt-6"
            >
              {isLoading ? 'Searching...' : 'Search Businesses'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {hasSearched && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Search Results</span>
              </div>
              <Badge variant="secondary">
                {businesses.length} found
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {businesses.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No businesses found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search query or location
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {businesses.map((business) => (
                  <Card key={business.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{business.name}</h3>
                          <p className="text-muted-foreground flex items-center mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {business.address}, {business.city}, {business.state}
                          </p>
                          
                          <div className="flex items-center space-x-4 mt-2">
                            {business.phone && (
                              <span className="flex items-center text-sm text-muted-foreground">
                                <Phone className="h-4 w-4 mr-1" />
                                {business.phone}
                              </span>
                            )}
                            {business.website && (
                              <span className="flex items-center text-sm text-primary">
                                <Globe className="h-4 w-4 mr-1" />
                                Website
                              </span>
                            )}
                            {business.rating && (
                              <span className="flex items-center text-sm">
                                <Star className="h-4 w-4 mr-1 text-yellow-500 fill-current" />
                                {business.rating} ({business.total_reviews} reviews)
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 mt-2">
                            {business.business_category && (
                              <Badge variant="outline">{business.business_category}</Badge>
                            )}
                            {!business.has_website && (
                              <Badge variant="destructive">No Website</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Analyze
                          </Button>
                          <Button size="sm">
                            Add to Campaign
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
