'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Code,
  Eye,
  Download,
  Copy,
  Maximize2,
  Minimize2,
  Smartphone,
  Monitor,
  Tablet,
  Edit,
  Save,
  Share2,
  ExternalLink,
  Palette,
  Type,
  Layout,
  Sparkles,
  RefreshCw,
  Send,
  Check,
  X
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GeneratedArtifact } from '@/lib/ai-agent'
import { Textarea } from '@/components/ui/textarea'
import toast from 'react-hot-toast'

interface ArtifactViewerProps {
  artifact: GeneratedArtifact
  onClose: () => void
  onSave?: (updatedContent: any) => void
  onDeploy?: (artifact: GeneratedArtifact) => void
  apiKey?: string
}

type ViewMode = 'desktop' | 'tablet' | 'mobile'
type PreviewMode = 'preview' | 'code' | 'split'

const deviceSizes = {
  desktop: { width: '100%', height: '100%', label: 'Desktop', icon: Monitor },
  tablet: { width: '768px', height: '1024px', label: 'Tablet', icon: Tablet },
  mobile: { width: '375px', height: '667px', label: 'Mobile', icon: Smartphone }
}

export function ArtifactViewer({ artifact, onClose, onSave, onDeploy, apiKey }: ArtifactViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop')
  const [previewMode, setPreviewMode] = useState<PreviewMode>('preview')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [code, setCode] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editedCode, setEditedCode] = useState('')
  const [zoom, setZoom] = useState(85) // Start with 85% zoom for better initial fit
  const [isCopied, setIsCopied] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Format the content based on artifact type
    if (artifact.type === 'website' || artifact.type === 'landing-page' || artifact.type === 'marketing' || artifact.type === 'content') {
      // Check if this is a React component artifact
      if (artifact.content && typeof artifact.content === 'object' && artifact.content.isReactComponent) {
        // For React component artifacts, we'll render them differently
        const reactComponentHtml = generateReactComponentHTML(artifact.content)
        setCode(reactComponentHtml)
        setEditedCode(reactComponentHtml)
      } else {
        const htmlContent = typeof artifact.content === 'string' 
          ? artifact.content 
          : generateHTMLFromObject(artifact.content)
        setCode(htmlContent)
        setEditedCode(htmlContent)
      }
    } else if (artifact.type === 'email') {
      const emailHTML = generateEmailHTML(artifact.content)
      setCode(emailHTML)
      setEditedCode(emailHTML)
    } else {
      const formattedContent = typeof artifact.content === 'string'
        ? artifact.content
        : JSON.stringify(artifact.content, null, 2)
      setCode(formattedContent)
      setEditedCode(formattedContent)
    }
  }, [artifact])

  // Update iframe content when code changes
  useEffect(() => {
    if (iframeRef.current && (artifact.type === 'website' || artifact.type === 'landing-page' || artifact.type === 'email' || artifact.type === 'marketing' || artifact.type === 'content')) {
      const doc = iframeRef.current.contentDocument
      if (doc) {
        doc.open()
        doc.write(isEditing ? editedCode : code)
        doc.close()
      }
    }
  }, [code, editedCode, isEditing, artifact.type])

  const generateHTMLFromObject = (content: any): string => {
    // If content is already HTML string, return it
    if (typeof content === 'string' && content.includes('<html')) {
      return content
    }

    // Generate a basic HTML template
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${artifact.name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, -apple-system, sans-serif; }
    </style>
</head>
<body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
    <div class="container mx-auto px-4 py-12">
        <header class="text-center mb-12">
            <h1 class="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                ${content.title || artifact.name}
            </h1>
            <p class="text-xl text-gray-600">${content.description || 'AI Generated Content'}</p>
        </header>
        
        <main class="max-w-4xl mx-auto">
            ${generateContentSections(content)}
        </main>
        
        <footer class="mt-16 text-center text-gray-500">
            <p>Generated by FindWorkAI Agent</p>
        </footer>
    </div>
</body>
</html>`
  }

  const generateContentSections = (content: any): string => {
    if (typeof content === 'string') {
      return `<div class="prose max-w-none">${content}</div>`
    }
    
    let sections = ''
    
    if (content.sections && Array.isArray(content.sections)) {
      content.sections.forEach((section: any) => {
        sections += `
        <section class="mb-8 p-6 bg-white rounded-lg shadow-md">
            <h2 class="text-2xl font-bold mb-4">${section.title || ''}</h2>
            <div class="prose">${section.content || ''}</div>
        </section>`
      })
    } else {
      sections = `
      <div class="p-6 bg-white rounded-lg shadow-md">
        <pre class="whitespace-pre-wrap">${JSON.stringify(content, null, 2)}</pre>
      </div>`
    }
    
    return sections
  }

  const generateReactComponentHTML = (content: any): string => {
    // Extract business data from React component content
    const { businessData, businessType, includeAnimations } = content
    
    // Generate a working website using the React component data
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessData.name} - Professional ${businessType} Business</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/framer-motion@10/dist/framer-motion.min.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .brand-gradient { 
            background: linear-gradient(135deg, ${getBusinessTypeColors(businessType).primary} 0%, ${getBusinessTypeColors(businessType).secondary} 100%);
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-scale-in {
            animation: scaleIn 0.6s ease-out forwards;
        }
        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        .glass-effect {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
    </style>
</head>
<body class="antialiased">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div class="container mx-auto px-4 py-3">
            <div class="flex justify-between items-center">
                <div class="font-bold text-xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    ${businessData.name}
                </div>
                <div class="hidden md:flex space-x-6">
                    <a href="#home" class="text-gray-700 hover:text-blue-600 transition">Home</a>
                    <a href="#about" class="text-gray-700 hover:text-blue-600 transition">About</a>
                    <a href="#services" class="text-gray-700 hover:text-blue-600 transition">Services</a>
                    <a href="#contact" class="text-gray-700 hover:text-blue-600 transition">Contact</a>
                </div>
                <div class="md:hidden">
                    <button class="text-gray-700">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="pt-20 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div class="container mx-auto px-4">
            <div class="text-center max-w-4xl mx-auto">
                <h1 class="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
                    <span class="bg-gradient-to-r ${getBusinessTypeColors(businessType).gradient} bg-clip-text text-transparent">
                        Welcome to ${businessData.name}
                    </span>
                </h1>
                <p class="text-xl md:text-2xl text-gray-600 mb-8 animate-fade-in-up" style="animation-delay: 0.2s">
                    ${businessData.description || `Professional ${businessType} services in ${businessData.address}`}
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style="animation-delay: 0.4s">
                    <button class="brand-gradient text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                        Get Started Today
                    </button>
                    <button class="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-400 hover:bg-gray-50 transition-all">
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-20 bg-white">
        <div class="container mx-auto px-4">
            <div class="max-w-3xl mx-auto text-center mb-16">
                <h2 class="text-4xl font-bold mb-6 text-gray-800">
                    About ${businessData.name}
                </h2>
                <p class="text-lg text-gray-600 leading-relaxed">
                    We are a trusted ${businessType} business serving the ${businessData.address} community. 
                    With a ${businessData.rating}-star rating from ${businessData.reviews} satisfied customers, 
                    we pride ourselves on delivering exceptional service and outstanding results.
                </p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-8">
                <div class="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 animate-scale-in">
                    <div class="w-16 h-16 brand-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span class="text-white text-2xl font-bold">⭐</span>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">${businessData.rating}-Star Rated</h3>
                    <p class="text-gray-600">Trusted by ${businessData.reviews} happy customers</p>
                </div>
                
                <div class="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 animate-scale-in" style="animation-delay: 0.2s">
                    <div class="w-16 h-16 brand-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span class="text-white text-2xl font-bold">🏆</span>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Expert Service</h3>
                    <p class="text-gray-600">Professional ${businessType} expertise</p>
                </div>
                
                <div class="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 animate-scale-in" style="animation-delay: 0.4s">
                    <div class="w-16 h-16 brand-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span class="text-white text-2xl font-bold">📍</span>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Local Business</h3>
                    <p class="text-gray-600">Proudly serving ${businessData.address}</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="py-20 bg-gray-50">
        <div class="container mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold mb-6 text-gray-800">
                    Our Services
                </h2>
                <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                    Discover the comprehensive ${businessType} services we offer to meet all your needs.
                </p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-8">
                ${(businessData.services || getDefaultServices(businessType)).map((service, index) => `
                <div class="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105" style="animation-delay: ${index * 0.1}s">
                    <div class="w-12 h-12 brand-gradient rounded-xl flex items-center justify-center mb-6">
                        <span class="text-white text-xl font-bold">${index + 1}</span>
                    </div>
                    <h3 class="text-xl font-semibold mb-4 text-gray-800">${service}</h3>
                    <p class="text-gray-600 mb-6">
                        Professional ${service.toLowerCase()} services tailored to your specific needs and requirements.
                    </p>
                    <button class="text-blue-600 font-semibold hover:text-blue-700 transition">
                        Learn More →
                    </button>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20 bg-white">
        <div class="container mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold mb-6 text-gray-800">
                    Get In Touch
                </h2>
                <p class="text-lg text-gray-600">
                    Ready to experience our exceptional service? Contact us today!
                </p>
            </div>
            
            <div class="max-w-4xl mx-auto">
                <div class="grid md:grid-cols-2 gap-12">
                    <div>
                        <h3 class="text-2xl font-semibold mb-6">Contact Information</h3>
                        <div class="space-y-4">
                            <div class="flex items-center">
                                <div class="w-10 h-10 brand-gradient rounded-lg flex items-center justify-center mr-4">
                                    <span class="text-white">📍</span>
                                </div>
                                <div>
                                    <p class="font-medium">Address</p>
                                    <p class="text-gray-600">${businessData.address}</p>
                                </div>
                            </div>
                            ${businessData.phone ? `
                            <div class="flex items-center">
                                <div class="w-10 h-10 brand-gradient rounded-lg flex items-center justify-center mr-4">
                                    <span class="text-white">📞</span>
                                </div>
                                <div>
                                    <p class="font-medium">Phone</p>
                                    <p class="text-gray-600">${businessData.phone}</p>
                                </div>
                            </div>
                            ` : ''}
                            ${businessData.email ? `
                            <div class="flex items-center">
                                <div class="w-10 h-10 brand-gradient rounded-lg flex items-center justify-center mr-4">
                                    <span class="text-white">✉️</span>
                                </div>
                                <div>
                                    <p class="font-medium">Email</p>
                                    <p class="text-gray-600">${businessData.email}</p>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="bg-gray-50 p-8 rounded-2xl">
                        <h3 class="text-2xl font-semibold mb-6">Send us a Message</h3>
                        <form class="space-y-4">
                            <div class="grid md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Your Name" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <input type="email" placeholder="Your Email" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            </div>
                            <input type="text" placeholder="Subject" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <textarea placeholder="Your Message" rows="4" class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                            <button type="submit" class="w-full brand-gradient text-white py-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-12">
        <div class="container mx-auto px-4">
            <div class="text-center">
                <h3 class="text-2xl font-bold mb-2">${businessData.name}</h3>
                <p class="text-gray-400 mb-4">${businessType.charAt(0).toUpperCase() + businessType.slice(1)} • ${businessData.address}</p>
                <div class="flex justify-center space-x-4 mb-6">
                    ${businessData.socialMedia ? Object.entries(businessData.socialMedia).map(([platform, url]) => 
                        url ? `<a href="${url}" class="text-gray-400 hover:text-white transition">${platform}</a>` : ''
                    ).join('') : ''}
                </div>
                <div class="border-t border-gray-700 pt-6">
                    <p class="text-sm text-gray-500">
                        © ${new Date().getFullYear()} ${businessData.name}. Generated by FindWorkAI.
                    </p>
                </div>
            </div>
        </div>
    </footer>

    <script>
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Add intersection observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('section > div').forEach(section => {
            observer.observe(section);
        });
    </script>
</body>
</html>`
  }

  // Helper function to get business type specific colors
  const getBusinessTypeColors = (businessType: string) => {
    const colorSchemes = {
      restaurant: { 
        primary: '#dc2626', 
        secondary: '#f59e0b',
        gradient: 'from-red-600 to-orange-500'
      },
      medical: { 
        primary: '#059669', 
        secondary: '#06b6d4',
        gradient: 'from-emerald-600 to-cyan-500'
      },
      fitness: { 
        primary: '#16a34a', 
        secondary: '#84cc16',
        gradient: 'from-green-600 to-lime-500'
      },
      beauty: { 
        primary: '#c026d3', 
        secondary: '#ec4899',
        gradient: 'from-fuchsia-600 to-pink-500'
      },
      legal: { 
        primary: '#1d4ed8', 
        secondary: '#374151',
        gradient: 'from-blue-700 to-gray-700'
      },
      automotive: { 
        primary: '#ea580c', 
        secondary: '#1f2937',
        gradient: 'from-orange-600 to-gray-800'
      },
      tech: { 
        primary: '#4f46e5', 
        secondary: '#7c3aed',
        gradient: 'from-indigo-600 to-purple-600'
      },
      retail: { 
        primary: '#7c3aed', 
        secondary: '#8b5cf6',
        gradient: 'from-purple-700 to-purple-500'
      },
      real_estate: { 
        primary: '#0891b2', 
        secondary: '#10b981',
        gradient: 'from-cyan-600 to-emerald-600'
      },
      education: { 
        primary: '#0ea5e9', 
        secondary: '#3b82f6',
        gradient: 'from-sky-500 to-blue-500'
      },
      hospitality: { 
        primary: '#f59e0b', 
        secondary: '#eab308',
        gradient: 'from-amber-500 to-yellow-500'
      }
    }
    return colorSchemes[businessType] || colorSchemes.tech
  }

  // Helper function to get default services for business types
  const getDefaultServices = (businessType: string) => {
    const defaultServices = {
      restaurant: ['Fine Dining', 'Catering Services', 'Private Events'],
      medical: ['Consultations', 'Preventive Care', 'Specialized Treatment'],
      fitness: ['Personal Training', 'Group Classes', 'Nutrition Counseling'],
      beauty: ['Hair Styling', 'Skincare Treatments', 'Makeup Services'],
      legal: ['Legal Consultation', 'Document Review', 'Court Representation'],
      automotive: ['Vehicle Repair', 'Maintenance Services', 'Diagnostic Testing'],
      tech: ['Software Development', 'IT Consulting', 'Technical Support'],
      retail: ['Product Sales', 'Customer Service', 'Custom Orders'],
      real_estate: ['Property Sales', 'Rental Services', 'Property Management'],
      education: ['Tutoring', 'Test Preparation', 'Educational Consulting'],
      hospitality: ['Accommodation', 'Event Planning', 'Concierge Services']
    }
    return defaultServices[businessType] || ['Professional Service', 'Expert Consultation', 'Quality Solutions']
  }

  const generateContentHTML = (content: any): string => {
    const contentData = typeof content === 'object' ? content : { content: content }
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Content Package - ${artifact.name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <div class="container mx-auto px-4 py-8">
        <header class="mb-8">
            <h1 class="text-3xl font-bold mb-2">Content Package</h1>
            <p class="text-gray-600">AI-Generated Content for ${artifact.metadata?.businessName || 'Your Business'}</p>
        </header>
        
        ${contentData.businessDescription ? `
        <section class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 class="text-xl font-semibold mb-3">Business Description</h2>
            <p class="text-gray-700">${contentData.businessDescription}</p>
        </section>` : ''}
        
        ${contentData.aboutText ? `
        <section class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 class="text-xl font-semibold mb-3">About Us</h2>
            <p class="text-gray-700">${contentData.aboutText}</p>
        </section>` : ''}
        
        ${contentData.blogTopics ? `
        <section class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 class="text-xl font-semibold mb-3">Blog Topic Ideas</h2>
            <ul class="list-disc list-inside space-y-2">
                ${contentData.blogTopics.map((topic: string) => `<li class="text-gray-700">${topic}</li>`).join('')}
            </ul>
        </section>` : ''}
        
        ${contentData.socialMediaPosts ? `
        <section class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 class="text-xl font-semibold mb-3">Social Media Posts</h2>
            <div class="space-y-3">
                ${contentData.socialMediaPosts.map((post: string) => `
                <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p class="text-gray-700">${post}</p>
                </div>`).join('')}
            </div>
        </section>` : ''}
        
        ${contentData.faqSection ? `
        <section class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold mb-3">FAQ Section</h2>
            <div class="space-y-4">
                ${Object.entries(contentData.faqSection).map(([q, a]) => `
                <div>
                    <h3 class="font-medium text-gray-900 mb-1">Q: ${q}</h3>
                    <p class="text-gray-700 pl-4">A: ${a}</p>
                </div>`).join('')}
            </div>
        </section>` : ''}
    </div>
</body>
</html>`
  }

  const generateEmailHTML = (content: any): string => {
    const emailData = typeof content === 'string' ? { body: content } : content
    
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${emailData.subject || 'Professional Email Template'}</h1>
    </div>
    <div class="content">
        ${emailData.body || emailData.content || JSON.stringify(emailData, null, 2)}
        ${emailData.cta ? `<a href="#" class="button">${emailData.cta}</a>` : ''}
    </div>
    <div class="footer">
        <p>Powered by FindWorkAI</p>
    </div>
</body>
</html>`
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(isEditing ? editedCode : code)
      setIsCopied(true)
      toast.success('Copied to clipboard!')
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  const handleDownload = () => {
    const content = isEditing ? editedCode : code
    const blob = new Blob([content], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${artifact.name.replace(/\s+/g, '_')}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Downloaded successfully!')
  }

  const handleSave = () => {
    setCode(editedCode)
    setIsEditing(false)
    if (onSave) {
      onSave(editedCode)
    }
    toast.success('Changes saved!')
  }

  const handleDeploy = async () => {
    setIsDeploying(true)
    try {
      // Simulate deployment
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (onDeploy) {
        onDeploy({ ...artifact, content: isEditing ? editedCode : code })
      }
      
      toast.success('Deployed successfully! Your site is live.')
    } catch (error) {
      toast.error('Deployment failed')
    } finally {
      setIsDeploying(false)
    }
  }

  const renderPreview = () => {
    if (artifact.type === 'website' || artifact.type === 'landing-page' || artifact.type === 'email' || artifact.type === 'marketing' || artifact.type === 'content') {
      return (
        <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
          <div className="absolute top-0 left-0 right-0 bg-white border-b px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-1 bg-gray-100 rounded px-3 py-1 text-xs text-gray-600">
              {artifact.name}.html
            </div>
          </div>
          
          <div 
            className="pt-10 h-full flex items-center justify-center overflow-auto"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            <div 
              className="bg-white shadow-2xl transition-all duration-300"
              style={{
                width: deviceSizes[viewMode].width,
                height: viewMode === 'desktop' ? 'calc(100% - 2.5rem)' : deviceSizes[viewMode].height,
                maxWidth: '100%',
                minHeight: viewMode === 'desktop' ? '600px' : 'auto'
              }}
            >
              <iframe
                ref={iframeRef}
                className="w-full h-full border-0"
                title="Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        </div>
      )
    }

    // For non-HTML artifacts, show formatted content
    return (
      <ScrollArea className="h-full">
        <div className="p-6">
          <pre className="whitespace-pre-wrap text-sm">
            {typeof artifact.content === 'string' 
              ? artifact.content 
              : JSON.stringify(artifact.content, null, 2)}
          </pre>
        </div>
      </ScrollArea>
    )
  }

  const renderCodeEditor = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4" />
          <span className="font-medium">Code Editor</span>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        {isEditing ? (
          <Textarea
            value={editedCode}
            onChange={(e) => setEditedCode(e.target.value)}
            className="min-h-[600px] font-mono text-sm p-4 border-0 focus:ring-0"
            spellCheck={false}
          />
        ) : (
          <pre className="p-4 text-sm font-mono">
            <code>{code}</code>
          </pre>
        )}
      </ScrollArea>
    </div>
  )

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className={`${isFullscreen ? 'max-w-full h-screen m-0' : 'max-w-[90vw] w-[90vw] h-[85vh]'} p-0 overflow-hidden`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h3 className="text-lg font-semibold">{artifact.name}</h3>
              <p className="text-sm text-gray-500">
                {artifact.type.charAt(0).toUpperCase() + artifact.type.slice(1).replace('-', ' ')}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Device Preview Buttons */}
              {(artifact.type === 'website' || artifact.type === 'landing-page') && previewMode !== 'code' && (
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  {Object.entries(deviceSizes).map(([mode, config]) => {
                    const Icon = config.icon
                    return (
                      <Button
                        key={mode}
                        size="sm"
                        variant={viewMode === mode ? 'default' : 'ghost'}
                        onClick={() => setViewMode(mode as ViewMode)}
                        className="px-2"
                      >
                        <Icon className="w-4 h-4" />
                      </Button>
                    )
                  })}
                </div>
              )}

              {/* Zoom Control */}
              {previewMode === 'preview' && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Zoom:</span>
                  <Slider
                    value={[zoom]}
                    onValueChange={([value]) => setZoom(value)}
                    min={50}
                    max={150}
                    step={10}
                    className="w-24"
                  />
                  <span className="text-sm font-medium w-12">{zoom}%</span>
                </div>
              )}

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={previewMode === 'preview' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('preview')}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === 'code' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('code')}
                >
                  <Code className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant={previewMode === 'split' ? 'default' : 'ghost'}
                  onClick={() => setPreviewMode('split')}
                >
                  <Layout className="w-4 h-4" />
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 ml-2 pl-2 border-l">
                <Button size="sm" variant="outline" onClick={handleCopy}>
                  {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button size="sm" variant="outline" onClick={handleDownload}>
                  <Download className="w-4 h-4" />
                </Button>
                {(artifact.type === 'website' || artifact.type === 'landing-page') && (
                  <Button 
                    size="sm" 
                    onClick={handleDeploy}
                    disabled={isDeploying}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  >
                    {isDeploying ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                        Deploying...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-1" />
                        Deploy
                      </>
                    )}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
                <Button size="sm" variant="outline" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {previewMode === 'split' ? (
              <div className="grid grid-cols-2 h-full">
                <div className="border-r h-full overflow-hidden">
                  {renderPreview()}
                </div>
                <div className="h-full overflow-hidden">
                  {renderCodeEditor()}
                </div>
              </div>
            ) : previewMode === 'code' ? (
              renderCodeEditor()
            ) : (
              renderPreview()
            )}
          </div>

          {/* Footer Status Bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t bg-gray-50 text-sm">
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                {artifact.metadata?.framework || 'HTML/CSS'}
              </Badge>
              {artifact.metadata?.responsive && (
                <Badge variant="outline" className="text-green-600">
                  Responsive
                </Badge>
              )}
              {artifact.metadata?.seoOptimized && (
                <Badge variant="outline" className="text-blue-600">
                  SEO Optimized
                </Badge>
              )}
            </div>
            <div className="text-gray-500">
              Generated by AI Agent • {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
