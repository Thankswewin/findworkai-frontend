// Enhanced AI Website Generator with Premium UI System
// Integrates modern components, animations, and AI-driven customization

import { generateEnhancedComponent, advancedComponents } from './advanced-component-generator'
import { getDesignTokens, generateCSSVariables, premiumDesignTokens } from './premium-ui-system'

interface BusinessData {
  name: string
  type: string
  description?: string
  phone?: string
  email?: string
  address?: string
  website?: string
  rating?: number
  reviews?: number
  services?: string[]
  features?: string[]
  hours?: {
    [key: string]: string
  }
  images?: string[]
  socialMedia?: {
    [platform: string]: string
  }
  primaryColor?: string
  industry?: string
}

interface WebsiteConfig {
  businessData: BusinessData
  style?: 'minimal' | 'modern' | 'premium' | 'elegant'
  includeAnimations?: boolean
  sections?: string[]
  customBranding?: {
    colors?: string[]
    fonts?: string[]
    logo?: string
  }
}

// Enhanced business type mapping with more granular categories
const enhancedBusinessTypes = {
  restaurant: ['restaurant', 'cafe', 'bistro', 'diner', 'bakery', 'food truck', 'catering'],
  medical: ['medical', 'healthcare', 'dental', 'clinic', 'hospital', 'therapy', 'wellness'],
  fitness: ['fitness', 'gym', 'yoga', 'pilates', 'personal training', 'crossfit', 'martial arts'],
  beauty: ['beauty', 'salon', 'spa', 'barbershop', 'nail salon', 'aesthetics', 'cosmetics'],
  legal: ['legal', 'law firm', 'attorney', 'lawyer', 'paralegal', 'notary', 'court'],
  automotive: ['automotive', 'car repair', 'auto shop', 'dealership', 'mechanic', 'towing'],
  tech: ['tech', 'software', 'it services', 'consulting', 'development', 'startup', 'saas'],
  retail: ['retail', 'store', 'boutique', 'shop', 'e-commerce', 'fashion', 'jewelry'],
  real_estate: ['real estate', 'realtor', 'property', 'mortgage', 'investment', 'development'],
  education: ['education', 'school', 'university', 'tutoring', 'training', 'online courses'],
  finance: ['finance', 'accounting', 'insurance', 'banking', 'investment', 'financial planning'],
  hospitality: ['hotel', 'resort', 'bed and breakfast', 'vacation rental', 'travel', 'tourism']
}

// AI-powered business analysis for better categorization
function analyzeBusinessType(businessData: BusinessData): string {
  const { type, description, services } = businessData
  const searchText = `${type} ${description} ${services?.join(' ')}`.toLowerCase()
  
  // Find the most relevant category
  for (const [category, keywords] of Object.entries(enhancedBusinessTypes)) {
    if (keywords.some(keyword => searchText.includes(keyword.toLowerCase()))) {
      return category
    }
  }
  
  // Fallback to original type or 'generic'
  return type.toLowerCase() in premiumDesignTokens ? type.toLowerCase() : 'restaurant'
}

// Advanced website structure generator
export async function generateEnhancedWebsite(config: WebsiteConfig): Promise<string> {
  const { businessData, style = 'modern', includeAnimations = true, sections = ['hero', 'about', 'services', 'contact'] } = config
  
  // Analyze and categorize business
  const businessType = analyzeBusinessType(businessData)
  const designTokens = getDesignTokens(businessType)
  
  // Generate CSS variables
  const cssVariables = generateCSSVariables(designTokens)
  
  // Generate components
  const components = await Promise.all(
    sections.map(async (section) => ({
      section,
      component: await generateEnhancedComponent({
        section: section as any,
        businessType,
        data: businessData,
        style,
        animation: includeAnimations
      })
    }))
  )
  
  // Generate the complete website
  const website = generateCompleteWebsite({
    businessData,
    businessType,
    components,
    cssVariables,
    designTokens,
    includeAnimations
  })
  
  return website
}

interface WebsiteGenerationConfig {
  businessData: BusinessData
  businessType: string
  components: { section: string; component: string }[]
  cssVariables: string
  designTokens: any
  includeAnimations: boolean
}

