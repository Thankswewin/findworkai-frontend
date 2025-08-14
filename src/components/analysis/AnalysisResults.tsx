'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  Globe,
  Mail,
  Phone,
  MapPin,
  Star,
  Users,
  DollarSign,
  Target,
  Zap,
  Award,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Calendar,
  Download,
  Share2,
  Bookmark,
  ChevronRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Doughnut, Bar, Line, Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  ChartTooltip,
  Legend,
  Filler
)

interface AnalysisResultsProps {
  business: {
    name: string
    category: string
    address: string
    phone?: string
    website?: string
    email?: string
    rating?: number
    reviews?: number
  }
  analysis: {
    opportunityScore: number
    weaknesses: string[]
    strengths: string[]
    recommendations: string[]
    marketPosition: 'leader' | 'challenger' | 'follower' | 'niche'
    digitalPresence: {
      website: boolean
      seo: number
      socialMedia: number
      reviews: number
    }
    competitorAnalysis?: {
      totalCompetitors: number
      marketShare: number
      advantages: string[]
    }
  }
  onSave?: () => void
  onExport?: () => void
  onShare?: () => void
}

export function AnalysisResults({ business, analysis, onSave, onExport, onShare }: AnalysisResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500'
    if (score >= 60) return 'from-yellow-500 to-amber-500'
    if (score >= 40) return 'from-orange-500 to-red-500'
    return 'from-red-600 to-rose-600'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 80) return { text: 'Excellent Opportunity!', icon: CheckCircle }
    if (score >= 60) return { text: 'Good Potential', icon: TrendingUp }
    if (score >= 40) return { text: 'Needs Improvement', icon: AlertCircle }
    return { text: 'High Risk', icon: XCircle }
  }

  const scoreMessage = getScoreMessage(analysis.opportunityScore)
  const ScoreIcon = scoreMessage.icon

  // Chart configurations
  const digitalPresenceData = {
    labels: ['Website', 'SEO', 'Social Media', 'Reviews'],
    datasets: [{
      label: 'Digital Presence Score',
      data: [
        analysis.digitalPresence.website ? 100 : 0,
        analysis.digitalPresence.seo,
        analysis.digitalPresence.socialMedia,
        analysis.digitalPresence.reviews
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(168, 85, 247, 0.8)'
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(251, 146, 60)',
        'rgb(168, 85, 247)'
      ],
      borderWidth: 2
    }]
  }

  const radarData = {
    labels: ['Digital Presence', 'Market Position', 'Customer Satisfaction', 'Growth Potential', 'Competition'],
    datasets: [{
      label: business.name,
      data: [
        (analysis.digitalPresence.seo + analysis.digitalPresence.socialMedia + analysis.digitalPresence.reviews) / 3,
        analysis.marketPosition === 'leader' ? 90 : analysis.marketPosition === 'challenger' ? 70 : 50,
        business.rating ? business.rating * 20 : 50,
        analysis.opportunityScore,
        analysis.competitorAnalysis ? (100 - analysis.competitorAnalysis.marketShare) : 60
      ],
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgb(59, 130, 246)',
      pointBackgroundColor: 'rgb(59, 130, 246)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(59, 130, 246)'
    }]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Score */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white"
      >
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div>
                <h2 className="text-3xl font-bold">{business.name}</h2>
                <p className="mt-1 text-slate-300">{business.category}</p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {business.address && (
                  <Badge variant="secondary" className="gap-1">
                    <MapPin className="h-3 w-3" />
                    {business.address}
                  </Badge>
                )}
                {business.rating && (
                  <Badge variant="secondary" className="gap-1">
                    <Star className="h-3 w-3" />
                    {business.rating} ({business.reviews} reviews)
                  </Badge>
                )}
                {business.website && (
                  <Badge variant="secondary" className="gap-1">
                    <Globe className="h-3 w-3" />
                    Website
                  </Badge>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2">
                <ScoreIcon className={`h-8 w-8 ${getScoreColor(analysis.opportunityScore)}`} />
                <div>
                  <div className={`text-5xl font-bold ${getScoreColor(analysis.opportunityScore)}`}>
                    {analysis.opportunityScore}%
                  </div>
                  <p className="text-sm text-slate-300">Opportunity Score</p>
                </div>
              </div>
              <p className="mt-2 text-lg font-semibold">{scoreMessage.text}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <Button onClick={onSave} variant="secondary" size="sm">
              <Bookmark className="mr-2 h-4 w-4" />
              Save Analysis
            </Button>
            <Button onClick={onExport} variant="secondary" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button onClick={onShare} variant="secondary" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Analysis Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="digital">Digital Analysis</TabsTrigger>
          <TabsTrigger value="competition">Competition</TabsTrigger>
          <TabsTrigger value="recommendations">Action Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Strengths Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <ChevronRight className="h-4 w-4 mt-0.5 text-green-600" />
                      <span className="text-sm">{strength}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Weaknesses Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((weakness, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <ChevronRight className="h-4 w-4 mt-0.5 text-orange-600" />
                      <span className="text-sm">{weakness}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Business Performance Radar */}
          <Card>
            <CardHeader>
              <CardTitle>Business Performance Analysis</CardTitle>
              <CardDescription>Multi-dimensional performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Radar data={radarData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="digital" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Digital Presence Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Digital Presence Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <Doughnut data={digitalPresenceData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>

            {/* Digital Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Digital Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Website Status</span>
                    <span className="text-sm">
                      {analysis.digitalPresence.website ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge variant="destructive">Missing</Badge>
                      )}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">SEO Score</span>
                    <span className="text-sm font-bold">{analysis.digitalPresence.seo}%</span>
                  </div>
                  <Progress value={analysis.digitalPresence.seo} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Social Media Presence</span>
                    <span className="text-sm font-bold">{analysis.digitalPresence.socialMedia}%</span>
                  </div>
                  <Progress value={analysis.digitalPresence.socialMedia} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Review Management</span>
                    <span className="text-sm font-bold">{analysis.digitalPresence.reviews}%</span>
                  </div>
                  <Progress value={analysis.digitalPresence.reviews} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="competition" className="space-y-4">
          {analysis.competitorAnalysis ? (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Total Competitors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{analysis.competitorAnalysis.totalCompetitors}</div>
                    <p className="text-xs text-muted-foreground mt-1">In your market area</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Market Share</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{analysis.competitorAnalysis.marketShare}%</div>
                    <p className="text-xs text-muted-foreground mt-1">Current position</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Market Position</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      {analysis.marketPosition.charAt(0).toUpperCase() + analysis.marketPosition.slice(1)}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Competitive Advantages</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.competitorAnalysis.advantages.map((advantage, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Award className="h-4 w-4 mt-0.5 text-blue-600" />
                        <span className="text-sm">{advantage}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Competitor analysis not available for this business
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Recommended Actions
              </CardTitle>
              <CardDescription>
                Prioritized steps to improve your opportunity score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.recommendations.map((recommendation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-4 rounded-lg border bg-muted/50"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{recommendation}</p>
                      <div className="mt-2 flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="mr-1 h-3 w-3" />
                          {index === 0 ? 'High Priority' : index === 1 ? 'Medium Priority' : 'Low Priority'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Zap className="mr-1 h-3 w-3" />
                          {index === 0 ? 'Quick Win' : 'Long-term'}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Ready to improve this business?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get personalized consulting and implementation support
                  </p>
                </div>
                <Button>
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
