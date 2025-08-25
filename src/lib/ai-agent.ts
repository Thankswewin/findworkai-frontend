// AI Agent System - Autonomous Business Intelligence & Solution Builder
// This agent automatically analyzes businesses and generates custom solutions

import { Business } from './google-places'

export interface AgentCapability {
  id: string
  name: string
  description: string
  execute: (context: AgentContext) => Promise<AgentResult>
}

export interface AgentContext {
  business: Business
  marketData?: any
  competitorAnalysis?: any
  industryInsights?: any
  previousActions?: AgentAction[]
}

export interface AgentAction {
  timestamp: Date
  capability: string
  input: any
  output: any
  success: boolean
}

export interface AgentResult {
  success: boolean
  data: any
  nextActions?: string[]
  artifacts?: GeneratedArtifact[]
}

export interface GeneratedArtifact {
  type: 'website' | 'content' | 'marketing' | 'campaign' | 'email' | 'strategy' | 'report' | 'landing-page' | 'social-media'
  name: string
  content: any
  metadata?: Record<string, any>
  id?: string
  generatedAt?: Date
}

// Core AI Agent Class
export class BusinessIntelligenceAgent {
  private capabilities: Map<string, AgentCapability> = new Map()
  private apiKey: string
  private model: string = 'openai/gpt-4-turbo-preview' // OpenRouter model format
  private executionHistory: AgentAction[] = []
  private siteUrl: string = '' // Required for OpenRouter
  private siteName: string = 'FindWorkAI'
  
  constructor(apiKey: string, options?: { model?: string; siteUrl?: string; siteName?: string }) {
    this.apiKey = apiKey
    this.model = options?.model || 'openai/gpt-4-turbo-preview' // Default to GPT-4 Turbo
    this.siteUrl = options?.siteUrl || 'http://localhost:3000'
    this.siteName = options?.siteName || 'FindWorkAI'
    this.registerDefaultCapabilities()
  }

  // Register all agent capabilities
  private registerDefaultCapabilities() {
    // Business Analysis Capability
    this.registerCapability({
      id: 'analyze-business',
      name: 'Business Deep Analysis',
      description: 'Performs comprehensive analysis of business opportunities',
      execute: async (context) => this.analyzeBusinessOpportunity(context)
    })

    // Website Builder Capability
    this.registerCapability({
      id: 'build-website',
      name: 'Automated Website Generator',
      description: 'Generates custom website for the business',
      execute: async (context) => this.generateWebsite(context)
    })

    // Marketing Campaign Creator
    this.registerCapability({
      id: 'create-campaign',
      name: 'Marketing Campaign Builder',
      description: 'Creates targeted marketing campaigns',
      execute: async (context) => this.createMarketingCampaign(context)
    })

    // Email Outreach Generator
    this.registerCapability({
      id: 'generate-outreach',
      name: 'Personalized Outreach Creator',
      description: 'Generates personalized outreach emails',
      execute: async (context) => this.generateOutreachContent(context)
    })

    // Competitive Strategy Builder
    this.registerCapability({
      id: 'build-strategy',
      name: 'Strategic Plan Generator',
      description: 'Creates competitive strategy documents',
      execute: async (context) => this.buildCompetitiveStrategy(context)
    })

    // Social Media Content Creator
    this.registerCapability({
      id: 'create-social',
      name: 'Social Media Content Generator',
      description: 'Creates social media campaigns and content',
      execute: async (context) => this.createSocialMediaContent(context)
    })
  }

  // Register custom capability
  registerCapability(capability: AgentCapability) {
    this.capabilities.set(capability.id, capability)
  }

