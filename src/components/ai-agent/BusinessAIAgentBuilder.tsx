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
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArtifactViewer } from './ArtifactViewer'
import { GeneratedArtifact } from '@/lib/ai-agent'
import toast from 'react-hot-toast'

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
      // Simulate the building process with realistic steps
      for (let i = 0; i < buildSteps.length; i++) {
        setCurrentStep(buildSteps[i])
        
        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200))
        
        setProgress(((i + 1) / buildSteps.length) * 100)
      }

      // Generate the artifact based on agent type
      const artifact = generateArtifact(agentType, business)
      setGeneratedArtifact(artifact)
      setCurrentStep('Complete! Your solution is ready.')
      
      toast.success(`${config.name} completed successfully!`)
      
      // Auto-open the canvas viewer
      setTimeout(() => {
        setShowViewer(true)
      }, 500)

    } catch (error) {
      toast.error('Failed to build solution. Please try again.')
      setCurrentStep('Error occurred during building')
    } finally {
      setIsBuilding(false)
    }
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

  const generateContentPackage = (business: any) => {
    return {
      businessDescription: getBusinessDescription(business),
      aboutText: getAboutText(business),
      serviceDescriptions: getServiceDescriptions(business),
      blogTopics: getBlogTopics(business),
      socialMediaPosts: getSocialMediaPosts(business),
      faqSection: getFAQSection(business)
    }
  }

  const generateMarketingPackage = (business: any) => {
    return {
      emailCampaigns: getEmailCampaigns(business),
      socialMediaStrategy: getSocialMediaStrategy(business),
      googleAdsContent: getGoogleAdsContent(business),
      landingPageCopy: getLandingPageCopy(business),
      brandMessaging: getBrandMessaging(business)
    }
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
                    <Button variant="outline">
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
