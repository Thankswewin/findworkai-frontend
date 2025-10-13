import React, { useState } from 'react'
import { 
  Star, Clock, CheckCircle, MapPin, Building2, 
  RotateCcw, ChevronDown, ChevronUp 
} from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface FilterPanelProps {
  filters: any
  onFilterChange: (key: string, value: any) => void
  onMultipleChanges: (changes: any) => void
  onReset: () => void
}

// Popular business categories
const CATEGORIES = [
  'Restaurant',
  'Retail',
  'Healthcare',
  'Professional Services',
  'Beauty & Spa',
  'Fitness',
  'Automotive',
  'Real Estate',
  'Education',
  'Entertainment',
  'Home Services',
  'Technology',
  'Finance',
  'Legal',
  'Manufacturing',
  'Construction',
  'Food & Beverage',
  'Hotel & Lodging',
]

export default function FilterPanel({ 
  filters, 
  onFilterChange, 
  onMultipleChanges,
  onReset 
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    rating: true,
    reviews: false,
    location: false,
    hours: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleCategoryToggle = (category: string) => {
    const currentCategories = filters.categories || []
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter((c: string) => c !== category)
      : [...currentCategories, category]
    onFilterChange('categories', newCategories)
  }

  const handleRatingChange = (values: number[]) => {
    onMultipleChanges({
      rating_min: values[0],
      rating_max: values[1]
    })
  }

  const handleReviewCountChange = (values: number[]) => {
    onMultipleChanges({
      review_count_min: values[0],
      review_count_max: values[1]
    })
  }

  const handleRadiusChange = (values: number[]) => {
    onFilterChange('radius_km', values[0])
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-gray-500 hover:text-gray-700"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-250px)]">
        <div className="p-4 space-y-6">
          {/* Categories */}
          <Collapsible
            open={expandedSections.categories}
            onOpenChange={() => toggleSection('categories')}
          >
            <CollapsibleTrigger className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Categories</span>
                {filters.categories && filters.categories.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {filters.categories.length}
                  </Badge>
                )}
              </div>
              {expandedSections.categories ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(category => (
                  <label
                    key={category}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories?.includes(category) || false}
                      onChange={() => handleCategoryToggle(category)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Rating Filter */}
          <Collapsible
            open={expandedSections.rating}
            onOpenChange={() => toggleSection('rating')}
          >
            <CollapsibleTrigger className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Rating</span>
                {(filters.rating_min || filters.rating_max) && (
                  <Badge variant="secondary" className="ml-2">
                    {filters.rating_min || 0} - {filters.rating_max || 5}
                  </Badge>
                )}
              </div>
              {expandedSections.rating ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{filters.rating_min || 0} ★</span>
                  <span>{filters.rating_max || 5} ★</span>
                </div>
                <Slider
                  value={[filters.rating_min || 0, filters.rating_max || 5]}
                  min={0}
                  max={5}
                  step={0.5}
                  onValueChange={handleRatingChange}
                  className="w-full"
                />
                <div className="grid grid-cols-5 gap-1">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <Button
                      key={rating}
                      variant="outline"
                      size="sm"
                      onClick={() => handleRatingChange([rating, 5])}
                      className="text-xs"
                    >
                      {rating}★+
                    </Button>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Review Count Filter */}
          <Collapsible
            open={expandedSections.reviews}
            onOpenChange={() => toggleSection('reviews')}
          >
            <CollapsibleTrigger className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                <span className="font-medium">Review Count</span>
                {(filters.review_count_min || filters.review_count_max) && (
                  <Badge variant="secondary" className="ml-2">
                    {filters.review_count_min || 0} - {filters.review_count_max || '∞'}
                  </Badge>
                )}
              </div>
              {expandedSections.reviews ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="review-min" className="text-xs">Minimum</Label>
                    <Input
                      id="review-min"
                      type="number"
                      value={filters.review_count_min || ''}
                      onChange={(e) => onFilterChange('review_count_min', e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="review-max" className="text-xs">Maximum</Label>
                    <Input
                      id="review-max"
                      type="number"
                      value={filters.review_count_max || ''}
                      onChange={(e) => onFilterChange('review_count_max', e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="∞"
                      min="0"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFilterChange('review_count_min', 50)}
                    className="text-xs"
                  >
                    50+
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFilterChange('review_count_min', 100)}
                    className="text-xs"
                  >
                    100+
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFilterChange('review_count_min', 500)}
                    className="text-xs"
                  >
                    500+
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Business Hours */}
          <Collapsible
            open={expandedSections.hours}
            onOpenChange={() => toggleSection('hours')}
          >
            <CollapsibleTrigger className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Business Hours</span>
              </div>
              {expandedSections.hours ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="open-now" className="text-sm">Open Now</Label>
                  <Switch
                    id="open-now"
                    checked={filters.open_now || false}
                    onCheckedChange={(checked) => onFilterChange('open_now', checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="open-at" className="text-sm">Open at specific time</Label>
                  <Input
                    id="open-at"
                    type="datetime-local"
                    value={filters.open_at || ''}
                    onChange={(e) => onFilterChange('open_at', e.target.value || undefined)}
                    className="mt-1"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Location Filter */}
          <Collapsible
            open={expandedSections.location}
            onOpenChange={() => toggleSection('location')}
          >
            <CollapsibleTrigger className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Location</span>
                {filters.radius_km && (
                  <Badge variant="secondary" className="ml-2">
                    {filters.radius_km} km
                  </Badge>
                )}
              </div>
              {expandedSections.location ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="radius" className="text-sm">
                    Search Radius: {filters.radius_km || 10} km
                  </Label>
                  <Slider
                    id="radius"
                    value={[filters.radius_km || 10]}
                    min={1}
                    max={50}
                    step={1}
                    onValueChange={handleRadiusChange}
                    className="mt-2"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFilterChange('radius_km', 5)}
                    className="text-xs"
                  >
                    5 km
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFilterChange('radius_km', 10)}
                    className="text-xs"
                  >
                    10 km
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFilterChange('radius_km', 25)}
                    className="text-xs"
                  >
                    25 km
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Other Filters */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Other Filters</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="verified" className="text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-gray-500" />
                Verified Businesses Only
              </Label>
              <Switch
                id="verified"
                checked={filters.verified || false}
                onCheckedChange={(checked) => onFilterChange('verified', checked)}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
