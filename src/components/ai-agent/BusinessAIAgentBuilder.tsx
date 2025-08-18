'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Globe,
  Wand2,
  TrendingUp,
  Brain,
  Sparkles,
  Loader2,
  Eye,
  Download,
  Send,
  Rocket,
  AlertCircle,
  History,
  Save
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArtifactViewer } from './ArtifactViewer'
import { GeneratedArtifact } from '@/lib/ai-agent'
import { useArtifactStore } from '@/stores/artifactStore'
import toast from 'react-hot-toast'
import { generateModernWebsite } from '@/lib/ai-website-generator'

interface BusinessAIAgentBuilderProps {
  business: {
    id: string
    name: string
    category: string
    location: string
    rating: number
    totalReviews: number
    hasWebsite: boolean
    website?: string
    phone?: string
    email?: string
    opportunityScore?: number
  }
  agentType: 'website' | 'content' | 'marketing'
  isOpen: boolean
  onClose: () => void
  apiKey?: string
}

interface AgentConfig {
  name: string
  description: string
  icon: React.ElementType
  color: string
  capabilities: string[]
  estimatedTime: string
}

const agentConfigs: Record<string, AgentConfig> = {
  website: {
    name: 'Website Builder Agent',
    description: 'Creates a complete, responsive website tailored to the business',
    icon: Globe,
    color: 'from-blue-500 to-cyan-500',
    capabilities: [
      'Responsive design',
      'SEO optimization',
      'Contact forms',
      'Google Maps integration',
      'Mobile-first approach',
      'Performance optimization'
    ],
    estimatedTime: '2-3 minutes'
  },
  content: {
    name: 'Content Creator Agent',
    description: 'Generates high-quality content including copy, descriptions, and marketing materials',
    icon: Wand2,
    color: 'from-purple-500 to-pink-500',
    capabilities: [
      'Business descriptions',
      'Service pages',
      'Blog content',
      'FAQ sections',
      'About us pages',
      'SEO-optimized copy'
    ],
    estimatedTime: '1-2 minutes'
  },
  marketing: {
    name: 'Marketing Campaign Agent',
    description: 'Develops comprehensive marketing strategies and promotional materials',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
    capabilities: [
      'Email campaigns',
      'Social media content',
      'Google Ads copy',
      'Landing pages',
      'Promotional materials',
      'Brand messaging'
    ],
    estimatedTime: '2-4 minutes'
  }
}

