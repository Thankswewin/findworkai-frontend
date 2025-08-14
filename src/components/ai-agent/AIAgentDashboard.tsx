'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Sparkles, 
  Zap, 
  Code, 
  Mail, 
  TrendingUp, 
  FileText, 
  Globe,
  Loader2,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  Play,
  Pause,
  Settings,
  History,
  Target,
  Briefcase
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getAIAgent, GeneratedArtifact, AgentAction } from '@/lib/ai-agent'
import { Business } from '@/lib/google-places'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArtifactViewer } from './ArtifactViewer'

interface AIAgentDashboardProps {
  business?: Business
  apiKey?: string
  model?: string
}

export function AIAgentDashboard({ business, apiKey, model }: AIAgentDashboardProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState('')
  const [progress, setProgress] = useState(0)
  const [artifacts, setArtifacts] = useState<GeneratedArtifact[]>([])
  const [executionLog, setExecutionLog] = useState<AgentAction[]>([])
  const [selectedArtifact, setSelectedArtifact] = useState<GeneratedArtifact | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [useAdvancedViewer, setUseAdvancedViewer] = useState(true)

  // Auto-process when business is provided
  useEffect(() => {
    if (business && apiKey && !isProcessing) {
      handleProcessBusiness()
    }
  }, [business])

  const handleProcessBusiness = async () => {
    if (!business || !apiKey) {
      setError('Business data or API key missing')
      return
    }

    setIsProcessing(true)
    setError(null)
    setProgress(0)
    setArtifacts([])
    setExecutionLog([])

    try {
      const agent = getAIAgent(apiKey, { 
        model: model || 'openai/gpt-4-turbo-preview',
        siteUrl: window.location.origin,
        siteName: 'FindWorkAI'
      })
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90))
      }, 1000)

      setCurrentStep('Analyzing business opportunity...')
      
      const result = await agent.processBusinessAutomatically(business)
      
      clearInterval(progressInterval)
      setProgress(100)
      
      setArtifacts(result.generatedArtifacts)
      setExecutionLog(result.executionLog)
      setAnalysis(result.analysis)
      setCurrentStep('Complete! All artifacts generated.')
      
    } catch (err: any) {
      setError(err.message || 'Failed to process business')
      setCurrentStep('Error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  const getArtifactIcon = (type: string) => {
    switch (type) {
      case 'website': return <Globe className="w-5 h-5" />
      case 'campaign': return <TrendingUp className="w-5 h-5" />
      case 'email': return <Mail className="w-5 h-5" />
      case 'strategy': return <Target className="w-5 h-5" />
      case 'report': return <FileText className="w-5 h-5" />
      case 'social-media': return <Sparkles className="w-5 h-5" />
      default: return <Code className="w-5 h-5" />
    }
  }

  const getArtifactColor = (type: string) => {
    switch (type) {
      case 'website': return 'bg-blue-500'
      case 'campaign': return 'bg-green-500'
      case 'email': return 'bg-purple-500'
      case 'strategy': return 'bg-orange-500'
      case 'report': return 'bg-indigo-500'
      case 'social-media': return 'bg-pink-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl text-white">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-2xl">AI Business Intelligence Agent</CardTitle>
                <CardDescription>
                  Autonomous solution builder powered by GPT-4
                </CardDescription>
              </div>
            </div>
            
            {business && (
              <Button
                onClick={handleProcessBusiness}
                disabled={isProcessing || !apiKey}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Analyze & Build
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>

        {business && (
          <CardContent>
            <div className="p-4 bg-white/50 rounded-lg">
              <h3 className="font-semibold mb-2">Target Business</h3>
              <div className="flex items-center gap-4">
                <Briefcase className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">{business.name}</p>
                  <p className="text-sm text-gray-600">
                    {business.category} • {business.location}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Progress Section */}
      {isProcessing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{currentStep}</span>
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              
              <div className="grid grid-cols-6 gap-2 mt-4">
                {['Analyzing', 'Planning', 'Building', 'Optimizing', 'Testing', 'Finalizing'].map((step, idx) => (
                  <div
                    key={step}
                    className={`text-center p-2 rounded-lg transition-all ${
                      idx * 16 < progress
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <p className="text-xs font-medium">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Generated Artifacts */}
      {artifacts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Artifacts</CardTitle>
            <CardDescription>
              {artifacts.length} custom solutions created for {business?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {artifacts.map((artifact, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card 
                    className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                    onClick={() => setSelectedArtifact(artifact)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg text-white ${getArtifactColor(artifact.type)}`}>
                          {getArtifactIcon(artifact.type)}
                        </div>
                        <Badge variant="secondary">{artifact.type}</Badge>
                      </div>
                      
                      <h4 className="font-semibold mb-2">{artifact.name}</h4>
                      
                      <div className="flex items-center gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Business Analysis</CardTitle>
            <CardDescription>AI-powered insights and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-4">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Market Opportunity Score</h4>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-green-600">
                        {analysis.opportunityScore || 85}/100
                      </div>
                      <Progress value={analysis.opportunityScore || 85} className="flex-1" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Digital Presence</p>
                      <p className="text-xl font-semibold">
                        {business?.hasWebsite ? 'Established' : 'Needs Development'}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Growth Potential</p>
                      <p className="text-xl font-semibold">High</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="opportunities" className="mt-4">
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {['Website Development', 'SEO Optimization', 'Social Media Marketing', 'Email Campaigns', 'Review Management'].map((opp, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-medium">{opp}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="recommendations" className="mt-4">
                <div className="space-y-3">
                  <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertTitle>Priority Actions</AlertTitle>
                    <AlertDescription>
                      Based on the analysis, focus on digital presence and customer engagement first.
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Execution Log */}
      {executionLog.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Execution Log</CardTitle>
            <CardDescription>Step-by-step agent processing history</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {executionLog.map((action, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                    {action.success ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{action.capability}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(action.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Artifact Viewer - Advanced Canvas View */}
      {selectedArtifact && useAdvancedViewer && (
        <ArtifactViewer
          artifact={selectedArtifact}
          onClose={() => setSelectedArtifact(null)}
          onSave={(updatedContent) => {
            // Update the artifact in the list
            const updatedArtifacts = artifacts.map(a => 
              a === selectedArtifact ? { ...a, content: updatedContent } : a
            )
            setArtifacts(updatedArtifacts)
          }}
          onDeploy={(artifact) => {
            console.log('Deploying artifact:', artifact)
            // Here you could integrate with Vercel, Netlify, or any deployment service
          }}
          apiKey={apiKey}
        />
      )}
      
      {/* Fallback Simple Viewer */}
      {selectedArtifact && !useAdvancedViewer && (
        <Dialog open={!!selectedArtifact} onOpenChange={() => setSelectedArtifact(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>{selectedArtifact?.name}</DialogTitle>
              <DialogDescription>
                Generated {selectedArtifact?.type} artifact
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-4">
              <ScrollArea className="h-96 w-full rounded-md border p-4">
                <pre className="text-sm">
                  {typeof selectedArtifact?.content === 'string' 
                    ? selectedArtifact.content 
                    : JSON.stringify(selectedArtifact?.content, null, 2)}
                </pre>
              </ScrollArea>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setSelectedArtifact(null)}>
                Close
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
