'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2, Send, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function AITestPage() {
  const [prompt, setPrompt] = useState('')
  const [businessName, setBusinessName] = useState('Joe\'s Coffee Shop')
  const [businessType, setBusinessType] = useState('Coffee Shop')
  const [tone, setTone] = useState('professional')
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking')

  // Check API connection on mount
  React.useEffect(() => {
    checkAPIConnection()
  }, [])

  const checkAPIConnection = async () => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
      const res = await fetch(`${backendUrl}/health`)
      if (res.ok) {
        setApiStatus('connected')
      } else {
        setApiStatus('error')
      }
    } catch (err) {
      setApiStatus('error')
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setIsLoading(true)
    setError('')
    setResponse('')

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
      
      // Prepare business data
      const businessData = {
        name: businessName,
        business_category: businessType,
        city: 'San Francisco',
        state: 'CA',
        rating: 4.2,
        total_reviews: 150,
        has_website: false
      }

      const res = await fetch(`${backendUrl}/ai-agent/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          business_info: businessData,
          temperature: 0.7,
          max_tokens: 1000,
          agent_name: 'AI Test Agent',
          tone: tone,
          service_type: 'general'
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || 'AI generation failed')
      }

      setResponse(data.output || 'No response generated')
    } catch (err: any) {
      setError(err.message || 'Failed to generate response')
    } finally {
      setIsLoading(false)
    }
  }

  const testEndpoints = async () => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
    const endpoints = [
      '/health',
      '/ai-agent/test',
      '/ai-agent/config'
    ]

    console.log('Testing endpoints...')
    for (const endpoint of endpoints) {
      try {
        const res = await fetch(`${backendUrl}${endpoint}`)
        const data = await res.json()
        console.log(`✅ ${endpoint}:`, data)
      } catch (err) {
        console.log(`❌ ${endpoint}: Failed`)
      }
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">AI Builder Connection Test</CardTitle>
              <CardDescription>
                Test the connection between frontend and backend AI services
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {apiStatus === 'checking' && (
                <div className="flex items-center gap-2 text-yellow-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Checking...</span>
                </div>
              )}
              {apiStatus === 'connected' && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>API Connected</span>
                </div>
              )}
              {apiStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>API Disconnected</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Input Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="business-name">Business Name</Label>
              <Input
                id="business-name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter business name"
              />
            </div>

            <div>
              <Label htmlFor="business-type">Business Type</Label>
              <Input
                id="business-type"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder="Enter business type"
              />
            </div>

            <div>
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="prompt">AI Prompt</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here... e.g., 'Generate a cold outreach email' or 'Analyze business weaknesses'"
                className="min-h-[120px]"
                data-testid="prompt-input"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="flex-1"
                data-testid="generate-button"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={testEndpoints}
                title="Test all API endpoints"
              >
                Test API
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle>AI Response</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {response && (
              <div className="space-y-4">
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertTitle>Generated Successfully</AlertTitle>
                  <AlertDescription>
                    The AI has generated a response based on your prompt.
                  </AlertDescription>
                </Alert>
                <div 
                  className="bg-gray-50 p-4 rounded-lg max-h-[400px] overflow-auto"
                  data-testid="output-area"
                >
                  <pre className="whitespace-pre-wrap text-sm">{response}</pre>
                </div>
              </div>
            )}

            {!response && !error && !isLoading && (
              <div className="text-center py-12 text-gray-500">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>AI response will appear here</p>
                <p className="text-sm mt-2">Enter a prompt and click Generate to test the AI</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sample Prompts */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Sample Prompts</CardTitle>
          <CardDescription>Click to use these pre-written prompts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              'Generate a cold outreach email for this business',
              'Analyze the weaknesses and opportunities for this business',
              'Create a marketing strategy for improving online presence',
              'Write a proposal for website design services',
              'Generate social media content ideas',
              'Create an SEO improvement plan'
            ].map((samplePrompt) => (
              <Button
                key={samplePrompt}
                variant="outline"
                size="sm"
                onClick={() => setPrompt(samplePrompt)}
                className="justify-start text-left"
              >
                {samplePrompt}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
