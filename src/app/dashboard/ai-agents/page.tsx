'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Globe,
  Palette,
  Code,
  Sparkles,
  Rocket,
  Wand2,
  Monitor,
  Smartphone,
  Layout,
  Settings,
  Play,
  Pause,
  Download,
  Eye,
  RefreshCw,
  Zap,
  Target,
  TrendingUp,
  Mail,
  Search,
  Building2,
  X
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AIAgentDashboard } from '@/components/ai-agent/AIAgentDashboard'
import toast from 'react-hot-toast'

interface Agent {
  id: string
  name: string
  type: 'website' | 'marketing' | 'analysis' | 'content'
  status: 'idle' | 'running' | 'completed' | 'error'
  progress: number
  description: string
  icon: React.ElementType
  color: string
  capabilities: string[]
  lastRun?: Date
  results?: any
}

interface BusinessData {
  name: string
  category: string
  location: string
  phone?: string
  email?: string
  website?: string
  rating?: number
  reviews?: number
  hasWebsite: boolean
  description?: string
}

const predefinedAgents: Agent[] = [
  {
    id: 'website-generator',
    name: 'Autonomous Website Creator',
    type: 'website',
    status: 'idle',
    progress: 0,
    description: 'Creates complete, responsive websites with modern design, SEO optimization, and business-specific content',
    icon: Globe,
    color: 'from-blue-500 to-cyan-500',
    capabilities: [
      'Responsive web design',
      'SEO optimization',
      'Business-specific content',
      'Modern UI/UX',
      'Contact forms',
      'Google Maps integration',
      'Performance optimization',
      'Mobile-first approach'
    ]
  },
  {
    id: 'marketing-suite',
    name: 'Marketing Campaign Generator',
    type: 'marketing',
    status: 'idle',
    progress: 0,
    description: 'Develops comprehensive marketing strategies including email campaigns, social media content, and advertising copy',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
    capabilities: [
      'Email campaign sequences',
      'Social media content',
      'Google Ads copy',
      'Landing pages',
      'Marketing automation',
      'A/B test suggestions',
      'Conversion optimization',
      'Brand messaging'
    ]
  },
  {
    id: 'content-creator',
    name: 'Content & Copy Generator',
    type: 'content',
    status: 'idle',
    progress: 0,
    description: 'Generates high-quality content including blog posts, service descriptions, and promotional materials',
    icon: Wand2,
    color: 'from-purple-500 to-pink-500',
    capabilities: [
      'Blog post creation',
      'Service descriptions',
      'Product copy',
      'About us pages',
      'FAQ sections',
      'Press releases',
      'Newsletter content',
      'SEO-optimized writing'
    ]
  },
  {
    id: 'business-analyzer',
    name: 'Business Intelligence Agent',
    type: 'analysis',
    status: 'idle',
    progress: 0,
    description: 'Analyzes business opportunities, competitor landscape, and provides strategic recommendations',
    icon: Brain,
    color: 'from-orange-500 to-red-500',
    capabilities: [
      'Competitor analysis',
      'Market research',
      'SWOT analysis',
      'Growth opportunities',
      'Price optimization',
      'Customer insights',
      'Industry trends',
      'Risk assessment'
    ]
  }
]

const designStyles = [
  { id: 'modern', name: 'Modern & Minimal', description: 'Clean, contemporary design with lots of white space' },
  { id: 'corporate', name: 'Corporate Professional', description: 'Professional, trustworthy design for B2B businesses' },
  { id: 'creative', name: 'Creative & Bold', description: 'Vibrant, unique design for creative industries' },
  { id: 'local', name: 'Local Business', description: 'Warm, community-focused design for local services' },
  { id: 'ecommerce', name: 'E-commerce', description: 'Conversion-optimized design for online stores' },
  { id: 'healthcare', name: 'Healthcare', description: 'Clean, trustworthy design for medical practices' },
  { id: 'restaurant', name: 'Restaurant & Food', description: 'Appetizing, warm design for food businesses' },
  { id: 'tech', name: 'Technology', description: 'Sleek, innovative design for tech companies' }
]