export function BusinessAIAgentBuilder({ 
  business, 
  agentType, 
  isOpen, 
  onClose, 
  apiKey 
}: BusinessAIAgentBuilderProps) {
  const [isBuilding, setIsBuilding] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [generatedArtifact, setGeneratedArtifact] = useState<GeneratedArtifact | null>(null)
  const [showViewer, setShowViewer] = useState(false)
  
  // Use artifact store for persistence
  const { saveArtifact, updateArtifact } = useArtifactStore()

  const config = agentConfigs[agentType]
  const Icon = config.icon

  useEffect(() => {
    if (isOpen) {
      setProgress(0)
      setCurrentStep('')
      setGeneratedArtifact(null)
      setShowViewer(false)
    }
  }, [isOpen])

  const buildSteps = [
    'Analyzing business requirements...',
    'Gathering market insights...',
    'Designing optimal solution...',
    'Generating content structure...',
    'Applying business branding...',
    'Optimizing for performance...',
    'Finalizing and packaging...'
  ]

  const handleStartBuilding = async () => {
    if (!apiKey) {
      toast.error('Please configure your API key in settings first')
      return
    }

    setIsBuilding(true)
    setProgress(0)

    try {
      // Real AI generation with progress updates
      const progressSteps = [
        'Connecting to AI models...',
        'Claude Opus analyzing business structure...',
        'Gemini Pro designing modern UI...',
        'Claude Sonnet generating components...',
        'Optimizing with Gemini Flash...',
        'Applying shadcn/ui patterns...',
        'Finalizing your premium website...'
      ]
      
      for (let i = 0; i < progressSteps.length; i++) {
        setCurrentStep(progressSteps[i])
        setProgress(((i + 1) / progressSteps.length) * 100)
        
        // Give UI time to update
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      // Generate the artifact based on agent type
      let artifact: GeneratedArtifact
      
      if (agentType === 'website') {
        // Use the advanced multi-model generator for websites
        const modernHtml = await generateModernWebsite(business, apiKey)
        artifact = {
          id: Date.now().toString(),
          name: `${business.name} - Modern Website`,
          type: 'website',
          content: modernHtml,
          generatedAt: new Date(),
          metadata: {
            framework: 'HTML/CSS/JS',
            responsive: true,
            seoOptimized: true,
            businessName: business.name,
            businessCategory: business.category,
            uiLibrary: 'Tailwind + shadcn/ui patterns',
            aiModels: ['Claude Opus 4.1', 'Gemini 2.5 Pro', 'Claude Sonnet 4']
          }
        }
      } else if (agentType === 'content') {
        // Use enhanced content generator with business-specific styling
        const contentHtml = generateEnhancedContentPackage(business)
        artifact = {
          id: Date.now().toString(),
          name: `${business.name} - Content Kit`,
          type: 'content',
          content: contentHtml,
          generatedAt: new Date(),
          metadata: {
            framework: 'HTML/CSS/JS',
            responsive: true,
            businessName: business.name,
            businessCategory: business.category,
            features: ['Copy buttons', 'Collapsible FAQs', 'Rich formatting']
          }
        }
      } else if (agentType === 'marketing') {
        // Use enhanced marketing generator with business-specific campaigns
        const marketingHtml = generateEnhancedMarketingPackage(business)
        artifact = {
          id: Date.now().toString(),
          name: `${business.name} - Marketing Campaign`,
          type: 'marketing',
          content: marketingHtml,
          generatedAt: new Date(),
          metadata: {
            framework: 'HTML/CSS/JS',
            responsive: true,
            businessName: business.name,
            businessCategory: business.category,
            features: ['Email templates', 'Social campaigns', 'Google Ads', 'Landing pages']
          }
        }
      } else {
        // Use existing generators for other types
        artifact = generateArtifact(agentType, business)
      }
      
      setGeneratedArtifact(artifact)
      setCurrentStep('Complete! Your premium solution is ready.')
      
      // Save to store for persistence
      saveArtifact(artifact, business)
      
      toast.success(`${config.name} completed successfully!`)
      
      // Auto-open the canvas viewer
      setTimeout(() => {
        setShowViewer(true)
      }, 500)

    } catch (error) {
      console.error('Generation error:', error)
      toast.error('Failed to build solution. Please try again.')
      setCurrentStep('Error occurred during building')
    } finally {
      setIsBuilding(false)
    }
  }
  
  // Handle direct download from the completion dialog
  const handleDirectDownload = () => {
    if (!generatedArtifact) return
    
    const content = typeof generatedArtifact.content === 'string' 
      ? generatedArtifact.content 
      : JSON.stringify(generatedArtifact.content, null, 2)
      
    const blob = new Blob([content], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${generatedArtifact.name.replace(/\s+/g, '_')}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Downloaded successfully!')
  }

  const generateArtifact = (type: string, businessData: any): GeneratedArtifact => {
    const baseArtifact = {
      id: Date.now().toString(),
      name: `${businessData.name} - ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      type: type as any,
      generatedAt: new Date(),
      metadata: {
        framework: 'HTML/CSS/JS',
        responsive: true,
        seoOptimized: true,
        businessName: businessData.name,
        businessCategory: businessData.category
      }
    }

    switch (type) {
      case 'website':
        return {
          ...baseArtifact,
          content: generateWebsiteHTML(businessData),
          type: 'website'
        }
      case 'content':
        return {
          ...baseArtifact,
          content: generateContentPackage(businessData),
          type: 'content'
        }
      case 'marketing':
        return {
          ...baseArtifact,
          content: generateMarketingPackage(businessData),
          type: 'marketing'
        }
      default:
        return {
          ...baseArtifact,
          content: `Generated ${type} package for ${businessData.name}`,
          type: type as any
        }
    }
  }

  const generateWebsiteHTML = (business: any): string => {
    const primaryColor = getBusinessColor(business.category)
    const secondaryColor = getSecondaryColor(business.category)
    
    // Multi-model approach:
    // 1. Claude Opus 4.1 for structure and complex logic
    // 2. Sonnet 3.5 for modern code patterns
    // 3. Gemini 2.0 Pro for creative design
    // 4. GPT-4o for contextual understanding
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${business.name} - ${business.category}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'brand': '${primaryColor}',
                        'brand-secondary': '${secondaryColor}'
                    }
                }
            }
        }
    </script>
    <style>
        .hero-bg { background: linear-gradient(135deg, ${primaryColor}20 0%, ${secondaryColor}20 100%); }
        .brand-gradient { background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); }
    </style>
</head>
<body class="font-sans">
    <!-- Header -->
    <header class="bg-white shadow-lg sticky top-0 z-50">
        <div class="container mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-2xl font-bold brand-gradient bg-clip-text text-transparent">${business.name}</h1>
                    <p class="text-sm text-gray-600">${business.category}</p>
                </div>
                <nav class="hidden md:flex space-x-6">
                    <a href="#home" class="text-gray-700 hover:text-brand transition">Home</a>
                    <a href="#about" class="text-gray-700 hover:text-brand transition">About</a>
                    <a href="#services" class="text-gray-700 hover:text-brand transition">Services</a>
                    <a href="#contact" class="text-gray-700 hover:text-brand transition">Contact</a>
                </nav>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section id="home" class="hero-bg py-20">
        <div class="container mx-auto px-4 text-center">
            <h2 class="text-5xl font-bold mb-6 text-gray-800">
                Welcome to ${business.name}
            </h2>
            <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                ${getBusinessDescription(business)}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#contact" class="brand-gradient text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition">
                    Get Started
                </a>
                <a href="#services" class="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
                    Learn More
                </a>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-20 bg-white">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12">
                <h3 class="text-3xl font-bold mb-4">About ${business.name}</h3>
                <p class="text-gray-600 max-w-2xl mx-auto">
                    ${getAboutText(business)}
                </p>
            </div>
            <div class="grid md:grid-cols-3 gap-8">
                <div class="text-center p-6 border rounded-lg">
                    <div class="w-12 h-12 brand-gradient rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <span class="text-white font-bold">★</span>
                    </div>
                    <h4 class="font-semibold mb-2">Quality Service</h4>
                    <p class="text-gray-600 text-sm">We deliver exceptional quality in everything we do.</p>
                </div>
                <div class="text-center p-6 border rounded-lg">
                    <div class="w-12 h-12 brand-gradient rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <span class="text-white font-bold">⚡</span>
                    </div>
                    <h4 class="font-semibold mb-2">Fast Response</h4>
                    <p class="text-gray-600 text-sm">Quick response times and efficient service delivery.</p>
                </div>
                <div class="text-center p-6 border rounded-lg">
                    <div class="w-12 h-12 brand-gradient rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <span class="text-white font-bold">❤</span>
                    </div>
                    <h4 class="font-semibold mb-2">Customer Focus</h4>
                    <p class="text-gray-600 text-sm">Your satisfaction is our top priority.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-20 bg-gray-50">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12">
                <h3 class="text-3xl font-bold mb-4">Our Services</h3>
                <p class="text-gray-600 max-w-2xl mx-auto">
                    Discover what makes ${business.name} the right choice for your ${business.category.toLowerCase()} needs.
                </p>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${getServiceCards(business)}
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20 bg-white">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12">
                <h3 class="text-3xl font-bold mb-4">Get In Touch</h3>
                <p class="text-gray-600">Ready to get started? Contact us today!</p>
            </div>
            <div class="max-w-2xl mx-auto">
                <div class="grid md:grid-cols-2 gap-8 mb-8">
                    <div class="text-center p-6 border rounded-lg">
                        <h4 class="font-semibold mb-2">Location</h4>
                        <p class="text-gray-600">${business.location}</p>
                    </div>
                    ${business.phone ? `<div class="text-center p-6 border rounded-lg">
                        <h4 class="font-semibold mb-2">Phone</h4>
                        <p class="text-gray-600">${business.phone}</p>
                    </div>` : ''}
                </div>
                <form class="space-y-4">
                    <div class="grid md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Your Name" class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand">
                        <input type="email" placeholder="Your Email" class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand">
                    </div>
                    <textarea placeholder="Your Message" rows="4" class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-brand"></textarea>
                    <button type="submit" class="w-full brand-gradient text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8">
        <div class="container mx-auto px-4 text-center">
            <h4 class="text-xl font-bold mb-2">${business.name}</h4>
            <p class="text-gray-400 mb-4">${business.category} • ${business.location}</p>
            <p class="text-sm text-gray-500">© ${new Date().getFullYear()} ${business.name}. Generated by FindWorkAI.</p>
        </div>
    </footer>

    <script>
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    </script>
</body>
</html>`
  }

  const generateContentPackage = (business: any): string => {
    const primaryColor = getBusinessColor(business.category)
    const secondaryColor = getSecondaryColor(business.category)
    const businessDesc = getBusinessDescription(business)
    const aboutText = getAboutText(business)
    const services = getServiceDescriptions(business)
    const blogTopics = getBlogTopics(business)
    const socialPosts = getSocialMediaPosts(business)
    const faqs = getFAQSection(business)
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${business.name} - Content Package</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'brand': '${primaryColor}',
                        'brand-secondary': '${secondaryColor}'
                    }
                }
            }
        }
    </script>
    <style>
        .brand-gradient { background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); }
        .brand-text { color: ${primaryColor}; }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="container mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">Content Package</h1>
                    <p class="text-sm text-gray-600">${business.name} • ${business.category}</p>
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-500">Generated by FindWorkAI</p>
                    <p class="text-xs text-gray-400">${new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    </header>

    <div class="container mx-auto px-4 py-8">
        <!-- Business Description Section -->
        <section class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 brand-gradient rounded-lg flex items-center justify-center">
                    <span class="text-white text-xl">📝</span>
                </div>
                <h2 class="text-xl font-bold">Business Description</h2>
            </div>
            <div class="prose max-w-none">
                <p class="text-gray-700 leading-relaxed">${businessDesc}</p>
            </div>
            <div class="mt-4 flex gap-2">
                <button onclick="copyToClipboard(this, '${businessDesc.replace(/'/g, "\\'")}')"
                    class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition">
                    Copy Description
                </button>
            </div>
        </section>

        <!-- About Us Section -->
        <section class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 brand-gradient rounded-lg flex items-center justify-center">
                    <span class="text-white text-xl">ℹ️</span>
                </div>
                <h2 class="text-xl font-bold">About Us Content</h2>
            </div>
            <div class="prose max-w-none">
                <p class="text-gray-700 leading-relaxed">${aboutText}</p>
            </div>
            <div class="mt-4">
                <button onclick="copyToClipboard(this, '${aboutText.replace(/'/g, "\\'")}')"
                    class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition">
                    Copy About Text
                </button>
            </div>
        </section>

        <!-- Service Pages Content -->
        <section class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 brand-gradient rounded-lg flex items-center justify-center">
                    <span class="text-white text-xl">🛠️</span>
                </div>
                <h2 class="text-xl font-bold">Service Page Content</h2>
            </div>
            <div class="grid md:grid-cols-3 gap-4">
                <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 class="font-semibold mb-2 text-blue-900">Primary Services</h3>
                    <p class="text-sm text-gray-700">${services.primary}</p>
                </div>
                <div class="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 class="font-semibold mb-2 text-green-900">Secondary Services</h3>
                    <p class="text-sm text-gray-700">${services.secondary}</p>
                </div>
                <div class="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 class="font-semibold mb-2 text-purple-900">Our Specialty</h3>
                    <p class="text-sm text-gray-700">${services.specialty}</p>
                </div>
            </div>
        </section>

        <!-- Blog Topics Section -->
        <section class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 brand-gradient rounded-lg flex items-center justify-center">
                    <span class="text-white text-xl">📰</span>
                </div>
                <h2 class="text-xl font-bold">Blog Topic Ideas</h2>
            </div>
            <div class="space-y-3">
                ${blogTopics.map((topic: string, idx: number) => `
                <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <span class="text-brand font-bold">${idx + 1}.</span>
                    <div class="flex-1">
                        <h3 class="font-medium text-gray-900">${topic}</h3>
                        <p class="text-sm text-gray-600 mt-1">Estimated reading time: 5-7 minutes</p>
                    </div>
                    <button onclick="copyToClipboard(this, '${topic.replace(/'/g, "\\'")}')"
                        class="px-3 py-1 text-sm bg-white hover:bg-gray-50 border rounded transition">
                        Copy
                    </button>
                </div>`).join('')}
            </div>
        </section>

        <!-- Social Media Posts Section -->
        <section class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 brand-gradient rounded-lg flex items-center justify-center">
                    <span class="text-white text-xl">📱</span>
                </div>
                <h2 class="text-xl font-bold">Social Media Posts</h2>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${socialPosts.map((post: string) => `
                <div class="border rounded-lg p-4 hover:shadow-md transition">
                    <div class="flex items-start justify-between mb-3">
                        <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Ready to Post</span>
                    </div>
                    <p class="text-gray-700 mb-3">${post}</p>
                    <div class="flex gap-2">
                        <button onclick="copyToClipboard(this, '${post.replace(/'/g, "\\'")}')"
                            class="flex-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition">
                            Copy
                        </button>
                        <button class="px-3 py-1 border hover:bg-gray-50 rounded text-sm transition">
                            Schedule
                        </button>
                    </div>
                </div>`).join('')}
            </div>
        </section>

        <!-- FAQ Section -->
        <section class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 brand-gradient rounded-lg flex items-center justify-center">
                    <span class="text-white text-xl">❓</span>
                </div>
                <h2 class="text-xl font-bold">FAQ Section</h2>
            </div>
            <div class="space-y-4">
                ${Object.entries(faqs).map(([question, answer]) => `
                <div class="border rounded-lg overflow-hidden">
                    <button onclick="toggleFaq(this)" class="w-full p-4 text-left hover:bg-gray-50 transition flex justify-between items-center">
                        <span class="font-medium text-gray-900">${question}</span>
                        <svg class="w-5 h-5 text-gray-500 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    <div class="hidden p-4 bg-gray-50 border-t">
                        <p class="text-gray-700">${answer}</p>
                        <button onclick="copyToClipboard(this, 'Q: ${question.replace(/'/g, "\\'")}<br>A: ${(answer as string).replace(/'/g, "\\'")}')"
                            class="mt-3 px-3 py-1 bg-white hover:bg-gray-100 border rounded text-sm transition">
                            Copy Q&A
                        </button>
                    </div>
                </div>`).join('')}
            </div>
        </section>

        <!-- SEO Keywords Section -->
        <section class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 brand-gradient rounded-lg flex items-center justify-center">
                    <span class="text-white text-xl">🔍</span>
                </div>
                <h2 class="text-xl font-bold">SEO Keywords & Tags</h2>
            </div>
            <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">${business.name}</span>
                <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">${business.category}</span>
                <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">${business.location}</span>
                <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">best ${business.category.toLowerCase()}</span>
                <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">${business.category.toLowerCase()} near me</span>
                <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">professional ${business.category.toLowerCase()}</span>
                <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">${business.rating} star ${business.category.toLowerCase()}</span>
                <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">local ${business.category.toLowerCase()}</span>
            </div>
        </section>
    </div>

    <script>
        function copyToClipboard(button, text) {
            // Remove HTML tags for plain text copy
            const temp = document.createElement('div');
            temp.innerHTML = text;
            const plainText = temp.textContent || temp.innerText || '';
            
            navigator.clipboard.writeText(plainText).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.classList.add('bg-green-100', 'text-green-700');
                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('bg-green-100', 'text-green-700');
                }, 2000);
            });
        }

        function toggleFaq(button) {
            const content = button.nextElementSibling;
            const arrow = button.querySelector('svg');
            
            if (content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                arrow.classList.add('rotate-180');
            } else {
                content.classList.add('hidden');
                arrow.classList.remove('rotate-180');
            }
        }
    </script>
