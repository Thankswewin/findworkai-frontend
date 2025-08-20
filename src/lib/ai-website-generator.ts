// Advanced Multi-Model Website Generator
// Uses multiple AI models from OpenRouter for optimal results

import { generateWithOpenRouter } from './openrouter'
import { generateBusinessSpecificWebsite } from './business-templates'

// Model configurations with their strengths
const AI_MODELS = {
  // Primary models
  CLAUDE_OPUS: 'anthropic/claude-opus-4.1',      // Best for complex structure and logic
  CLAUDE_SONNET: 'anthropic/claude-sonnet-4',    // Great for modern code patterns
  GEMINI_PRO: 'google/gemini-2.5-pro',          // Excellent for creative design
  GEMINI_FLASH: 'google/gemini-2.5-flash',      // Fast iterations and refinements
  
  // Fallback models
  SONNET_3_5: 'anthropic/claude-3-5-sonnet',    // Fallback for code generation
  GEMINI_2_PRO: 'google/gemini-2.0-pro',        // Fallback for design
  GPT_4O: 'openai/gpt-4o',                      // Fallback for context understanding
}

export interface BusinessData {
  // Basic Information
  name: string
  category?: string
  type?: string  // Fallback for category
  location: string
  rating: number
  totalReviews: number
  phone?: string
  email?: string
  website?: string
  description?: string
  
  // Enhanced Context (when available)
  hours?: {
    monday?: string
    tuesday?: string
    wednesday?: string
    thursday?: string
    friday?: string
    saturday?: string
    sunday?: string
  }
  services?: string[]
  amenities?: string[]
  photos?: {
    url: string
    caption?: string
  }[]
  reviews?: {
    text: string
    rating: number
    author: string
  }[]
  priceLevel?: number
  targetAudience?: string[]
  competitors?: any[]
  socialMedia?: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
}

interface WebsiteSection {
  html: string
  css?: string
  js?: string
}

// Generate modern UI components inspired by shadcn/ui
export async function generateModernWebsite(
  business: BusinessData,
  apiKey: string
): Promise<string> {
  // First, try to use the backend API for business-specific generation
  try {
    const response = await fetch('/api/v1/ai-agent-v2/generate/website', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        business_name: business.name,
        business_type: business.category || business.type || 'Business',
        services: business.services || [],
        style: 'modern',
        color_scheme: null,
        sections: ['hero', 'services', 'about', 'testimonials', 'contact'],
        framework: 'nextjs'
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.code) {
        console.log('✨ Using AI-generated business-specific website')
        return result.code
      }
    }
  } catch (error) {
    console.log('Backend API not available, using local templates')
  }
  
  // Fallback to business-specific templates
  // This ensures each business type gets a unique, tailored design
  return generateEnhancedModernWebsite(business)
}

// Step 1: Generate intelligent website structure
async function generateWebsiteStructure(
  business: BusinessData,
  apiKey: string
): Promise<any> {
  const prompt = `
    As an expert web architect, create a modern website structure for:
    Business: ${business.name}
    Category: ${business.category}
    Location: ${business.location}
    
    Return a JSON structure with:
    - Hero section with compelling headline
    - Key features/services (3-4 items)
    - About section content
    - Call-to-action strategy
    - Navigation structure
    
    Focus on conversion optimization and user experience.
    Use modern web best practices.
  `
  
  try {
    const response = await generateWithOpenRouter(
      prompt,
      AI_MODELS.CLAUDE_OPUS,
      apiKey
    )
    return JSON.parse(response)
  } catch (error) {
    // Fallback to GPT-4o
    const response = await generateWithOpenRouter(
      prompt,
      AI_MODELS.GPT_4O,
      apiKey
    )
    return JSON.parse(response)
  }
}

// Step 2: Generate creative design system
async function generateDesignSystem(
  business: BusinessData,
  apiKey: string
): Promise<any> {
  const prompt = `
    Create a modern design system for:
    Business: ${business.name}
    Category: ${business.category}
    
    Generate:
    - Color palette (primary, secondary, accent colors in hex)
    - Typography choices (font families, sizes)
    - Spacing system
    - Border radius values
    - Shadow styles
    - Animation preferences
    
    Style should be modern, clean, inspired by shadcn/ui and Tailwind.
    Return as JSON.
  `
  
  try {
    const response = await generateWithOpenRouter(
      prompt,
      AI_MODELS.GEMINI_PRO,
      apiKey
    )
    return JSON.parse(response)
  } catch (error) {
    // Fallback to Gemini 2.0 Pro
    const response = await generateWithOpenRouter(
      prompt,
      AI_MODELS.GEMINI_2_PRO,
      apiKey
    )
    return JSON.parse(response)
  }
}

