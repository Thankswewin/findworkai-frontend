// OpenRouter API Integration
// Handles communication with multiple AI models

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

export interface OpenRouterOptions {
  temperature?: number
  max_tokens?: number
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
  stream?: boolean
}

export async function generateWithOpenRouter(
  prompt: string,
  model: string,
  apiKey: string,
  options: OpenRouterOptions = {}
): Promise<string> {
  const defaultOptions: OpenRouterOptions = {
    temperature: 0.7,
    max_tokens: 4000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: false
  }

  const finalOptions = { ...defaultOptions, ...options }

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'FindWorkAI',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert web developer and designer creating modern, beautiful websites.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        ...finalOptions
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'OpenRouter API error')
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || ''
  } catch (error) {
    console.error(`Error with model ${model}:`, error)
    throw error
  }
}

// Helper function to select best model based on task
export function selectModelForTask(task: 'structure' | 'design' | 'code' | 'content' | 'optimization'): string {
  const modelMap = {
    structure: 'anthropic/claude-opus-4.1',      // Best for complex planning
    design: 'google/gemini-2.5-pro',            // Best for creative design
    code: 'anthropic/claude-sonnet-4',          // Best for code generation
    content: 'google/gemini-2.5-pro',           // Best for content creation
    optimization: 'google/gemini-2.5-flash'     // Best for quick optimizations
  }
  
  return modelMap[task]
}

// Batch generate with multiple models for comparison
export async function generateWithMultipleModels(
  prompt: string,
  models: string[],
  apiKey: string,
  options?: OpenRouterOptions
): Promise<Map<string, string>> {
  const results = new Map<string, string>()
  
  // Run models in parallel for speed
  const promises = models.map(async (model) => {
    try {
      const result = await generateWithOpenRouter(prompt, model, apiKey, options)
      return { model, result }
    } catch (error) {
      console.error(`Failed with model ${model}:`, error)
      return { model, result: '' }
    }
  })
  
  const responses = await Promise.all(promises)
  
  responses.forEach(({ model, result }) => {
    if (result) {
      results.set(model, result)
    }
  })
  
  return results
}

// Stream response for real-time generation
export async function streamFromOpenRouter(
  prompt: string,
  model: string,
  apiKey: string,
  onChunk: (chunk: string) => void,
  options: OpenRouterOptions = {}
): Promise<void> {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'FindWorkAI',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      ...options,
      stream: true
    })
  })

  if (!response.ok) {
    throw new Error('Stream failed')
  }

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) {
    throw new Error('No reader available')
  }

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n')
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (data === '[DONE]') continue
        
        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices[0]?.delta?.content
          if (content) {
            onChunk(content)
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }
}

// Model-specific prompt optimizations
export function optimizePromptForModel(prompt: string, model: string): string {
  // Claude models prefer structured, detailed prompts
  if (model.includes('claude')) {
    return `Please provide a detailed, well-structured response.
    
${prompt}

Please ensure your response is comprehensive and follows best practices.`
  }
  
  // Gemini models work well with creative, open-ended prompts
  if (model.includes('gemini')) {
    return `Be creative and innovative in your approach.
    
${prompt}

Feel free to explore unique and modern solutions.`
  }
  
  // GPT models benefit from clear instructions
  if (model.includes('gpt')) {
    return `Instructions: ${prompt}
    
Please provide a clear, actionable response.`
  }
  
  return prompt
}

// Export model configurations
export const AI_MODELS = {
  // Primary models from OpenRouter
  CLAUDE_OPUS_4_1: 'anthropic/claude-opus-4.1',
  CLAUDE_SONNET_4: 'anthropic/claude-sonnet-4',
  GEMINI_2_5_PRO: 'google/gemini-2.5-pro',
  GEMINI_2_5_FLASH: 'google/gemini-2.5-flash',
  
  // Fallback models
  CLAUDE_3_5_SONNET: 'anthropic/claude-3-5-sonnet-20241022',
  GEMINI_2_0_PRO: 'google/gemini-2.0-pro-exp',
  GPT_4O: 'openai/gpt-4o',
  GPT_4O_MINI: 'openai/gpt-4o-mini',
  
  // Specialized models
  LLAMA_3_1_405B: 'meta-llama/llama-3.1-405b-instruct',
  MISTRAL_LARGE: 'mistralai/mistral-large',
  QWEN_2_5_72B: 'qwen/qwen-2.5-72b-instruct'
}

// Model capabilities and pricing (for reference)
export const MODEL_INFO = {
  [AI_MODELS.CLAUDE_OPUS_4_1]: {
    name: 'Claude Opus 4.1',
    strengths: ['Complex reasoning', 'Long context', 'Structured output'],
    context: 200000,
    bestFor: 'architecture'
  },
  [AI_MODELS.CLAUDE_SONNET_4]: {
    name: 'Claude Sonnet 4',
    strengths: ['Code generation', 'Fast response', 'Modern patterns'],
    context: 200000,
    bestFor: 'coding'
  },
  [AI_MODELS.GEMINI_2_5_PRO]: {
    name: 'Gemini 2.5 Pro',
    strengths: ['Creative design', 'Visual understanding', 'Innovation'],
    context: 2000000,
    bestFor: 'design'
  },
  [AI_MODELS.GEMINI_2_5_FLASH]: {
    name: 'Gemini 2.5 Flash',
    strengths: ['Speed', 'Optimization', 'Quick iterations'],
    context: 1000000,
    bestFor: 'optimization'
  },
  [AI_MODELS.GPT_4O]: {
    name: 'GPT-4o',
    strengths: ['General purpose', 'Understanding context', 'Versatility'],
    context: 128000,
    bestFor: 'general'
  }
}
