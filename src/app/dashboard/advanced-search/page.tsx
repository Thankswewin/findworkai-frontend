'use client'

import React, { useState } from 'react'
import { Filter, Search, Save, Star, Building2, MapPin, Globe, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import toast from 'react-hot-toast'

export default function AdvancedSearchPage() {
  const [filters, setFilters] = useState({
    query: '',
    location: '',
    categories: [] as string[],
    ratingRange: [0, 5] as [number, number],
    reviewRange: [0, 500] as [number, number],
    hasWebsite: null as boolean | null,
    hasPhone: null as boolean | null,
    hasEmail: null as boolean | null,
    radius: 5000
  })

  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [savedSearches] = useState([
    { id: '1', name: 'Local Restaurants', query: 'restaurant', location: 'San Francisco', count: 45 },
    { id: '2', name: 'Auto Repair Shops', query: 'auto repair', location: 'Bay Area', count: 23 },
    { id: '3', name: 'Dental Practices', query: 'dentist', location: 'California', count: 67 }
  ])

  const categories = [
    'Restaurant', 'Retail', 'Healthcare', 'Professional Services',
    'Auto Services', 'Beauty & Wellness', 'Home Services', 'Technology',
    'Education', 'Entertainment', 'Real Estate', 'Manufacturing'
  ]

  const handleSearch = async () => {
    setIsSearching(true)
    // Simulate search
    setTimeout(() => {
      const mockResults = [
        {
          id: '1',
          name: 'Giuseppe\'s Italian Restaurant',
          category: 'Restaurant',
          rating: 4.2,
          reviews: 156,
          hasWebsite: true,
          hasPhone: true,
          address: '123 Main St, San Francisco, CA',
          phone: '(555) 123-4567'
        },
        {
          id: '2',
          name: 'Quick Fix Auto Repair',
          category: 'Auto Services',
          rating: 3.8,
          reviews: 89,
          hasWebsite: false,
          hasPhone: true,
          address: '456 Oak Ave, San Francisco, CA',
          phone: '(555) 987-6543'
        }
      ]
      setResults(mockResults)
      setIsSearching(false)
      toast.success(`Found ${mockResults.length} businesses`)
    }, 1500)
  }

  const saveSearch = () => {
    toast.success('Search saved successfully!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Advanced Search</h2>
        <p className="text-muted-foreground">
          Use advanced filters to find your ideal business prospects
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Saved Searches */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Saved Searches</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {savedSearches.map((search) => (
                <div key={search.id} className="p-2 border rounded-lg cursor-pointer hover:bg-muted">
                  <p className="font-medium text-sm">{search.name}</p>
                  <p className="text-xs text-muted-foreground">{search.query} in {search.location}</p>
                  <Badge variant="secondary" className="mt-1 text-xs">{search.count} results</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Search Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Search Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Basic Search */}
              <div className="space-y-2">
                <Label>Search Query</Label>
                <Input
                  placeholder="e.g., restaurants, dentists"
                  value={filters.query}
                  onChange={(e) => setFilters({...filters, query: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="e.g., San Francisco, CA"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                />
              </div>

              <Separator />

              {/* Categories */}
              <div className="space-y-2">
                <Label>Business Categories</Label>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={category}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilters({...filters, categories: [...filters.categories, category]})
                          } else {
                            setFilters({...filters, categories: filters.categories.filter(c => c !== category)})
                          }
                        }}
                      />
                      <Label htmlFor={category} className="text-sm">{category}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Rating Range */}
              <div className="space-y-2">
                <Label>Rating Range</Label>
                <Slider
                  value={filters.ratingRange}
                  onValueChange={(value) => setFilters({...filters, ratingRange: value as [number, number]})}
                  max={5}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{filters.ratingRange[0]}⭐</span>
                  <span>{filters.ratingRange[1]}⭐</span>
                </div>
              </div>

              {/* Review Count */}
              <div className="space-y-2">
                <Label>Review Count</Label>
                <Slider
                  value={filters.reviewRange}
                  onValueChange={(value) => setFilters({...filters, reviewRange: value as [number, number]})}
                  max={500}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{filters.reviewRange[0]}</span>
                  <span>{filters.reviewRange[1]}+</span>
                </div>
              </div>

              <Separator />

              {/* Digital Presence */}
              <div className="space-y-3">
                <Label>Digital Presence</Label>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={filters.hasWebsite === true}
                      onCheckedChange={(checked) => 
                        setFilters({...filters, hasWebsite: checked ? true : null})
                      }
                    />
                    <Label className="text-sm">Has Website</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={filters.hasWebsite === false}
                      onCheckedChange={(checked) => 
                        setFilters({...filters, hasWebsite: checked ? false : null})
                      }
                    />
                    <Label className="text-sm">No Website</Label>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSearch} disabled={isSearching} className="flex-1">
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
                <Button variant="outline" size="icon" onClick={saveSearch}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Search Results</span>
                </div>
                {results.length > 0 && (
                  <Badge variant="secondary">{results.length} found</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <div className="text-center py-12">
                  <Filter className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Start Your Advanced Search</h3>
                  <p className="text-muted-foreground mb-4">
                    Use the filters on the left to find businesses that match your criteria
                  </p>
                  <Button onClick={handleSearch} disabled={!filters.query}>
                    <Search className="mr-2 h-4 w-4" />
                    Search Now
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((business) => (
                    <Card key={business.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{business.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              {business.address}
                            </p>
                            
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="text-sm">{business.rating}</span>
                                <span className="text-xs text-muted-foreground">({business.reviews} reviews)</span>
                              </div>
                              
                              {business.hasPhone && (
                                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                  <Phone className="h-4 w-4" />
                                  <span>{business.phone}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline">{business.category}</Badge>
                              {business.hasWebsite ? (
                                <Badge variant="default" className="flex items-center space-x-1">
                                  <Globe className="h-3 w-3" />
                                  <span>Website</span>
                                </Badge>
                              ) : (
                                <Badge variant="destructive">No Website</Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-2">
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
        </div>
      </div>
    </div>
  )
}