// Step 3: Generate modern components
async function generateComponents(
  business: BusinessData,
  structure: any,
  design: any,
  apiKey: string
): Promise<WebsiteSection[]> {
  const prompt = `
    Generate modern HTML components using:
    Structure: ${JSON.stringify(structure)}
    Design: ${JSON.stringify(design)}
    
    Create these sections:
    1. Hero with gradient background and CTA
    2. Features grid with icons
    3. About section with images
    4. Contact form with validation
    5. Footer with links
    
    Use:
    - Tailwind CSS classes
    - Modern animations
    - Responsive design
    - Accessibility best practices
    - Interactive JavaScript
    
    Style similar to shadcn/ui components.
  `
  
  try {
    const response = await generateWithOpenRouter(
      prompt,
      AI_MODELS.CLAUDE_SONNET,
      apiKey
    )
    return parseComponentResponse(response)
  } catch (error) {
    // Fallback to Sonnet 3.5
    const response = await generateWithOpenRouter(
      prompt,
      AI_MODELS.SONNET_3_5,
      apiKey
    )
    return parseComponentResponse(response)
  }
}

// Step 4: Optimize the website
async function optimizeWebsite(
  components: WebsiteSection[],
  apiKey: string
): Promise<WebsiteSection[]> {
  const prompt = `
    Optimize these website components for:
    - Performance (minimize CSS/JS)
    - SEO (meta tags, structured data)
    - Accessibility (ARIA labels, semantic HTML)
    - Mobile responsiveness
    
    Components: ${JSON.stringify(components)}
    
    Return optimized version.
  `
  
  try {
    const response = await generateWithOpenRouter(
      prompt,
      AI_MODELS.GEMINI_FLASH,
      apiKey
    )
    return parseComponentResponse(response)
  } catch (error) {
    // Return original if optimization fails
    return components
  }
}

// Parse component response from AI
function parseComponentResponse(response: string): WebsiteSection[] {
  try {
    return JSON.parse(response)
  } catch {
    // If not JSON, treat as HTML
    return [{ html: response }]
  }
}

