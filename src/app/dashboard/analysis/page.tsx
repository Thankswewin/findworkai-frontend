'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Brain, Target, TrendingUp, AlertTriangle, Lightbulb, Building2, Zap, Sparkles, Globe, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import toast from 'react-hot-toast'

export default function AnalysisPage() {
  const router = useRouter()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any>(null)

  const sampleBusinesses = [
    {
      id: '1',
      name: 'Downtown Pizza Palace',
      category: 'Restaurant',
      rating: 3.2,
      reviews: 45,
      hasWebsite: false,
      city: 'San Francisco'
    },
    {
      id: '2', 
      name: 'Bay Area Auto Repair',
      category: 'Auto Service',
      rating: 4.1,
      reviews: 23,
      hasWebsite: true,
      city: 'Oakland'
    },
    {
      id: '3',
      name: 'Sunset Dental Care',
      category: 'Healthcare',
      rating: 2.8,
      reviews: 12,
      hasWebsite: false,
      city: 'San Francisco'
    }
  ]

  const runSampleAnalysis = async () => {
    setIsAnalyzing(true)
    // Simulate API call
    setTimeout(() => {
      setAnalysisResults({
        totalAnalyzed: 3,
        opportunityScore: 85,
        topWeaknesses: [
          { type: 'No Website', count: 2, impact: 'High' },
          { type: 'Low Rating', count: 1, impact: 'Medium' },
          { type: 'Few Reviews', count: 1, impact: 'Medium' }
        ],
        recommendations: [
          'Target businesses without websites for web design services',
          'Focus on restaurants with ratings below 3.5',
          'Offer reputation management to businesses with few reviews'
        ],
        priorityLeads: sampleBusinesses.filter(b => !b.hasWebsite || b.rating < 3.5)
      })
      setIsAnalyzing(false)
      toast.success('Analysis completed!')
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Analysis</h2>
        <p className="text-muted-foreground">
          Discover business insights and opportunities using AI-powered analysis
        </p>
      </div>

      {/* Analysis Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Business Analysis</span>
          </CardTitle>
          <CardDescription>
            Analyze your lead database to identify high-opportunity prospects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-dashed">
                <CardContent className="p-4 text-center">
                  <Building2 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Sample Businesses</p>
                  <p className="text-2xl font-bold text-primary">{sampleBusinesses.length}</p>
                </CardContent>
              </Card>
              <Card className="border-dashed">
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Analysis Types</p>
                  <p className="text-2xl font-bold text-primary">5+</p>
                </CardContent>
              </Card>
              <Card className="border-dashed">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Success Rate</p>
                  <p className="text-2xl font-bold text-primary">94%</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={runSampleAnalysis} 
                disabled={isAnalyzing}
                size="lg"
                className="flex items-center space-x-2"
              >
                <Brain className="h-4 w-4" />
                <span>{isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResults && (
        <div className="space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Analysis Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Businesses Analyzed</p>
                  <p className="text-3xl font-bold text-primary">{analysisResults.totalAnalyzed}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Opportunity Score</p>
                  <p className="text-3xl font-bold text-green-600">{analysisResults.opportunityScore}%</p>
                  <Progress value={analysisResults.opportunityScore} className="mt-2" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Priority Leads</p>
                  <p className="text-3xl font-bold text-orange-600">{analysisResults.priorityLeads.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weaknesses Found */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Key Weaknesses Identified</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisResults.topWeaknesses.map((weakness: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`h-3 w-3 rounded-full ${
                        weakness.impact === 'High' ? 'bg-red-500' :
                        weakness.impact === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <span className="font-medium">{weakness.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={weakness.impact === 'High' ? 'destructive' : 'secondary'}>
                        {weakness.impact} Impact
                      </Badge>
                      <span className="text-sm text-muted-foreground">{weakness.count} businesses</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5" />
                <span>AI Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisResults.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {index + 1}
                    </div>
                    <p className="text-sm flex-1">{rec}</p>
                    <Button size="sm" variant="outline">
                      Apply
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Priority Leads */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>High-Priority Leads</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisResults.priorityLeads.map((lead: any) => (
                  <Card key={lead.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{lead.name}</h3>
                          <p className="text-sm text-muted-foreground">{lead.category} • {lead.city}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={lead.hasWebsite ? "secondary" : "destructive"}>
                              {lead.hasWebsite ? "Has Website" : "No Website"}
                            </Badge>
                            <Badge variant={lead.rating > 3.5 ? "secondary" : "destructive"}>
                              {lead.rating} ⭐
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Generate Email
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
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Agents Integration */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>AI Agents - Autonomous Solutions</span>
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">NEW</Badge>
          </CardTitle>
          <CardDescription>
            Take action on your analysis with autonomous AI agents that create complete business solutions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <Sparkles className="h-4 w-4" />
            <AlertTitle>Transform Analysis into Action</AlertTitle>
            <AlertDescription>
              Use the insights from your business analysis to automatically generate websites, marketing campaigns, and content with our AI agents.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="hover:shadow-md transition-all cursor-pointer" onClick={() => router.push('/dashboard/ai-agents')}>
              <CardContent className="p-4 text-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white mx-auto w-fit mb-3">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">Website Creator</h3>
                <p className="text-xs text-muted-foreground">Generate complete websites for businesses without online presence</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all cursor-pointer" onClick={() => router.push('/dashboard/ai-agents')}>
              <CardContent className="p-4 text-center">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white mx-auto w-fit mb-3">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">Marketing Suite</h3>
                <p className="text-xs text-muted-foreground">Create campaigns and promotional materials automatically</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all cursor-pointer" onClick={() => router.push('/dashboard/ai-agents')}>
              <CardContent className="p-4 text-center">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white mx-auto w-fit mb-3">
                  <Wand2 className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">Content Generator</h3>
                <p className="text-xs text-muted-foreground">Generate blogs, service descriptions, and marketing copy</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button 
              onClick={() => router.push('/dashboard/ai-agents')}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Explore AI Agents
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
