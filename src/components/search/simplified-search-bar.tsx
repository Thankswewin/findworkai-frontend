'use client'

import React, { useState } from 'react'
import { Search, MapPin, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SimplifiedSearchBarProps {
  onSearch: (query: string, location: string) => void
  isLoading?: boolean
}

export default function SimplifiedSearchBar({ onSearch, isLoading }: SimplifiedSearchBarProps) {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [focused, setFocused] = useState<'query' | 'location' | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && location.trim()) {
      onSearch(query.trim(), location.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 transition-all hover:shadow-md">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Business Type Input */}
          <div className="flex-1">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              focused === 'query' ? 'bg-blue-50 ring-2 ring-blue-500' : 'bg-gray-50'
            }`}>
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Business type (e.g., restaurants, dentists)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused('query')}
                onBlur={() => setFocused(null)}
                className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Location Input */}
          <div className="flex-1 sm:max-w-xs">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              focused === 'location' ? 'bg-blue-50 ring-2 ring-blue-500' : 'bg-gray-50'
            }`}>
              <MapPin className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="City or ZIP code"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setFocused('location')}
                onBlur={() => setFocused(null)}
                className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Search Button */}
          <Button
            type="submit"
            disabled={isLoading || !query.trim() || !location.trim()}
            className="px-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Quick Search Suggestions */}
      {!query && !location && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-sm text-gray-500">Popular searches:</span>
          <button
            type="button"
            onClick={() => {
              setQuery('restaurants')
              setLocation('New York')
            }}
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            Restaurants in New York
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery('dental clinics')
              setLocation('Los Angeles')
            }}
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            Dental Clinics in LA
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery('law firms')
              setLocation('Chicago')
            }}
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
          >
            Law Firms in Chicago
          </button>
        </div>
      )}
    </form>
  )
}