  // Main execution pipeline
  async processBusinessAutomatically(business: Business): Promise<{
    analysis: any
    generatedArtifacts: GeneratedArtifact[]
    recommendations: string[]
    executionLog: AgentAction[]
  }> {
    console.log(`🤖 AI Agent activated for: ${business.name}`)
    
    const context: AgentContext = {
      business,
      previousActions: []
    }

    const artifacts: GeneratedArtifact[] = []
    const recommendations: string[] = []

    try {
      // Step 1: Deep Business Analysis
      const analysisResult = await this.executeCapability('analyze-business', context)
      if (analysisResult.success) {
        context.marketData = analysisResult.data
        artifacts.push(...(analysisResult.artifacts || []))
      }

      // Step 2: Determine what to build based on analysis
      const buildPlan = await this.determineBuildPlan(context)
      
      // Step 3: Execute build plan
      for (const action of buildPlan.actions) {
        const result = await this.executeCapability(action, context)
        if (result.success) {
          artifacts.push(...(result.artifacts || []))
          recommendations.push(...(result.nextActions || []))
        }
      }

      // Step 4: Generate final report
      const report = await this.generateFinalReport(context, artifacts)
      artifacts.push(report)

      return {
        analysis: context.marketData,
        generatedArtifacts: artifacts,
        recommendations,
        executionLog: this.executionHistory
      }

    } catch (error) {
      console.error('AI Agent Error:', error)
      throw error
    }
  }

  // Execute a specific capability
  private async executeCapability(capabilityId: string, context: AgentContext): Promise<AgentResult> {
    const capability = this.capabilities.get(capabilityId)
    if (!capability) {
      throw new Error(`Capability ${capabilityId} not found`)
    }

    const startTime = new Date()
    try {
      const result = await capability.execute(context)
      
      this.executionHistory.push({
        timestamp: startTime,
        capability: capabilityId,
        input: context.business.name,
        output: result.data,
        success: result.success
      })

      return result
    } catch (error) {
      this.executionHistory.push({
        timestamp: startTime,
        capability: capabilityId,
        input: context.business.name,
        output: error,
        success: false
      })
      throw error
    }
  }

  // Analyze business opportunity using AI
  private async analyzeBusinessOpportunity(context: AgentContext): Promise<AgentResult> {
    const prompt = `
    Analyze this business for digital transformation opportunities:
    
    Business: ${context.business.name}
    Category: ${context.business.category}
    Location: ${context.business.location}
    Rating: ${context.business.rating}/5 (${context.business.totalReviews} reviews)
    Has Website: ${context.business.hasWebsite}
    
    Provide:
    1. Digital presence assessment
    2. Market opportunity score (1-100)
    3. Recommended services they need
    4. Competitive landscape analysis
    5. Growth potential assessment
    6. Technology gaps to fill
    
    Format as JSON.
    `

    const analysis = await this.callOpenAI(prompt)
    
    return {
      success: true,
      data: analysis,
      nextActions: ['build-website', 'create-campaign'],
      artifacts: [{
        type: 'report',
        name: 'Business Analysis Report',
        content: analysis
      }]
    }
  }

  // Generate a custom website
  private async generateWebsite(context: AgentContext): Promise<AgentResult> {
    const prompt = `
    Generate a modern, conversion-optimized website structure for:
    
    Business: ${context.business.name}
    Type: ${context.business.category}
    
    Create:
    1. Complete HTML/CSS/JS for a landing page
    2. SEO-optimized content
    3. Call-to-action sections
    4. Service descriptions
    5. Contact forms
    
    Make it modern, professional, and mobile-responsive.
    Include Tailwind CSS classes.
    `

    const websiteCode = await this.callOpenAI(prompt)
    
    return {
      success: true,
      data: websiteCode,
      artifacts: [{
        type: 'website',
        name: `${context.business.name} Website`,
        content: websiteCode,
        metadata: {
          framework: 'tailwind',
          responsive: true,
          seoOptimized: true
        }
      }]
    }
  }

  // Create marketing campaign
  private async createMarketingCampaign(context: AgentContext): Promise<AgentResult> {
    const prompt = `
    Create a comprehensive digital marketing campaign for:
    
    Business: ${context.business.name}
    Industry: ${context.business.category}
    Target Market: Local customers in ${context.business.location}
    
    Generate:
    1. Campaign strategy
    2. Target audience personas
    3. Key messaging
    4. Channel recommendations
    5. Budget allocation
    6. KPIs and metrics
    7. 30-day action plan
    
    Format as structured JSON.
    `

    const campaign = await this.callOpenAI(prompt)
    
    return {
      success: true,
      data: campaign,
      artifacts: [{
        type: 'campaign',
        name: 'Digital Marketing Campaign',
        content: campaign
      }]
    }
  }