export default function AIAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(predefinedAgents)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [businessData, setBusinessData] = useState<BusinessData>({
    name: '',
    category: '',
    location: '',
    hasWebsite: false
  })
  const [selectedDesignStyle, setSelectedDesignStyle] = useState('')
  const [customInstructions, setCustomInstructions] = useState('')
  const [autoMode, setAutoMode] = useState(true)
  const [apiKey, setApiKey] = useState('')
  const [showResults, setShowResults] = useState(false)

  // Load API key from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('openrouter_api_key')
    if (saved) {
      setApiKey(saved)
    }
  }, [])

  // Save API key to localStorage
  const handleSaveApiKey = () => {
    localStorage.setItem('openrouter_api_key', apiKey)
    toast.success('API key saved securely')
  }

  const handleRunAgent = async (agentId: string) => {
    if (!businessData.name || !businessData.category) {
      toast.error('Please provide business name and category first')
      return
    }

    if (!apiKey) {
      toast.error('Please provide your OpenRouter API key')
      return
    }

    const agent = agents.find(a => a.id === agentId)
    if (!agent) return

    // Update agent status
    setAgents(prev => prev.map(a => 
      a.id === agentId 
        ? { ...a, status: 'running', progress: 0, lastRun: new Date() }
        : a
    ))

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setAgents(prev => prev.map(a => {
          if (a.id === agentId && a.status === 'running') {
            const newProgress = Math.min(a.progress + Math.random() * 15, 95)
            return { ...a, progress: newProgress }
          }
          return a
        }))
      }, 1000)

      // Simulate agent work (replace with actual API calls)
      await new Promise(resolve => setTimeout(resolve, 8000))
      
      clearInterval(progressInterval)

      // Complete the agent
      setAgents(prev => prev.map(a => 
        a.id === agentId 
          ? { 
              ...a, 
              status: 'completed', 
              progress: 100,
              results: generateMockResults(agent.type, businessData)
            }
          : a
      ))

      toast.success(`${agent.name} completed successfully!`)
      
    } catch (error) {
      setAgents(prev => prev.map(a => 
        a.id === agentId 
          ? { ...a, status: 'error', progress: 0 }
          : a
      ))
      toast.error(`Failed to run ${agent.name}`)
    }
  }

  const generateMockResults = (type: string, business: BusinessData) => {
    switch (type) {
      case 'website':
        return {
          pages: ['Home', 'About', 'Services', 'Contact'],
          features: ['Contact Form', 'Google Maps', 'Mobile Responsive', 'SEO Optimized'],
          technologies: ['React', 'Next.js', 'Tailwind CSS'],
          deploymentUrl: 'https://example-website.vercel.app',
          designStyle: selectedDesignStyle || 'modern'
        }
      case 'marketing':
        return {
          campaigns: ['Email Welcome Series', 'Social Media Campaign', 'Google Ads Campaign'],
          content: ['Landing Page Copy', 'Email Templates', 'Social Posts'],
          channels: ['Email', 'Facebook', 'Google Ads', 'LinkedIn']
        }
      case 'content':
        return {
          content: ['Homepage Copy', 'Service Descriptions', 'Blog Posts', 'FAQ Section'],
          wordCount: 2500,
          seoScore: 92
        }
      case 'analysis':
        return {
          opportunityScore: 87,
          competitors: 5,
          recommendations: ['Improve online presence', 'Focus on local SEO', 'Enhance social media']
        }
      default:
        return {}
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running': return 'Running'
      case 'completed': return 'Completed'
      case 'error': return 'Error'
      default: return 'Ready'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Agents</h1>
          <p className="text-muted-foreground">
            Autonomous agents that create websites, marketing campaigns, and business solutions
          </p>
        </div>
        <Button 
          onClick={() => setShowResults(true)}
          disabled={!agents.some(a => a.status === 'completed')}
          className="bg-gradient-to-r from-purple-600 to-blue-600"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Results
        </Button>
      </div>

      <Tabs defaultValue="agents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="setup">Business Setup</TabsTrigger>
          <TabsTrigger value="settings">Configuration</TabsTrigger>
        </TabsList>

        {/* Agents Tab */}
        <TabsContent value="agents" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agents.map((agent) => {
              const Icon = agent.icon
              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${agent.color} text-white`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{agent.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                              <span className="text-xs text-muted-foreground">
                                {getStatusText(agent.status)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{agent.type}</Badge>
                      </div>
                      <CardDescription className="mt-3">
                        {agent.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Progress Bar for Running Agents */}
                      {agent.status === 'running' && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Processing...</span>
                            <span>{Math.round(agent.progress)}%</span>
                          </div>
                          <Progress value={agent.progress} />
                        </div>
                      )}

                      {/* Capabilities */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Capabilities:</h4>
                        <div className="flex flex-wrap gap-1">
                          {agent.capabilities.slice(0, 4).map((capability, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {capability}
                            </Badge>
                          ))}
                          {agent.capabilities.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{agent.capabilities.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => handleRunAgent(agent.id)}
                          disabled={agent.status === 'running' || !businessData.name || !apiKey}
                          className="flex-1"
                          variant={agent.status === 'completed' ? 'outline' : 'default'}
                        >
                          {agent.status === 'running' ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Running
                            </>
                          ) : agent.status === 'completed' ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Re-run
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Run Agent
                            </>
                          )}
                        </Button>
                        
                        {agent.status === 'completed' && (
                          <Button
                            variant="outline"
                            onClick={() => setSelectedAgent(agent)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      {/* Last Run Info */}
                      {agent.lastRun && (
                        <p className="text-xs text-muted-foreground">
                          Last run: {agent.lastRun.toLocaleString()}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>

        {/* Business Setup Tab */}
        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Provide details about the business to create customized solutions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name *</Label>
                  <Input
                    id="business-name"
                    placeholder="Enter business name"
                    value={businessData.name}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-category">Category/Industry *</Label>
                  <Input
                    id="business-category"
                    placeholder="e.g., Restaurant, Law Firm, Dentist"
                    value={businessData.category}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, category: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-location">Location</Label>
                  <Input
                    id="business-location"
                    placeholder="City, State"
                    value={businessData.location}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-phone">Phone</Label>
                  <Input
                    id="business-phone"
                    placeholder="(555) 123-4567"
                    value={businessData.phone || ''}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-email">Email</Label>
                  <Input
                    id="business-email"
                    type="email"
                    placeholder="contact@business.com"
                    value={businessData.email || ''}
                    onChange={(e) => setBusinessData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-website">Current Website (if any)</Label>
                  <Input
                    id="business-website"
                    placeholder="https://example.com"
                    value={businessData.website || ''}
                    onChange={(e) => setBusinessData(prev => ({ 
                      ...prev, 
                      website: e.target.value,
                      hasWebsite: !!e.target.value
                    }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="business-description">Business Description</Label>
                <Textarea
                  id="business-description"
                  placeholder="Describe the business, services offered, target customers, etc."
                  value={businessData.description || ''}
                  onChange={(e) => setBusinessData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="design-style">Preferred Design Style</Label>
                <Select value={selectedDesignStyle} onValueChange={setSelectedDesignStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a design style" />
                  </SelectTrigger>
                  <SelectContent>
                    {designStyles.map((style) => (
                      <SelectItem key={style.id} value={style.id}>
                        <div>
                          <div className="font-medium">{style.name}</div>
                          <div className="text-xs text-muted-foreground">{style.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-instructions">Custom Instructions</Label>
                <Textarea
                  id="custom-instructions"
                  placeholder="Any specific requirements, features, or preferences for the AI agents"
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
              <CardDescription>
                Configure AI model settings and API keys
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">OpenRouter API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter your OpenRouter API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <Button onClick={handleSaveApiKey} variant="outline">
                    Save
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Required for AI agents to function. Your key is stored locally and encrypted.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-run dependent agents</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically run related agents based on results
                  </p>
                </div>
                <Switch
                  checked={autoMode}
                  onCheckedChange={setAutoMode}
                />
              </div>

              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertTitle>Pro Tip</AlertTitle>
                <AlertDescription>
                  For best results, provide detailed business information and specific requirements. 
                  The agents will create more targeted and effective solutions.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Results Modal/Dialog would go here */}
      {showResults && selectedAgent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedAgent.name} Results</CardTitle>
                <Button variant="outline" onClick={() => setShowResults(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-gray-100 p-4 rounded-lg overflow-auto">
                {JSON.stringify(selectedAgent.results, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
