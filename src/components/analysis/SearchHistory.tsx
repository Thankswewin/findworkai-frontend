'use client'

import React, { useState } from 'react'
import { format, formatDistanceToNow } from 'date-fns'
import {
  Search,
  Clock,
  TrendingUp,
  MapPin,
  Filter,
  Download,
  Trash2,
  Eye,
  MoreVertical,
  Calendar,
  Building,
  Hash,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface SearchHistoryItem {
  id: string
  query: string
  location: string
  category?: string
  resultsCount: number
  timestamp: Date
  status: 'completed' | 'in-progress' | 'failed'
  avgOpportunityScore?: number
  businesses?: {
    id: string
    name: string
    opportunityScore: number
    analyzed: boolean
  }[]
}

interface SearchHistoryProps {
  history: SearchHistoryItem[]
  onSelectSearch: (search: SearchHistoryItem) => void
  onDeleteSearch: (id: string) => void
  onRerunSearch: (search: SearchHistoryItem) => void
  onExportHistory: () => void
}

export function SearchHistory({
  history,
  onSelectSearch,
  onDeleteSearch,
  onRerunSearch,
  onExportHistory
}: SearchHistoryProps) {
  const [searchFilter, setSearchFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'score' | 'results'>('recent')

  // Filter and sort history
  const filteredHistory = history
    .filter(item => {
      const matchesSearch = item.query.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchFilter.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return (b.avgOpportunityScore || 0) - (a.avgOpportunityScore || 0)
        case 'results':
          return b.resultsCount - a.resultsCount
        default:
          return b.timestamp.getTime() - a.timestamp.getTime()
      }
    })

  // Get unique categories
  const categories = Array.from(new Set(history.map(item => item.category).filter(Boolean)))

  // Calculate statistics
  const stats = {
    totalSearches: history.length,
    totalBusinessesFound: history.reduce((acc, item) => acc + item.resultsCount, 0),
    avgOpportunityScore: Math.round(
      history.reduce((acc, item) => acc + (item.avgOpportunityScore || 0), 0) / history.length
    ),
    mostSearchedCategory: categories.reduce((prev, current) => {
      const prevCount = history.filter(item => item.category === prev).length
      const currentCount = history.filter(item => item.category === current).length
      return currentCount > prevCount ? current : prev
    }, categories[0])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSearches}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Businesses Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBusinessesFound}</div>
            <p className="text-xs text-muted-foreground mt-1">Total discovered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg. Opportunity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(stats.avgOpportunityScore)}`}>
              {stats.avgOpportunityScore}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Average score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">{stats.mostSearchedCategory || 'N/A'}</div>
            <p className="text-xs text-muted-foreground mt-1">Most searched</p>
          </CardContent>
        </Card>
      </div>

      {/* Search History List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Search History</CardTitle>
              <CardDescription>View and manage your previous searches</CardDescription>
            </div>
            <Button onClick={onExportHistory} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search history..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category!}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="score">Highest Score</SelectItem>
                <SelectItem value="results">Most Results</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* History Items */}
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => onSelectSearch(item)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.query}</h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {item.location}
                              </span>
                              {item.category && (
                                <span className="flex items-center gap-1">
                                  <Building className="h-3 w-3" />
                                  {item.category}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                          <span className="text-sm">
                            <strong>{item.resultsCount}</strong> businesses found
                          </span>
                          {item.avgOpportunityScore && (
                            <span className={`text-sm font-medium ${getScoreColor(item.avgOpportunityScore)}`}>
                              Avg. Score: {item.avgOpportunityScore}%
                            </span>
                          )}
                        </div>

                        {/* Quick Stats for Analyzed Businesses */}
                        {item.businesses && item.businesses.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {item.businesses.slice(0, 3).map((business) => (
                              <Badge key={business.id} variant="secondary" className="text-xs">
                                {business.name.length > 15 
                                  ? business.name.substring(0, 15) + '...' 
                                  : business.name}
                                {business.analyzed && (
                                  <span className={`ml-1 ${getScoreColor(business.opportunityScore)}`}>
                                    {business.opportunityScore}%
                                  </span>
                                )}
                              </Badge>
                            ))}
                            {item.businesses.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{item.businesses.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            onSelectSearch(item)
                          }}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            onRerunSearch(item)
                          }}>
                            <Search className="mr-2 h-4 w-4" />
                            Run Again
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeleteSearch(item.id)
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No search history found
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