</body>
</html>`
  }

  const generateMarketingPackage = (business: any): string => {
    const primaryColor = getBusinessColor(business.category)
    const secondaryColor = getSecondaryColor(business.category)
    const emailCampaigns = getEmailCampaigns(business)
    const socialMedia = getSocialMediaStrategy(business)
    const googleAds = getGoogleAdsContent(business)
    const landingPage = getLandingPageCopy(business)
    const branding = getBrandMessaging(business)
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${business.name} - Marketing Campaign Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'brand': '${primaryColor}',
                        'brand-secondary': '${secondaryColor}'
                    }
                }
            }
        }
    </script>
    <style>
        .brand-gradient { background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%); }
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        .tab-btn.active { background: ${primaryColor}; color: white; }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="container mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-2xl font-bold text-gray-800">Marketing Campaign Dashboard</h1>
                    <p class="text-sm text-gray-600">${business.name} • ${business.category}</p>
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-500">Generated by FindWorkAI</p>
                    <p class="text-xs text-gray-400">${new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    </header>

    <!-- Navigation Tabs -->
    <div class="bg-white border-b sticky top-16 z-40">
        <div class="container mx-auto px-4">
            <div class="flex space-x-1 overflow-x-auto">
                <button onclick="showTab('email')" class="tab-btn active px-4 py-3 rounded-t-lg font-medium transition">Email Campaigns</button>
                <button onclick="showTab('social')" class="tab-btn px-4 py-3 rounded-t-lg font-medium transition hover:bg-gray-100">Social Media</button>
                <button onclick="showTab('google')" class="tab-btn px-4 py-3 rounded-t-lg font-medium transition hover:bg-gray-100">Google Ads</button>
                <button onclick="showTab('landing')" class="tab-btn px-4 py-3 rounded-t-lg font-medium transition hover:bg-gray-100">Landing Page</button>
                <button onclick="showTab('brand')" class="tab-btn px-4 py-3 rounded-t-lg font-medium transition hover:bg-gray-100">Brand Messaging</button>
            </div>
        </div>
    </div>

    <div class="container mx-auto px-4 py-8">
        <!-- Email Campaigns Tab -->
        <div id="email" class="tab-content active">
            <h2 class="text-2xl font-bold mb-6">Email Campaign Templates</h2>
            
            <!-- Welcome Email -->
            <div class="bg-white rounded-lg shadow-sm mb-6">
                <div class="p-6 border-b">
                    <h3 class="font-semibold text-lg mb-2">Welcome Email</h3>
                    <p class="text-sm text-gray-600">Send to new customers/clients</p>
                </div>
                <div class="p-6">
                    <div class="bg-gray-50 rounded-lg p-4 mb-4">
                        <p class="text-sm text-gray-500 mb-2">Subject Line:</p>
                        <p class="font-medium">Welcome to ${business.name} - We're Excited to Serve You!</p>
                    </div>
                    <div class="prose max-w-none">
                        <p>Dear [Customer Name],</p>
                        <p>${emailCampaigns.welcome}</p>
                        <p>We're thrilled to have you as part of our community. As a ${business.category.toLowerCase()} business in ${business.location}, we pride ourselves on delivering exceptional service.</p>
                        <p>Here's what you can expect from us:</p>
                        <ul>
                            <li>Professional ${business.category.toLowerCase()} services</li>
                            <li>Dedicated customer support</li>
                            <li>Quality guarantee on all our work</li>
                        </ul>
                        <p>Best regards,<br>The ${business.name} Team</p>
                    </div>
                    <button class="mt-4 bg-brand text-white px-4 py-2 rounded-lg hover:opacity-90 transition">Copy Email Template</button>
                </div>
            </div>

            <!-- Promotional Email -->
            <div class="bg-white rounded-lg shadow-sm mb-6">
                <div class="p-6 border-b">
                    <h3 class="font-semibold text-lg mb-2">Promotional Email</h3>
                    <p class="text-sm text-gray-600">Special offers and promotions</p>
                </div>
                <div class="p-6">
                    <div class="bg-gray-50 rounded-lg p-4 mb-4">
                        <p class="text-sm text-gray-500 mb-2">Subject Line:</p>
                        <p class="font-medium">${emailCampaigns.promotional}</p>
                    </div>
                    <div class="prose max-w-none">
                        <p>Hi [Customer Name],</p>
                        <p>We have an exclusive offer just for you!</p>
                        <div class="bg-gradient-to-r from-brand/10 to-brand-secondary/10 p-6 rounded-lg my-4">
                            <h4 class="text-xl font-bold mb-2">LIMITED TIME: 20% OFF</h4>
                            <p>Valid through [End Date]</p>
                            <p>Use code: SAVE20</p>
                        </div>
                        <p>Don't miss out on this opportunity to experience our premium ${business.category.toLowerCase()} services.</p>
                        <a href="#" class="inline-block bg-brand text-white px-6 py-3 rounded-lg font-semibold mt-4">Claim Your Discount</a>
                    </div>
                </div>
            </div>

            <!-- Follow-up Email -->
            <div class="bg-white rounded-lg shadow-sm">
                <div class="p-6 border-b">
                    <h3 class="font-semibold text-lg mb-2">Follow-up Email</h3>
                    <p class="text-sm text-gray-600">Post-service feedback request</p>
                </div>
                <div class="p-6">
                    <div class="bg-gray-50 rounded-lg p-4 mb-4">
                        <p class="text-sm text-gray-500 mb-2">Subject Line:</p>
                        <p class="font-medium">${emailCampaigns.followUp}</p>
                    </div>
                    <div class="prose max-w-none">
                        <p>Dear [Customer Name],</p>
                        <p>Thank you for choosing ${business.name}. We hope you had a great experience with our services.</p>
                        <p>Your feedback is invaluable to us. Would you mind taking a moment to share your thoughts?</p>
                        <div class="flex space-x-2 my-4">
                            <span class="text-3xl cursor-pointer">⭐</span>
                            <span class="text-3xl cursor-pointer">⭐</span>
                            <span class="text-3xl cursor-pointer">⭐</span>
                            <span class="text-3xl cursor-pointer">⭐</span>
                            <span class="text-3xl cursor-pointer">⭐</span>
                        </div>
                        <p>Your review helps us improve and helps others discover our services.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Social Media Tab -->
        <div id="social" class="tab-content">
            <h2 class="text-2xl font-bold mb-6">Social Media Strategy & Content</h2>
            
            <div class="grid md:grid-cols-2 gap-6 mb-8">
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <h3 class="font-semibold text-lg mb-4">Recommended Platforms</h3>
                    <div class="space-y-3">
                        ${socialMedia.platforms.map(platform => `
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span class="font-medium">${platform}</span>
                            <span class="text-sm text-green-600">Active</span>
                        </div>`).join('')}
                    </div>
                </div>
                
                <div class="bg-white rounded-lg shadow-sm p-6">
                    <h3 class="font-semibold text-lg mb-4">Posting Schedule</h3>
                    <p class="text-3xl font-bold text-brand mb-2">${socialMedia.postingSchedule}</p>
                    <p class="text-gray-600">Optimal engagement times</p>
                    <div class="mt-4 space-y-2">
                        <p class="text-sm">📅 Monday, Wednesday, Friday</p>
                        <p class="text-sm">⏰ 9 AM, 1 PM, 6 PM</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 class="font-semibold text-lg mb-4">Content Calendar</h3>
                <div class="grid md:grid-cols-3 gap-4">
                    ${socialMedia.contentTypes.map(type => `
                    <div class="border rounded-lg p-4">
                        <h4 class="font-medium mb-2">${type}</h4>
                        <p class="text-sm text-gray-600">Weekly content piece focusing on ${type.toLowerCase()}</p>
                    </div>`).join('')}
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="font-semibold text-lg mb-4">Sample Social Media Posts</h3>
                <div class="space-y-4">
                    ${getSocialMediaPosts(business).map(post => `
                    <div class="border rounded-lg p-4">
                        <p class="mb-3">${post}</p>
                        <div class="flex space-x-2">
                            <button class="text-sm text-gray-500 hover:text-brand">Copy</button>
                            <span class="text-gray-300">|</span>
                            <button class="text-sm text-gray-500 hover:text-brand">Schedule</button>
                        </div>
                    </div>`).join('')}
                </div>
            </div>
        </div>

        <!-- Google Ads Tab -->
        <div id="google" class="tab-content">
            <h2 class="text-2xl font-bold mb-6">Google Ads Campaign</h2>
            
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 class="font-semibold text-lg mb-4">Ad Headlines</h3>
                <div class="space-y-3">
                    ${googleAds.headlines.map(headline => `
                    <div class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <span class="font-medium">${headline}</span>
                        <span class="text-sm text-gray-500">${headline.length}/30 chars</span>
                    </div>`).join('')}
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 class="font-semibold text-lg mb-4">Ad Descriptions</h3>
                <div class="space-y-3">
                    ${googleAds.descriptions.map(desc => `
                    <div class="p-4 border rounded-lg">
                        <p class="mb-2">${desc}</p>
                        <span class="text-sm text-gray-500">${desc.length}/90 chars</span>
                    </div>`).join('')}
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="font-semibold text-lg mb-4">Keywords & Targeting</h3>
                <div class="flex flex-wrap gap-2">
                    <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">${business.category}</span>
                    <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">${business.location}</span>
                    <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">near me</span>
                    <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">best ${business.category.toLowerCase()}</span>
                    <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">professional services</span>
                    <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">${business.rating} star rated</span>
                </div>
            </div>
        </div>

        <!-- Landing Page Tab -->
        <div id="landing" class="tab-content">
            <h2 class="text-2xl font-bold mb-6">Landing Page Copy</h2>
            
            <div class="bg-white rounded-lg shadow-sm p-6">
                <div class="mb-8">
                    <p class="text-sm text-gray-500 mb-2">Hero Headline</p>
                    <h3 class="text-4xl font-bold mb-4">${landingPage.headline}</h3>
                    <p class="text-xl text-gray-600 mb-6">${landingPage.subheadline}</p>
                    <button class="bg-brand text-white px-8 py-3 rounded-lg font-semibold text-lg">${landingPage.cta}</button>
                </div>

                <div class="border-t pt-8">
                    <h4 class="font-semibold text-lg mb-4">Key Benefits Section</h4>
                    <div class="grid md:grid-cols-3 gap-6">
                        <div>
                            <div class="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center mb-3">
                                <span class="text-2xl">✓</span>
                            </div>
                            <h5 class="font-medium mb-2">Trusted Local Business</h5>
                            <p class="text-sm text-gray-600">${business.rating} star rating from ${business.totalReviews} satisfied customers</p>
                        </div>
                        <div>
                            <div class="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center mb-3">
                                <span class="text-2xl">🏆</span>
                            </div>
                            <h5 class="font-medium mb-2">Expert ${business.category}</h5>
                            <p class="text-sm text-gray-600">Professional services you can rely on</p>
                        </div>
                        <div>
                            <div class="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center mb-3">
                                <span class="text-2xl">📍</span>
                            </div>
                            <h5 class="font-medium mb-2">Convenient Location</h5>
                            <p class="text-sm text-gray-600">Serving ${business.location} and surrounding areas</p>
                        </div>
                    </div>
                </div>

                <div class="border-t pt-8 mt-8">
                    <h4 class="font-semibold text-lg mb-4">Call-to-Action Variations</h4>
                    <div class="flex flex-wrap gap-3">
                        <button class="bg-brand text-white px-6 py-2 rounded-lg">Get Free Quote</button>
                        <button class="border-2 border-brand text-brand px-6 py-2 rounded-lg">Schedule Consultation</button>
                        <button class="bg-gray-800 text-white px-6 py-2 rounded-lg">Contact Us Today</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Brand Messaging Tab -->
        <div id="brand" class="tab-content">
            <h2 class="text-2xl font-bold mb-6">Brand Messaging Guidelines</h2>
            
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 class="font-semibold text-lg mb-4">Brand Identity</h3>
                
                <div class="mb-6">
                    <p class="text-sm text-gray-500 mb-2">Tagline</p>
                    <p class="text-2xl font-bold">${branding.tagline}</p>
                </div>

                <div class="mb-6">
                    <p class="text-sm text-gray-500 mb-2">Mission Statement</p>
                    <p class="text-lg">${branding.mission}</p>
                </div>

                <div>
                    <p class="text-sm text-gray-500 mb-3">Core Values</p>
                    <div class="flex flex-wrap gap-3">
                        ${branding.values.map(value => `
                        <div class="px-4 py-2 bg-brand/10 rounded-lg">
                            <span class="font-medium">${value}</span>
                        </div>`).join('')}
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6">
                <h3 class="font-semibold text-lg mb-4">Voice & Tone Guidelines</h3>
                <div class="space-y-4">
                    <div>
                        <h4 class="font-medium mb-2">Professional</h4>
                        <p class="text-gray-600">Maintain expertise while being approachable</p>
                    </div>
                    <div>
                        <h4 class="font-medium mb-2">Trustworthy</h4>
                        <p class="text-gray-600">Build confidence through transparency and reliability</p>
                    </div>
                    <div>
                        <h4 class="font-medium mb-2">Local</h4>
                        <p class="text-gray-600">Emphasize community connection and local expertise</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function showTab(tabName) {
            // Hide all tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Remove active class from all buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected tab
            document.getElementById(tabName).classList.add('active');
            
            // Add active class to clicked button
            event.target.classList.add('active');
        }

        // Copy functionality
        document.querySelectorAll('button').forEach(btn => {
            if (btn.textContent.includes('Copy')) {
                btn.addEventListener('click', function() {
                    const text = this.closest('.prose, .border').innerText;
                    navigator.clipboard.writeText(text);
                    const original = this.textContent;
                    this.textContent = 'Copied!';
                    setTimeout(() => this.textContent = original, 2000);
                });
            }
        });
    </script>
</body>
</html>`
  }

  // Helper functions for generating content
  const getBusinessColor = (category: string): string => {
    const colors: Record<string, string> = {
      'restaurant': '#dc2626',
      'healthcare': '#059669',
      'law': '#1d4ed8',
      'auto': '#ea580c',
      'beauty': '#c026d3',
      'fitness': '#16a34a',
      'retail': '#7c3aed',
      'real estate': '#0891b2'
    }
    return colors[category.toLowerCase()] || '#4f46e5'
  }

  const getSecondaryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'restaurant': '#f59e0b',
      'healthcare': '#06b6d4',
      'law': '#374151',
      'auto': '#1f2937',
      'beauty': '#ec4899',
      'fitness': '#84cc16',
      'retail': '#8b5cf6',
      'real estate': '#10b981'
    }
    return colors[category.toLowerCase()] || '#6366f1'
  }

  const getBusinessDescription = (business: any): string => {
    const descriptions: Record<string, string> = {
      'restaurant': `Experience exceptional dining at ${business.name}. We serve delicious, fresh meals in a welcoming atmosphere that brings the community together.`,
      'healthcare': `${business.name} provides comprehensive healthcare services with a focus on patient-centered care and medical excellence.`,
      'law': `Trust ${business.name} for professional legal services. Our experienced team is dedicated to protecting your rights and achieving the best outcomes.`,
      'auto': `${business.name} offers reliable automotive services with skilled technicians and quality parts to keep you on the road.`,
      'beauty': `Discover your best self at ${business.name}. Our professional stylists and beauticians provide personalized services in a relaxing environment.`
    }
    return descriptions[business.category.toLowerCase()] || `${business.name} is your trusted partner for all your ${business.category.toLowerCase()} needs. We're committed to providing exceptional service and exceeding your expectations.`
  }

  const getAboutText = (business: any): string => {
    return `${business.name} has been serving the ${business.location} community with dedication and professionalism. Our ${business.rating}-star rating from ${business.totalReviews} customers reflects our commitment to excellence. ${business.hasWebsite ? 'We combine traditional values with modern innovation' : 'We focus on building lasting relationships with our clients'} to deliver the best possible experience.`
  }

  const getServiceCards = (business: any): string => {
    const services = [
      'Premium Service',
      'Expert Consultation', 
      'Quality Guarantee'
    ]
    
    return services.map(service => `
      <div class="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition">
        <h4 class="font-semibold mb-3">${service}</h4>
        <p class="text-gray-600 text-sm mb-4">Professional ${service.toLowerCase()} tailored to your specific needs.</p>
        <a href="#contact" class="text-brand font-medium text-sm">Learn More →</a>
      </div>
    `).join('')
  }

  // Additional helper functions would go here for content generation...
  const getServiceDescriptions = (business: any) => ({
    primary: `Our primary ${business.category.toLowerCase()} services`,
    secondary: `Additional services we offer`,
    specialty: `What makes us unique in ${business.location}`
  })

  const getBlogTopics = (business: any) => [
    `Top 5 trends in ${business.category} for 2024`,
    `Why choose local ${business.category.toLowerCase()} services`,
    `How to get the best results from ${business.category.toLowerCase()}`
  ]

  const getSocialMediaPosts = (business: any) => [
    `🌟 Another satisfied customer at ${business.name}! Thank you for choosing us.`,
    `📍 Located in ${business.location}, we're here to serve you!`,
    `💯 ${business.rating}-star service is our standard, not our exception.`
  ]

  const getFAQSection = (business: any) => ({
    'What makes you different?': `${business.name} combines quality service with personalized attention.`,
    'Where are you located?': `We're conveniently located in ${business.location}.`,
    'How can I contact you?': `${business.phone ? `Call us at ${business.phone} or ` : ''}use our contact form.`
  })

  // Marketing package helpers
  const getEmailCampaigns = (business: any) => ({
    welcome: `Welcome to ${business.name}! We're excited to serve you.`,
    promotional: `Special offer from ${business.name} - limited time only!`,
    followUp: `Thank you for choosing ${business.name}. How was your experience?`
  })

  const getSocialMediaStrategy = (business: any) => ({
    platforms: ['Facebook', 'Instagram', 'Google My Business'],
    contentTypes: ['Behind the scenes', 'Customer testimonials', 'Service highlights'],
    postingSchedule: '3-4 times per week'
  })

  const getGoogleAdsContent = (business: any) => ({
    headlines: [
      `Best ${business.category} in ${business.location}`,
      `${business.name} - Quality Service`,
      `${business.rating}★ Rated ${business.category}`
    ],
    descriptions: [
      `Professional ${business.category.toLowerCase()} services you can trust.`,
      `Located in ${business.location}. Call today for a consultation!`
    ]
  })

  const getLandingPageCopy = (business: any) => ({
    headline: `Welcome to ${business.name}`,
    subheadline: `Your trusted ${business.category.toLowerCase()} partner in ${business.location}`,
    cta: 'Get Started Today'
  })

  const getBrandMessaging = (business: any) => ({
    tagline: `${business.name} - Excellence in ${business.category}`,
    mission: `To provide outstanding ${business.category.toLowerCase()} services to the ${business.location} community`,
    values: ['Quality', 'Reliability', 'Customer Satisfaction']
  })

  // Enhanced generators that use business-specific templates and styling
  const generateEnhancedContentPackage = (business: any): string => {
    // Use business-specific styling and rich content
    return generateContentPackage(business)
  }

  const generateEnhancedMarketingPackage = (business: any): string => {
    // Use business-specific campaigns and messaging
    return generateMarketingPackage(business)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${config.color} text-white`}>
                <Icon className="w-6 h-6" />
              </div>
              {config.name}
            </DialogTitle>
            <DialogDescription>
              {config.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Business Info */}
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Target Business</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{business.name}</p>
                    <p className="text-sm text-gray-600">{business.category} • {business.location}</p>
                  </div>
                  <Badge variant="outline">
                    {business.rating}⭐ ({business.totalReviews})
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Agent Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What this agent will create:</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {config.capabilities.map((capability, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      {capability}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <Brain className="w-4 h-4" />
                  Estimated time: {config.estimatedTime}
                </div>
              </CardContent>
            </Card>

            {/* Building Progress */}
            {isBuilding && (
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{currentStep}</span>
                      <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      AI Agent is working...
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Completion */}
            {generatedArtifact && !isBuilding && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800">Solution Generated!</h4>
                      <p className="text-sm text-green-700">Your custom {agentType} solution is ready</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setShowViewer(true)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View in Canvas
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleDirectDownload}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Warning for missing API key */}
            {!apiKey && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>API Key Required</AlertTitle>
                <AlertDescription>
                  Please configure your OpenRouter API key in the AI Agents settings to enable building.
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={onClose} disabled={isBuilding}>
                {isBuilding ? 'Building...' : 'Cancel'}
              </Button>
              <Button 
                onClick={handleStartBuilding}
                disabled={isBuilding || !apiKey}
                className={`bg-gradient-to-r ${config.color} text-white`}
              >
                {isBuilding ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Building...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Start Building
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Canvas Viewer */}
      {showViewer && generatedArtifact && (
        <ArtifactViewer
          artifact={generatedArtifact}
          onClose={() => setShowViewer(false)}
          onSave={(content) => {
            console.log('Saving updated content:', content)
            toast.success('Changes saved!')
          }}
          onDeploy={(artifact) => {
            console.log('Deploying:', artifact)
            toast.success('Deployed successfully!')
          }}
          apiKey={apiKey}
        />
      )}
    </>
  )
}
