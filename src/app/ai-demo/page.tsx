'use client'

import { useState } from 'react'
import { AIAgentDashboard } from '@/components/ai-agent/AIAgentDashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Brain, Sparkles, Info, Key, Zap } from 'lucide-react'
import { AVAILABLE_MODELS } from '@/lib/ai-agent'

// Sample business data for testing
const sampleBusiness = {
  id: 'demo-business-1',
  name: 'Joe\'s Coffee Shop',
  category: 'Restaurant',
  location: 'San Francisco, CA',
  rating: 4.2,
  totalReviews: 156,
  hasWebsite: false,
  phone: '(555) 123-4567',
  address: '123 Main St, San Francisco, CA 94102'
}

export default function AIDemoPage() {
  const [apiKey, setApiKey] = useState('')
  const [selectedModel, setSelectedModel] = useState('openai/gpt-4-turbo-preview')
  const [showDemo, setShowDemo] = useState(false)

  const handleStartDemo = () => {
    if (!apiKey) {
      alert('Please enter your OpenRouter API key to continue')
      return
    }
    setShowDemo(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl text-white">
              <Brain className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            AI Agent Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powered by OpenRouter - Access to GPT-4, Claude, Gemini, and more!
          </p>
        </div>

        {!showDemo ? (
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Configure AI Agent</CardTitle>
                <CardDescription>
                  Use OpenRouter to access multiple AI models
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Get Your OpenRouter API Key</AlertTitle>
                  <AlertDescription>
                    Visit <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">openrouter.ai/keys</a> to create your API key.
                    OpenRouter gives you access to GPT-4, Claude 3, Gemini, and many more models!
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">OpenRouter API Key</label>
                    <Input
                      type="password"
                      placeholder="sk-or-v1-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">
                      Your API key is only used client-side and never stored
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select AI Model</label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai/gpt-4-turbo-preview">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-green-500" />
                            GPT-4 Turbo (Recommended)
                          </div>
                        </SelectItem>
                        <SelectItem value="anthropic/claude-3-opus">
                          Claude 3 Opus (Most Capable)
                        </SelectItem>
                        <SelectItem value="anthropic/claude-3-sonnet">
                          Claude 3 Sonnet (Balanced)
                        </SelectItem>
                        <SelectItem value="google/gemini-pro">
                          Gemini Pro (Google)
                        </SelectItem>
                        <SelectItem value="mistralai/mixtral-8x7b-instruct">
                          Mixtral 8x7B (Fast & Efficient)
                        </SelectItem>
                        <SelectItem value="openai/gpt-3.5-turbo">
                          GPT-3.5 Turbo (Budget)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      Different models have different capabilities and costs
                    </p>
                  </div>
                  
                  <Button onClick={handleStartDemo} className="w-full">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Start AI Agent Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Sample Business Info */}
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle>Demo Business</CardTitle>
                <CardDescription>
                  The AI Agent will analyze and build solutions for this business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Business Name</p>
                    <p className="font-semibold">{sampleBusiness.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-semibold">{sampleBusiness.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold">{sampleBusiness.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Website Status</p>
                    <p className="font-semibold text-orange-600">No Website</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Agent Dashboard */}
            <AIAgentDashboard 
              business={sampleBusiness}
              apiKey={apiKey}
              model={selectedModel}
            />
          </div>
        )}
      </div>
    </div>
  )
}