function generateCompleteWebsite(config: WebsiteGenerationConfig): string {
  const { businessData, businessType, components, cssVariables, includeAnimations } = config
  
  const animationImports = includeAnimations ? `
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'` : ''
  
  return `
<!DOCTYPE html>
<html lang="en" className="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${businessData.name} - ${getBusinessTagline(businessType)}</title>
  <meta name="description" content="${businessData.description || generateMetaDescription(businessData, businessType)}">
  <meta name="keywords" content="${generateKeywords(businessData, businessType)}">
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${businessData.website || 'https://example.com'}">
  <meta property="og:title" content="${businessData.name}">
  <meta property="og:description" content="${businessData.description || generateMetaDescription(businessData, businessType)}">
  <meta property="og:image" content="${businessData.images?.[0] || '/api/placeholder/1200/630'}">
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="${businessData.website || 'https://example.com'}">
  <meta property="twitter:title" content="${businessData.name}">
  <meta property="twitter:description" content="${businessData.description || generateMetaDescription(businessData, businessType)}">
  <meta property="twitter:image" content="${businessData.images?.[0] || '/api/placeholder/1200/630'}">
  
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  
  <!-- Fonts -->
  ${generateFontLinks(businessType)}
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Custom Styles -->
  <style>
    ${cssVariables}
    
    /* Custom Tailwind Configuration */
    @import 'tailwindcss/base';
    @import 'tailwindcss/components';
    @import 'tailwindcss/utilities';
    
    /* Smooth animations */
    * {
      transition-property: all;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 300ms;
    }
    
    /* Custom gradients for ${businessType} */
    .gradient-primary {
      background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700));
    }
    
    .gradient-hero {
      background: linear-gradient(135deg, ${getHeroGradient(businessType)});
    }
    
    /* Premium shadows */
    .shadow-premium {
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05);
    }
    
    /* Modern glass effect */
    .glass-effect {
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.18);
    }
    
    /* Hover effects */
    .hover-lift {
      transition: all 0.3s ease;
    }
    
    .hover-lift:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }
    
    /* Text animations */
    .text-shimmer {
      background: linear-gradient(
        110deg,
        #000 45%,
        #fff 55%,
        #000 65%
      );
      background-size: 200% 100%;
      animation: shimmer 2s ease-in-out infinite;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  </style>
  
  <!-- React and Components -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  ${includeAnimations ? '<script src="https://unpkg.com/framer-motion@10/dist/framer-motion.js"></script>' : ''}
  
  <!-- Analytics -->
  ${generateAnalytics(businessData)}
</head>

<body className="bg-white text-gray-900 font-body overflow-x-hidden">
  <!-- Loading Screen -->
  <div id="loading-screen" class="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br ${getLoadingGradient(businessType)}">
    <div class="text-center">
      <div class="w-16 h-16 mx-auto mb-4 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      <h1 class="text-2xl font-bold text-white">${businessData.name}</h1>
      <p class="text-white/80">Loading your experience...</p>
    </div>
  </div>
  
  <!-- Navigation -->
  ${generateNavigation(businessData, businessType)}
  
  <!-- Main Content -->
  <main className="relative">
    ${components.map(({ component }) => component).join('\n\n')}
  </main>
  
  <!-- Footer -->
  ${generateFooter(businessData, businessType)}
  
  <!-- Scroll to Top Button -->
  <button 
    id="scroll-to-top" 
    class="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 opacity-0 pointer-events-none z-40"
    onclick="window.scrollTo({ top: 0, behavior: 'smooth' })"
  >
    <svg class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
    </svg>
  </button>
  
  <!-- Scripts -->
  <script>
    // Remove loading screen
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.getElementById('loading-screen').style.opacity = '0';
        setTimeout(() => {
          document.getElementById('loading-screen').style.display = 'none';
        }, 500);
      }, 1000);
    });
    
    // Scroll to top button
    window.addEventListener('scroll', () => {
      const scrollBtn = document.getElementById('scroll-to-top');
      if (window.scrollY > 300) {
        scrollBtn.classList.remove('opacity-0', 'pointer-events-none');
        scrollBtn.classList.add('opacity-100');
      } else {
        scrollBtn.classList.add('opacity-0', 'pointer-events-none');
        scrollBtn.classList.remove('opacity-100');
      }
    });
    
    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
    
    // Performance optimization
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
    
    // Analytics tracking
    ${generateAnalyticsScript(businessData)}
  </script>
  
  <!-- Schema.org Structured Data -->
  <script type="application/ld+json">
    ${JSON.stringify(generateStructuredData(businessData, businessType), null, 2)}
  </script>
</body>
</html>
  `.trim()
}

