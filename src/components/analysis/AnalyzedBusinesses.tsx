'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Building,
  MapPin,
  Globe,
  Mail,
  Phone,
  Star,
  Filter,
  Download,
  Eye,
  MoreVertical,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertCircle,
  XCircle,
  BarChart3,
  Bookmark,
  Share2,
  ExternalLink
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
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
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface AnalyzedBusiness {
  id: string
  name: string
  category: string
  location: string
  website?: string
  email?: string
  phone?: string
  rating?: number
  reviews?: number
  opportunityScore: number
  weaknesses: string[]
  strengths: string[]
  analyzedAt: Date
  lastUpdated: Date
  status: 'active' | 'contacted' | 'converted' | 'lost'
  notes?: string
  tags?: string[]
  digitalPresence: {
    website: boolean
    seo: number
    socialMedia: number
    reviews: number
  }
}

interface AnalyzedBusinessesProps {
  businesses: AnalyzedBusiness[]
  onViewBusiness: (business: AnalyzedBusiness) => void
  onUpdateStatus: (id: string, status: string) => void
  onExportData: () => void
  onAddNote: (id: string, note: string) => void
}

export function AnalyzedBusinesses({
  businesses,
  onViewBusiness,
  onUpdateStatus,
  onExportData,
  onAddNote
}: AnalyzedBusinessesProps) {
  const [searchFilter, setSearchFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'score' | 'recent' | 'name'>('score')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Filter and sort businesses
  const filteredBusinesses = businesses
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchFilter.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.opportunityScore - a.opportunityScore
        case 'recent':
          return b.analyzedAt.getTime() - a.analyzedAt.getTime()
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  // Get unique categories
  const categories = Array.from(new Set(businesses.map(item => item.category)))

  // Calculate statistics
  const stats = {
    total: businesses.length,
    avgScore: Math.round(
      businesses.reduce((acc, item) => acc + item.opportunityScore, 0) / businesses.length
    ),
    contacted: businesses.filter(b => b.status === 'contacted').length,
    converted: businesses.filter(b => b.status === 'converted').length,
    highOpportunity: businesses.filter(b => b.opportunityScore >= 70).length
  }

  // Chart data for opportunity score distribution
  const scoreDistribution = {
    labels: ['0-20', '21-40', '41-60', '61-80', '81-100'],
    datasets: [{
      label: 'Businesses',
      data: [
        businesses.filter(b => b.opportunityScore <= 20).length,
        businesses.filter(b => b.opportunityScore > 20 && b.opportunityScore <= 40).length,
        businesses.filter(b => b.opportunityScore > 40 && b.opportunityScore <= 60).length,
        businesses.filter(b => b.opportunityScore > 60 && b.opportunityScore <= 80).length,
        businesses.filter(b => b.opportunityScore > 80).length,
      ],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1
    }]
  }

  // Chart data for status breakdown
  const statusBreakdown = {
    labels: ['Active', 'Contacted', 'Converted', 'Lost'],
    datasets: [{
      label: 'Status',
      data: [
        businesses.filter(b => b.status === 'active').length,
        businesses.filter(b => b.status === 'contacted').length,
        businesses.filter(b => b.status === 'converted').length,
        businesses.filter(b => b.status === 'lost').length,
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ]
    }]
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { color: 'bg-green-100 text-green-800', icon: CheckCircle }
    if (score >= 60) return { color: 'bg-yellow-100 text-yellow-800', icon: TrendingUp }
    if (score >= 40) return { color: 'bg-orange-100 text-orange-800', icon: AlertCircle }
    return { color: 'bg-red-100 text-red-800', icon: XCircle }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800'
      case 'contacted':
        return 'bg-orange-100 text-orange-800'
      case 'converted':
        return 'bg-green-100 text-green-800'
      case 'lost':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Analyzed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Businesses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(stats.avgScore)}`}>
              {stats.avgScore}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Opportunity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">High Potential</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.highOpportunity}</div>
            <p className="text-xs text-muted-foreground mt-1">Score 70+</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Contacted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.contacted}</div>
            <p className="text-xs text-muted-foreground mt-1">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Converted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.converted}</div>
            <p className="text-xs text-muted-foreground mt-1">Success</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <Bar 
                data={scoreDistribution} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <Bar 
                data={statusBreakdown} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  indexAxis: 'y',
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Analyzed Businesses</CardTitle>
              <CardDescription>Manage and track your analyzed businesses</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={onExportData} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search businesses..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Highest Score</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Business Grid/List */}
          <ScrollArea className="h-[600px]">
            <div className={viewMode === 'grid' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
              {filteredBusinesses.map((business) => {
                const scoreBadge = getScoreBadge(business.opportunityScore)
                const ScoreIcon = scoreBadge.icon
                
                return (
                  <motion.div
                    key={business.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                  >
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onViewBusiness(business)}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base line-clamp-1">{business.name}</CardTitle>
                            <CardDescription className="text-xs mt-1">
                              {business.category} • {business.location}
                            </CardDescription>
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
                                onViewBusiness(business)
                              }}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation()
                                onUpdateStatus(business.id, 'contacted')
                              }}>
                                Mark as Contacted
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation()
                                onUpdateStatus(business.id, 'converted')
                              }}>
                                Mark as Converted
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Score Display */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <ScoreIcon className={`h-5 w-5 ${getScoreColor(business.opportunityScore)}`} />
                            <span className={`text-2xl font-bold ${getScoreColor(business.opportunityScore)}`}>
                              {business.opportunityScore}%
                            </span>
                          </div>
                          <Badge className={getStatusColor(business.status)}>
                            {business.status}
                          </Badge>
                        </div>

                        {/* Digital Presence Indicators */}
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="text-xs">
                            <span className="text-muted-foreground">Website:</span>
                            <span className="ml-1 font-medium">
                              {business.digitalPresence.website ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div className="text-xs">
                            <span className="text-muted-foreground">SEO:</span>
                            <span className="ml-1 font-medium">{business.digitalPresence.seo}%</span>
                          </div>
                          <div className="text-xs">
                            <span className="text-muted-foreground">Social:</span>
                            <span className="ml-1 font-medium">{business.digitalPresence.socialMedia}%</span>
                          </div>
                          <div className="text-xs">
                            <span className="text-muted-foreground">Reviews:</span>
                            <span className="ml-1 font-medium">{business.reviews || 0}</span>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="flex gap-2">
                          {business.website && (
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <Globe className="h-3 w-3" />
                            </Button>
                          )}
                          {business.email && (
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <Mail className="h-3 w-3" />
                            </Button>
                          )}
                          {business.phone && (
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <Phone className="h-3 w-3" />
                            </Button>
                          )}
                        </div>

                        {/* Tags */}
                        {business.tags && business.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {business.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
