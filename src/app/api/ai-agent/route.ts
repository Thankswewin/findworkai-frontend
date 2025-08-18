import { NextRequest, NextResponse } from 'next/server'
import { getAIAgent } from '@/lib/ai-agent'
import { z } from 'zod'
import { env } from '@/lib/env'
import { rateLimit } from '@/lib/rate-limit'

// Input validation schemas
const aiAgentRequestSchema = z.object({
  action: z.enum(['process', 'getHistory', 'clearHistory']),
  business: z.object({
    id: z.string(),
    name: z.string().min(1).max(200),
    category: z.string(),
    location: z.string(),
    rating: z.number(),
    totalReviews: z.number(),
    hasWebsite: z.boolean(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().optional(),
    email: z.string().email().optional(),
    opportunityScore: z.number().optional(),
    photos: z.array(z.string()).optional(),
    priceLevel: z.number().optional(),
    openNow: z.boolean().optional(),
  }).optional(),
})

// Rate limiting configuration
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 100, // Max 100 unique users per interval
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = request.ip ?? 'anonymous'
    const { success } = await limiter.check(identifier, 10) // 10 requests per minute
    
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = aiAgentRequestSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validationResult.error.flatten() 
        },
        { status: 400 }
      )
    }

    const { action, business } = validationResult.data

    // Use environment variable for API key (NEVER accept from client)
    const apiKey = env.OPENAI_API_KEY
    
    if (!apiKey) {
      console.error('OpenAI API key not configured in environment')
      return NextResponse.json(
        { error: 'AI service is not configured. Please contact support.' },
        { status: 503 }
      )
    }

    // Initialize agent with server-side API key
    const agent = getAIAgent(apiKey)

    // Execute action with timeout
    const timeoutMs = 30000 // 30 second timeout
    const actionPromise = (async () => {
      switch (action) {
        case 'process':
          if (!business) {
            throw new Error('Business data is required for processing')
          }
          return await agent.processBusinessAutomatically(business)

        case 'getHistory':
          return {
            history: agent.getExecutionHistory()
          }

        case 'clearHistory':
          agent.clearHistory()
          return { success: true }

        default:
          throw new Error(`Invalid action: ${action}`)
      }
    })()

    // Add timeout
    const result = await Promise.race([
      actionPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
      )
    ])

    return NextResponse.json(result)

  } catch (error) {
    // Proper error logging without exposing sensitive data
    console.error('AI Agent API error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    })

    // Don't expose internal error details to client
    const errorMessage = error instanceof Error && error.message === 'Request timeout'
      ? 'The AI processing took too long. Please try again.'
      : 'AI processing failed. Please try again later.'

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