// Helper functions
function getBusinessTagline(businessType: string): string {
  const taglines = {
    restaurant: 'Exceptional Dining Experience',
    medical: 'Your Health, Our Priority',
    fitness: 'Transform Your Body & Mind',
    beauty: 'Enhance Your Natural Beauty',
    legal: 'Protecting Your Rights',
    automotive: 'Expert Auto Services',
    tech: 'Innovation & Technology Solutions',
    retail: 'Quality Products & Service',
    real_estate: 'Your Dream Property Awaits',
    education: 'Empowering Through Education',
    finance: 'Securing Your Financial Future',
    hospitality: 'Unforgettable Experiences'
  }
  
  return taglines[businessType] || 'Professional Services'
}

function generateMetaDescription(businessData: BusinessData, businessType: string): string {
  const baseDescriptions = {
    restaurant: `Experience exceptional dining at ${businessData.name}. Fresh ingredients, expert chefs, and unforgettable flavors await you.`,
    medical: `Comprehensive healthcare services at ${businessData.name}. Compassionate care from certified medical professionals you can trust.`,
    fitness: `Transform your fitness journey at ${businessData.name}. Expert training, modern equipment, and personalized programs.`,
    beauty: `Enhance your natural beauty at ${businessData.name}. Professional treatments and premium products for your wellness.`
  }
  
  return baseDescriptions[businessType] || `Professional ${businessType} services at ${businessData.name}. Quality, expertise, and customer satisfaction guaranteed.`
}

function generateKeywords(businessData: BusinessData, businessType: string): string {
  const baseKeywords = {
    restaurant: ['restaurant', 'dining', 'food', 'cuisine', 'chef', 'menu', 'reservations'],
    medical: ['healthcare', 'medical', 'doctor', 'clinic', 'treatment', 'health', 'wellness'],
    fitness: ['fitness', 'gym', 'training', 'workout', 'exercise', 'health', 'personal trainer'],
    beauty: ['beauty', 'salon', 'spa', 'skincare', 'treatments', 'wellness', 'aesthetics']
  }
  
  const keywords = baseKeywords[businessType] || [businessType, 'professional', 'services']
  return [...keywords, businessData.name.toLowerCase().split(' ')].flat().join(', ')
}

function generateFontLinks(businessType: string): string {
  const fontMaps = {
    restaurant: '@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600;700&display=swap");',
    medical: '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap");',
    beauty: '@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Inter:wght@300;400;500;600&display=swap");',
    fitness: '@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;900&family=Inter:wght@300;400;500;600&display=swap");'
  }
  
  return `<style>${fontMaps[businessType] || fontMaps.medical}</style>`
}

function getHeroGradient(businessType: string): string {
  const gradients = {
    restaurant: '#FFF7ED, #FFEDD5, #FED7AA',
    medical: '#EFF6FF, #DBEAFE, #BFDBFE',
    fitness: '#FFEDD5, #FED7AA, #FDBA74',
    beauty: '#FCE7F3, #FBCFE8, #F9A8D4'
  }
  
  return gradients[businessType] || gradients.medical
}

function getLoadingGradient(businessType: string): string {
  const gradients = {
    restaurant: 'from-orange-500 to-red-600',
    medical: 'from-blue-500 to-cyan-600',
    fitness: 'from-red-500 to-orange-600',
    beauty: 'from-pink-500 to-purple-600'
  }
  
  return gradients[businessType] || 'from-blue-500 to-purple-600'
}

function generateNavigation(businessData: BusinessData, businessType: string): string {
  return `
    <nav class="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <div class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ${businessData.name}
            </div>
          </div>
          
          <div class="hidden md:flex items-center space-x-8">
            <a href="#home" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
            <a href="#about" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">About</a>
            <a href="#services" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">Services</a>
            <a href="#contact" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</a>
            <button class="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              ${getNavCTA(businessType)}
            </button>
          </div>
          
          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button class="text-gray-700 hover:text-blue-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  `
}