// Assemble final website
function assembleWebsite(
  business: BusinessData,
  components: WebsiteSection[],
  design: any
): string {
  const primaryColor = design?.colors?.primary || '#3b82f6'
  const secondaryColor = design?.colors?.secondary || '#8b5cf6'
  const accentColor = design?.colors?.accent || '#10b981'
  
  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${business.name} - ${business.category}</title>
    <meta name="description" content="${business.description || `${business.name} - Professional ${business.category} services in ${business.location}`}">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Custom Configuration -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '${primaryColor}',
                        secondary: '${secondaryColor}',
                        accent: '${accentColor}',
                    },
                    animation: {
                        'fade-in': 'fadeIn 0.5s ease-in',
                        'slide-up': 'slideUp 0.3s ease-out',
                        'pulse-slow': 'pulse 3s infinite',
                    },
                    fontFamily: {
                        'sans': ['Inter', 'system-ui', 'sans-serif'],
                        'display': ['Cal Sans', 'Inter', 'sans-serif'],
                    }
                }
            }
        }
    </script>
    
    <!-- Modern Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Custom Styles -->
    <style>
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(20px);
            }
            to { 
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* Glassmorphism effect */
        .glass {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        /* Gradient text */
        .gradient-text {
            background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        /* Modern button */
        .btn-modern {
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        
        .btn-modern::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }
        
        .btn-modern:hover::before {
            width: 300px;
            height: 300px;
        }
        
        /* Smooth scroll behavior */
        html {
            scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 10px;
        }
        
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
            background: ${primaryColor};
            border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: ${secondaryColor};
        }
    </style>
</head>
<body class="font-sans text-gray-900 antialiased">
    <!-- Modern Navigation -->
    <nav class="fixed w-full top-0 z-50 glass">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center py-4">
                <div class="flex items-center space-x-2">
                    <div class="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                        <span class="text-white font-bold text-xl">${business.name.charAt(0)}</span>
                    </div>
                    <div>
                        <h1 class="font-bold text-xl">${business.name}</h1>
                        <p class="text-xs text-gray-600">${business.category}</p>
                    </div>
                </div>
                
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#home" class="text-gray-700 hover:text-primary transition-colors">Home</a>
                    <a href="#features" class="text-gray-700 hover:text-primary transition-colors">Services</a>
                    <a href="#about" class="text-gray-700 hover:text-primary transition-colors">About</a>
                    <a href="#contact" class="text-gray-700 hover:text-primary transition-colors">Contact</a>
                    <button class="btn-modern bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-shadow">
                        Get Started
                    </button>
                </div>
                
                <!-- Mobile menu button -->
                <button class="md:hidden p-2" onclick="toggleMobileMenu()">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
            </div>
        </div>
        
        <!-- Mobile menu -->
        <div id="mobileMenu" class="hidden md:hidden bg-white border-t">
            <div class="container mx-auto px-4 py-4 space-y-3">
                <a href="#home" class="block text-gray-700 hover:text-primary transition-colors">Home</a>
                <a href="#features" class="block text-gray-700 hover:text-primary transition-colors">Services</a>
                <a href="#about" class="block text-gray-700 hover:text-primary transition-colors">About</a>
                <a href="#contact" class="block text-gray-700 hover:text-primary transition-colors">Contact</a>
            </div>
        </div>
    </nav>
    
    <!-- Hero Section -->
    <section id="home" class="min-h-screen flex items-center relative overflow-hidden pt-20">
        <!-- Animated background -->
        <div class="absolute inset-0 bg-gradient-to-br from-primary/10 via-white to-secondary/10"></div>
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 2s;"></div>
        
        <div class="container mx-auto px-4 relative z-10">
            <div class="max-w-4xl mx-auto text-center">
                <div class="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                    <span class="relative flex h-2 w-2">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span class="text-sm font-medium">Trusted by ${business.totalReviews}+ customers</span>
                </div>
                
                <h1 class="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
                    Welcome to <span class="gradient-text">${business.name}</span>
                </h1>
                
                <p class="text-xl md:text-2xl text-gray-600 mb-8 animate-slide-up" style="animation-delay: 0.2s;">
                    Professional ${business.category} services in ${business.location}
                </p>
                
                <div class="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style="animation-delay: 0.4s;">
                    <button class="btn-modern bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                        Get Free Quote
                    </button>
                    <button class="glass border border-gray-200 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all">
                        Learn More
                    </button>
                </div>
                
                <!-- Trust indicators -->
                <div class="mt-12 flex flex-wrap justify-center gap-8 animate-fade-in" style="animation-delay: 0.6s;">
                    <div class="flex items-center space-x-2">
                        <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                        <span class="font-semibold">${business.rating}</span>
                        <span class="text-gray-600">Rating</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="font-semibold">Licensed</span>
                        <span class="text-gray-600">& Insured</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="font-semibold">24/7</span>
                        <span class="text-gray-600">Support</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Features Section -->
    <section id="features" class="py-20 bg-gray-50">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12">
                <h2 class="text-4xl font-bold mb-4">Why Choose ${business.name}?</h2>
                <p class="text-xl text-gray-600">Discover what makes us the preferred choice</p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-8">
                ${generateFeatureCards(business)}
            </div>
        </div>
    </section>
    
    <!-- About Section -->
    <section id="about" class="py-20 bg-white">
        <div class="container mx-auto px-4">
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 class="text-4xl font-bold mb-6">About ${business.name}</h2>
                    <p class="text-lg text-gray-600 mb-6">
                        With ${business.totalReviews}+ satisfied customers and a ${business.rating}-star rating, 
                        we've built our reputation on quality, reliability, and exceptional service.
                    </p>
                    <p class="text-lg text-gray-600 mb-6">
                        Located in the heart of ${business.location}, we're committed to serving our community 
                        with the highest standards of ${business.category.toLowerCase()} excellence.
                    </p>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="border-l-4 border-primary pl-4">
                            <div class="text-3xl font-bold text-primary">${business.totalReviews}+</div>
                            <div class="text-gray-600">Happy Customers</div>
                        </div>
                        <div class="border-l-4 border-secondary pl-4">
                            <div class="text-3xl font-bold text-secondary">${business.rating}★</div>
                            <div class="text-gray-600">Average Rating</div>
                        </div>
                    </div>
                </div>
                <div class="relative">
                    <div class="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl transform rotate-6"></div>
                    <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop" 
                         alt="${business.name} team" 
                         class="relative rounded-2xl shadow-xl w-full">
                </div>
            </div>
        </div>
    </section>
    
    <!-- Contact Section -->
    <section id="contact" class="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold mb-4">Get In Touch</h2>
                    <p class="text-xl text-gray-600">Ready to experience our exceptional service?</p>
                </div>
                
                <div class="bg-white rounded-2xl shadow-xl p-8">
                    <form class="space-y-6">
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                <input type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input type="email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input type="tel" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                            <textarea rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"></textarea>
                        </div>
                        
                        <button type="submit" class="w-full btn-modern bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all">
                            Send Message
                        </button>
                    </form>
                    
                    <div class="mt-8 pt-8 border-t border-gray-200">
                        <div class="grid md:grid-cols-3 gap-6 text-center">
                            <div>
                                <svg class="w-6 h-6 mx-auto mb-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                <p class="font-medium">${business.location}</p>
                            </div>
                            ${business.phone ? `
                            <div>
                                <svg class="w-6 h-6 mx-auto mb-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                                <p class="font-medium">${business.phone}</p>
                            </div>
                            ` : ''}
                            ${business.email ? `
                            <div>
                                <svg class="w-6 h-6 mx-auto mb-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                <p class="font-medium">${business.email}</p>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="container mx-auto px-4">
            <div class="text-center">
                <div class="flex items-center justify-center space-x-2 mb-4">
                    <div class="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                        <span class="text-white font-bold text-xl">${business.name.charAt(0)}</span>
                    </div>
                    <h3 class="text-2xl font-bold">${business.name}</h3>
                </div>
                <p class="text-gray-400 mb-4">${business.category} • ${business.location}</p>
                <p class="text-sm text-gray-500">© ${new Date().getFullYear()} ${business.name}. All rights reserved.</p>
                <p class="text-xs text-gray-600 mt-2">Powered by FindWorkAI</p>
            </div>
        </div>
    </footer>
    
    <!-- JavaScript -->
    <script>
        // Mobile menu toggle
        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            menu.classList.toggle('hidden');
        }
        
        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Close mobile menu if open
                    document.getElementById('mobileMenu').classList.add('hidden');
                }
            });
        });
        
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slide-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all feature cards
        document.querySelectorAll('.feature-card').forEach(card => {
            observer.observe(card);
        });
        
        // Form submission
        document.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
        });
    </script>
</body>
</html>`
}

// Generate feature cards based on business type
function generateFeatureCards(business: BusinessData): string {
  const features = [
    {
      icon: '⚡',
      title: 'Fast & Reliable',
      description: 'Quick response times and dependable service you can count on.'
    },
    {
      icon: '🏆',
      title: 'Top Rated',
      description: `${business.rating}-star rating from ${business.totalReviews}+ satisfied customers.`
    },
    {
      icon: '💎',
      title: 'Premium Quality',
      description: 'We use only the best materials and latest techniques.'
    },
    {
      icon: '🛡️',
      title: 'Fully Licensed',
      description: 'Licensed, bonded, and insured for your peace of mind.'
    },
    {
      icon: '💰',
      title: 'Fair Pricing',
      description: 'Transparent, competitive pricing with no hidden fees.'
    },
    {
      icon: '🤝',
      title: 'Satisfaction Guaranteed',
      description: 'We stand behind our work with a 100% satisfaction guarantee.'
    }
  ]
  
  return features.slice(0, 3).map((feature, index) => `
    <div class="feature-card bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all transform hover:-translate-y-1 opacity-0" style="animation-delay: ${index * 0.1}s;">
        <div class="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mb-4">
            <span class="text-3xl">${feature.icon}</span>
        </div>
        <h3 class="text-xl font-semibold mb-3">${feature.title}</h3>
        <p class="text-gray-600">${feature.description}</p>
    </div>
  `).join('')
}

// Fallback website generation (simpler version)
function generateFallbackWebsite(business: BusinessData): string {
  return assembleWebsite(
    business,
    [],
    {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#10b981'
      }
    }
  )
}

// Enhanced modern website with all premium features
function generateEnhancedModernWebsite(business: BusinessData): string {
  // Use business-specific templates for unique designs
  return generateBusinessSpecificWebsite(business)
}

// Get business-specific colors
function getBusinessColors(category: string): { primary: string, secondary: string, accent: string } {
  const colorSchemes: Record<string, { primary: string, secondary: string, accent: string }> = {
    'restaurant': { primary: '#dc2626', secondary: '#f59e0b', accent: '#16a34a' },
    'healthcare': { primary: '#059669', secondary: '#06b6d4', accent: '#3b82f6' },
    'law': { primary: '#1d4ed8', secondary: '#4f46e5', accent: '#6366f1' },
    'auto': { primary: '#ea580c', secondary: '#dc2626', accent: '#1f2937' },
    'beauty': { primary: '#c026d3', secondary: '#ec4899', accent: '#f472b6' },
    'fitness': { primary: '#16a34a', secondary: '#84cc16', accent: '#22c55e' },
    'retail': { primary: '#7c3aed', secondary: '#8b5cf6', accent: '#a78bfa' },
    'real estate': { primary: '#0891b2', secondary: '#10b981', accent: '#14b8a6' },
    'technology': { primary: '#3b82f6', secondary: '#8b5cf6', accent: '#10b981' },
    'education': { primary: '#0891b2', secondary: '#3b82f6', accent: '#6366f1' },
    'finance': { primary: '#16a34a', secondary: '#059669', accent: '#10b981' },
    'consulting': { primary: '#4f46e5', secondary: '#6366f1', accent: '#7c3aed' }
  }
  
  return colorSchemes[category.toLowerCase()] || {
    primary: '#3b82f6',
    secondary: '#8b5cf6', 
    accent: '#10b981'
  }
}

export { generateModernWebsite as default }