  // Generate outreach content
  private async generateOutreachContent(context: AgentContext): Promise<AgentResult> {
    const prompt = `
    Create personalized outreach content for:
    
    Business: ${context.business.name}
    Opportunity: ${context.marketData?.opportunityScore || 'High potential'}
    
    Generate:
    1. Cold email template
    2. LinkedIn message
    3. Follow-up sequence (3 emails)
    4. Value proposition
    5. Call-to-action options
    
    Make it personalized, professional, and conversion-focused.
    `

    const outreach = await this.callOpenAI(prompt)
    
    return {
      success: true,
      data: outreach,
      artifacts: [{
        type: 'email',
        name: 'Outreach Campaign',
        content: outreach
      }]
    }
  }

  // Build competitive strategy
  private async buildCompetitiveStrategy(context: AgentContext): Promise<AgentResult> {
    const prompt = `
    Develop a competitive strategy for helping:
    
    Business: ${context.business.name}
    Industry: ${context.business.category}
    Current Rating: ${context.business.rating}
    
    Create:
    1. Competitive analysis
    2. Differentiation strategies
    3. Service recommendations
    4. Pricing strategy
    5. Implementation roadmap
    6. Success metrics
    
    Format as actionable strategy document.
    `

    const strategy = await this.callOpenAI(prompt)
    
    return {
      success: true,
      data: strategy,
      artifacts: [{
        type: 'strategy',
        name: 'Competitive Strategy Document',
        content: strategy
      }]
    }
  }

  // Create social media content
  private async createSocialMediaContent(context: AgentContext): Promise<AgentResult> {
    const prompt = `
    Generate social media content calendar for:
    
    Business: ${context.business.name}
    Industry: ${context.business.category}
    
    Create:
    1. 30-day content calendar
    2. Platform-specific posts (Facebook, Instagram, LinkedIn)
    3. Hashtag strategy
    4. Visual content descriptions
    5. Engagement tactics
    6. Posting schedule
    
    Make it engaging, brand-appropriate, and conversion-focused.
    `

    const socialContent = await this.callOpenAI(prompt)
    
    return {
      success: true,
      data: socialContent,
      artifacts: [{
        type: 'social-media',
        name: 'Social Media Content Calendar',
        content: socialContent
      }]
    }
  }

  // Determine what to build based on analysis
  private async determineBuildPlan(context: AgentContext): Promise<{ actions: string[] }> {
    const needsWebsite = !context.business.hasWebsite
    const lowRating = context.business.rating < 4
    const fewReviews = context.business.totalReviews < 50
    
    const actions: string[] = []
    
    if (needsWebsite) {
      actions.push('build-website')
    }
    
    if (lowRating || fewReviews) {
      actions.push('create-campaign')
      actions.push('create-social')
    }
    
    actions.push('generate-outreach')
    actions.push('build-strategy')
    
    return { actions }
  }

  // Generate final comprehensive report
  private async generateFinalReport(context: AgentContext, artifacts: GeneratedArtifact[]): Promise<GeneratedArtifact> {
    const prompt = `
    Create an executive summary report for all work done:
    
    Business: ${context.business.name}
    Artifacts Created: ${artifacts.map(a => a.type).join(', ')}
    
    Include:
    1. Executive summary
    2. Key findings
    3. Deliverables created
    4. Implementation recommendations
    5. Expected ROI
    6. Next steps
    
    Make it professional and actionable.
    `

    const report = await this.callOpenAI(prompt)
    
    return {
      type: 'report',
      name: 'Executive Summary Report',
      content: report,
      metadata: {
        generatedAt: new Date(),
        artifactCount: artifacts.length
      }
    }
  }