function generateFooter(businessData: BusinessData, businessType: string): string {
  return `
    <footer class="bg-gray-900 text-white py-16">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-4 gap-8">
          <div class="md:col-span-2">
            <div class="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ${businessData.name}
            </div>
            <p class="text-gray-400 mb-6 max-w-md leading-relaxed">
              ${businessData.description || generateMetaDescription(businessData, businessType)}
            </p>
            <div class="flex space-x-4">
              ${generateSocialLinks(businessData)}
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-bold mb-4">Contact</h3>
            <div class="space-y-2 text-gray-400">
              ${businessData.phone ? `<p>${businessData.phone}</p>` : ''}
              ${businessData.email ? `<p>${businessData.email}</p>` : ''}
              ${businessData.address ? `<p>${businessData.address}</p>` : ''}
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-bold mb-4">Quick Links</h3>
            <div class="space-y-2 text-gray-400">
              <a href="#home" class="block hover:text-white transition-colors">Home</a>
              <a href="#about" class="block hover:text-white transition-colors">About</a>
              <a href="#services" class="block hover:text-white transition-colors">Services</a>
              <a href="#contact" class="block hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
        
        <div class="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
          <p>&copy; ${new Date().getFullYear()} ${businessData.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `
}

function getNavCTA(businessType: string): string {
  const ctas = {
    restaurant: 'Reserve Now',
    medical: 'Book Appointment',
    fitness: 'Start Today',
    beauty: 'Book Service'
  }
  
  return ctas[businessType] || 'Get Started'
}

function generateSocialLinks(businessData: BusinessData): string {
  if (!businessData.socialMedia) return ''
  
  return Object.entries(businessData.socialMedia).map(([platform, url]) => `
    <a href="${url}" class="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300" target="_blank" rel="noopener noreferrer">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        ${getSocialIcon(platform)}
      </svg>
    </a>
  `).join('')
}

function getSocialIcon(platform: string): string {
  const icons = {
    facebook: '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>',
    twitter: '<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>',
    instagram: '<path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-2.508 0-4.541-2.033-4.541-4.54s2.033-4.541 4.541-4.541c2.508 0 4.54 2.034 4.54 4.541s-2.032 4.54-4.54 4.54zm7.081 0c-2.508 0-4.541-2.033-4.541-4.54s2.033-4.541 4.541-4.541 4.54 2.034 4.54 4.541-2.032 4.54-4.54 4.54z"/>'
  }
  
  return icons[platform] || icons.facebook
}

function generateAnalytics(businessData: BusinessData): string {
  return `
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'GA_MEASUREMENT_ID');
    </script>
  `
}

function generateAnalyticsScript(businessData: BusinessData): string {
  return `
    // Business performance tracking
    function trackInteraction(action, category) {
      if (typeof gtag !== 'undefined') {
        gtag('event', action, {
          event_category: category,
          event_label: '${businessData.name}'
        });
      }
    }
    
    // Track key interactions
    document.querySelectorAll('button, a[href^="tel:"], a[href^="mailto:"]').forEach(el => {
      el.addEventListener('click', () => {
        trackInteraction('click', el.tagName.toLowerCase());
      });
    });
  `
}

function generateStructuredData(businessData: BusinessData, businessType: string) {
  return {
    "@context": "https://schema.org",
    "@type": getSchemaType(businessType),
    "name": businessData.name,
    "description": businessData.description || generateMetaDescription(businessData, businessType),
    "url": businessData.website,
    "telephone": businessData.phone,
    "email": businessData.email,
    "address": businessData.address ? {
      "@type": "PostalAddress",
      "streetAddress": businessData.address
    } : undefined,
    "aggregateRating": businessData.rating ? {
      "@type": "AggregateRating",
      "ratingValue": businessData.rating,
      "reviewCount": businessData.reviews || 100
    } : undefined,
    "sameAs": businessData.socialMedia ? Object.values(businessData.socialMedia) : undefined
  }
}

function getSchemaType(businessType: string): string {
  const schemaTypes = {
    restaurant: 'Restaurant',
    medical: 'MedicalBusiness',
    fitness: 'SportsActivityLocation',
    beauty: 'BeautySalon',
    legal: 'LegalService',
    automotive: 'AutoRepair',
    retail: 'Store',
    real_estate: 'RealEstateAgent'
  }
  
  return schemaTypes[businessType] || 'LocalBusiness'
}

export default {
  generateEnhancedWebsite,
  enhancedBusinessTypes,
  analyzeBusinessType
}