  // Call our backend API instead of OpenRouter directly!
  private async callOpenAI(prompt: string): Promise<any> {
    try {
      // Use our backend API which has the REAL AI service!
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://findworkai-backend-1.onrender.com/api/v1'
      
      console.log('🚀 Calling backend AI service at:', backendUrl)
      
      const response = await fetch(`${backendUrl}/ai-agent/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          temperature: 0.7,
          max_tokens: 2000,
          agent_name: 'Business Intelligence Agent',
          tone: 'professional',
          service_type: 'digital_transformation'
        })
      })

      const data = await response.json()
      
      if (!response.ok) {
        console.error('Backend API error:', data)
        throw new Error(data.detail || 'AI generation failed')
      }

      // Extract the output from our backend response
      const content = data.output || data.response || data
      
      console.log('✅ Received AI response from backend')
      
      // Try to parse as JSON if possible
      try {
        if (typeof content === 'string' && (content.includes('{') || content.includes('['))) {
          return JSON.parse(content)
        }
        return content
      } catch {
        return content
      }
    } catch (error) {
      console.error('❌ Backend API Error:', error)
      console.log('⚠️ Using fallback response...')
      
      // Return a REAL error message, not fake data!
      return this.getFallbackResponse(prompt)
    }
  }
  
  // Add honest fallback instead of fake AI
  private getFallbackResponse(prompt: string): any {
    // At least be honest about the failure!
    const errorMessage = `
I apologize, but I'm unable to generate a response at this moment due to a connection issue.

Your request was: ${prompt.substring(0, 100)}...

Possible reasons:
1. The backend service is starting up (takes 30-60 seconds on free tier)
2. API connection issue
3. Service temporarily unavailable

Please try again in a moment. If the issue persists, contact support.
    `
    
    // Return appropriate fallback based on prompt type
    if (prompt.includes('website')) {
      return {
        error: true,
        message: errorMessage,
        fallback: true,
        suggestion: 'Try again to generate a real website with AI'
      }
    } else if (prompt.includes('campaign')) {
      return {
        error: true,
        message: errorMessage,
        fallback: true,
        suggestion: 'Try again to generate a real marketing campaign'
      }
    } else {
      return errorMessage
    }
  }

  // Get execution history
  getExecutionHistory(): AgentAction[] {
    return this.executionHistory
  }

  // Clear execution history
  clearHistory() {
    this.executionHistory = []
  }
}

// Available models on OpenRouter - verified real models
export const AVAILABLE_MODELS = {
  // OpenAI Models (latest)
  'gpt-5': 'openai/gpt-5',
  'gpt-4.1': 'openai/gpt-4.1',
  'gpt-4o': 'openai/gpt-4o',
  'gpt-4o-mini': 'openai/gpt-4o-mini',
  
  // Anthropic Models (latest)
  'claude-opus-4.1': 'anthropic/claude-opus-4.1',
  'claude-opus-4': 'anthropic/claude-opus-4',
  'claude-sonnet-4': 'anthropic/claude-sonnet-4',
  'claude-3.5-sonnet': 'anthropic/claude-3.5-sonnet',
  'claude-3.5-haiku': 'anthropic/claude-3.5-haiku',
  'claude-3-opus': 'anthropic/claude-3-opus',
  
  // Google Models
  'gemini-2.5-pro': 'google/gemini-2.5-pro',
  'gemini-2.5-flash': 'google/gemini-2.5-flash',
  'gemini-pro-1.5': 'google/gemini-pro-1.5',
  'gemini-flash-1.5': 'google/gemini-flash-1.5',
  
  // Other top models
  'llama-3.1-405b': 'meta-llama/llama-3.1-405b-instruct',
  'mixtral-8x7b': 'mistralai/mixtral-8x7b-instruct',
  'deepseek-coder': 'deepseek/deepseek-coder-33b-instruct'
}

// Export singleton instance
let agentInstance: BusinessIntelligenceAgent | null = null

export function getAIAgent(apiKey?: string, options?: { model?: string; siteUrl?: string; siteName?: string }): BusinessIntelligenceAgent {
  if (!agentInstance && apiKey) {
    agentInstance = new BusinessIntelligenceAgent(apiKey, options)
  }
  
  if (!agentInstance) {
    throw new Error('AI Agent not initialized. Please provide an OpenRouter API key.')
  }
  
  return agentInstance
}
