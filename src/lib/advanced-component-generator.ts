// Advanced Component Generator for Modern Business Websites
// Integrates with premium UI system and Framer Motion animations

import { getDesignTokens, premiumComponents, premiumAnimations } from './premium-ui-system'

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
}

interface ComponentConfig {
  section: 'hero' | 'about' | 'services' | 'features' | 'testimonials' | 'contact' | 'footer'
  businessType: string
  data: BusinessData
  style?: 'minimal' | 'modern' | 'premium' | 'elegant'
  animation?: boolean
  customColors?: string[]
}

// Advanced component templates with modern UI patterns
export const advancedComponents = {
  hero: {
    restaurant: (config: ComponentConfig) => {
      const tokens = getDesignTokens(config.businessType)
      return `
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, ChevronDown, Star, MapPin, Clock } from 'lucide-react'

export default function RestaurantHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-orange-900/5 to-amber-900/10"></div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-orange-200/30 to-yellow-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [20, -20, 20],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-20 right-1/4 w-48 h-48 bg-gradient-to-br from-red-200/30 to-orange-200/30 rounded-full blur-3xl"
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center px-6 py-3 rounded-full bg-white/90 backdrop-blur-md shadow-xl border border-orange-100/50 mb-8"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-gray-800">Open Now</span>
              <div className="w-px h-4 bg-gray-300 mx-2"></div>
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600">Fresh Daily</span>
            </div>
          </motion.div>
          
          {/* Main Heading with Gradient Text */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-7xl md:text-9xl font-black mb-6 leading-none"
          >
            <span className="bg-gradient-to-br from-gray-900 via-orange-800 to-amber-700 bg-clip-text text-transparent">
              ${config.data.name}
            </span>
          </motion.h1>
          
          {/* Animated Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <p className="text-3xl md:text-4xl font-light text-gray-600 mb-2">
              Where Every Meal Becomes
            </p>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"
            >
              A Memory
            </motion.span>
          </motion.div>
          
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-8 max-w-md mx-auto mb-12"
          >
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Star className="w-8 h-8 text-orange-600 fill-current" />
              </div>
              <div className="text-2xl font-bold text-gray-900">${config.data.rating || '4.9'}</div>
              <div className="text-sm text-gray-600">Rating</div>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">${config.data.reviews || '2,500'}+</div>
              <div className="text-sm text-gray-600">Happy Guests</div>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">15+</div>
              <div className="text-sm text-gray-600">Years</div>
            </div>
          </motion.div>
          
          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="group bg-gradient-to-r from-orange-500 via-red-500 to-rose-500 hover:from-orange-600 hover:via-red-600 hover:to-rose-600 text-white px-10 py-6 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-orange-500/25 transform hover:-translate-y-2 transition-all duration-500 border-0"
              >
                <span className="mr-3">Reserve Your Table</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white/30 hover:border-orange-400 text-gray-700 hover:text-orange-600 px-10 py-6 rounded-2xl text-xl font-bold bg-white/60 backdrop-blur-sm hover:bg-white/90 transition-all duration-500 shadow-xl"
              >
                <Play className="w-6 h-6 mr-3" />
                View Menu
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Online Ordering</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Free Wi-Fi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Live Music</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-2"
        >
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </motion.div>
      </motion.div>
    </section>
  )
}
      `
    },
    
    medical: (config: ComponentConfig) => {
      const tokens = getDesignTokens(config.businessType)
      return `
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Phone, Shield, Clock, Heart, CheckCircle, Award, Users } from 'lucide-react'

export default function MedicalHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 overflow-hidden">
      {/* Professional Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: \`url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 25a25 25 0 0 1 0 50 25 25 0 0 1 0-50' fill='none' stroke='%23000' stroke-width='0.5'/%3E%3C/svg%3E")\`
          }}
        />
      </div>
      
      {/* Floating Medical Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            y: [-30, 30, -30],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/6 w-4 h-4 text-blue-300 opacity-20"
        >
          <Heart className="w-full h-full" />
        </motion.div>
        <motion.div
          animate={{
            y: [30, -30, 30],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-1/3 right-1/6 w-6 h-6 text-green-300 opacity-20"
        >
          <Shield className="w-full h-full" />
        </motion.div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center mb-8"
            >
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2 rounded-full border-0 text-base font-semibold">
                <Shield className="w-5 h-5 mr-2" />
                Certified Healthcare Excellence
              </Badge>
            </motion.div>
            
            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-6xl md:text-8xl font-black leading-none mb-4">
                <span className="block text-gray-900">Your Health,</span>
                <span className="block bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Our Priority
                </span>
              </h1>
            </motion.div>
            
            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg"
            >
              Comprehensive healthcare services with compassionate care. Trust our{' '}
              <span className="font-bold text-blue-600">${config.data.rating || '4.9'}-star rated</span>{' '}
              medical team for your family's wellbeing.
            </motion.p>
            
            {/* Key Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10"
            >
              <div className="group flex items-center space-x-4 p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">24/7 Emergency</div>
                  <div className="text-gray-600">Always Available</div>
                </div>
              </div>
              
              <div className="group flex items-center space-x-4 p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">${config.data.reviews || '10,000'}+ Patients</div>
                  <div className="text-gray-600">Trusted Care</div>
                </div>
              </div>
              
              <div className="group flex items-center space-x-4 p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">Top Rated</div>
                  <div className="text-gray-600">Excellence Awards</div>
                </div>
              </div>
              
              <div className="group flex items-center space-x-4 p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-7 h-7 text-red-500" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">Compassionate</div>
                  <div className="text-gray-600">Personal Care</div>
                </div>
              </div>
            </motion.div>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-10 py-6 rounded-xl text-lg font-bold shadow-xl hover:shadow-blue-500/25 transform hover:-translate-y-1 transition-all duration-300"
              >
                <Calendar className="w-5 h-5 mr-3" />
                Book Appointment
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-blue-200 hover:border-blue-400 text-blue-700 hover:text-blue-800 px-10 py-6 rounded-xl text-lg font-bold bg-white/70 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-lg"
              >
                <Phone className="w-5 h-5 mr-3" />
                Emergency: ${config.data.phone || '(555) 123-4567'}
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Visual Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Image Container */}
              <div className="relative w-full h-[500px] bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="/api/placeholder/600/500" 
                  alt="Modern Medical Facility"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 via-transparent to-transparent"></div>
              </div>
              
              {/* Floating Statistics Cards */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -right-6 top-12 bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 min-w-[200px]"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-gray-900">Same Day</div>
                    <div className="text-gray-600">Lab Results</div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="absolute -left-6 bottom-12 bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 text-center min-w-[180px]"
              >
                <div className="text-4xl font-black text-blue-600 mb-2">${config.data.rating || '4.9'}★</div>
                <div className="text-gray-600 font-semibold">Patient Rating</div>
                <div className="text-sm text-gray-500 mt-1">Based on ${config.data.reviews || '1,200'}+ reviews</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
      `
    }
  },
  
  features: {
    modern: (config: ComponentConfig) => `
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, Shield, Clock, Award, Users, Star } from 'lucide-react'

export default function ModernFeatures() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Quick service and rapid results for all your needs',
      gradient: 'from-yellow-400 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50'
    },
    {
      icon: Shield,
      title: 'Secure & Trusted',
      description: 'Your privacy and security are our top priorities',
      gradient: 'from-blue-400 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      icon: Clock,
      title: '24/7 Available',
      description: 'Round-the-clock service whenever you need us',
      gradient: 'from-green-400 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      icon: Award,
      title: 'Award Winning',
      description: 'Recognized excellence in service and quality',
      gradient: 'from-purple-400 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Highly skilled professionals at your service',
      gradient: 'from-indigo-400 to-blue-500',
      bgGradient: 'from-indigo-50 to-blue-50'
    },
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Exceptional standards in everything we deliver',
      gradient: 'from-rose-400 to-red-500',
      bgGradient: 'from-rose-50 to-red-50'
    }
  ]
  
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0">
            Why Choose ${config.data.name}
          </Badge>
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Premium Features
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the difference with our comprehensive suite of features designed 
            to exceed your expectations and deliver exceptional results.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className={\`absolute inset-0 bg-gradient-to-br \${feature.bgGradient} opacity-50\`} />
                <CardContent className="relative p-8 h-full">
                  <div className="flex flex-col h-full">
                    <div className={\`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br \${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg\`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed flex-grow">
                      {feature.description}
                    </p>
                    
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <div className={\`w-2 h-2 rounded-full bg-gradient-to-r \${feature.gradient} mr-2\`} />
                        <span>Premium Feature</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 mb-6">
            Ready to experience these features yourself?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
              Get Started Today
            </button>
            <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
              Learn More
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
    `
  }
}

// AI-powered component enhancement
export async function generateEnhancedComponent(config: ComponentConfig): Promise<string> {
  const { section, businessType, data, style = 'modern', animation = true } = config
  
  // Get base component
  let baseComponent = ''
  
  if (advancedComponents[section] && advancedComponents[section][businessType]) {
    baseComponent = advancedComponents[section][businessType](config)
  } else if (advancedComponents[section] && advancedComponents[section].modern) {
    baseComponent = advancedComponents[section].modern(config)
  } else {
    // Fallback to basic component generation
    baseComponent = generateBasicComponent(config)
  }
  
  return baseComponent
}

function generateBasicComponent(config: ComponentConfig): string {
  const { section, data } = config
  
  return `
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function ${section.charAt(0).toUpperCase() + section.slice(1)}Section() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            ${data.name}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            ${data.description || 'Professional service tailored to your needs.'}
          </p>
          
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold">
            Learn More
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
  `
}

// Animation configurations
export const animationPresets = {
  fadeInUp: {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.8 },
    viewport: { once: true }
  },
  
  slideInLeft: {
    initial: { opacity: 0, x: -50 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.8 },
    viewport: { once: true }
  },
  
  staggerChildren: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: {
      duration: 0.8,
      staggerChildren: 0.1
    },
    viewport: { once: true }
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, ease: "easeOut" },
    viewport: { once: true }
  }
}

// Utility to inject animations into components
export function addAnimations(component: string, preset: keyof typeof animationPresets): string {
  const animation = animationPresets[preset]
  // This would need more sophisticated parsing to inject animations properly
  return component.replace(
    /<motion\.div>/g,
    `<motion.div ${Object.entries(animation).map(([key, value]) => 
      `${key}={${JSON.stringify(value)}}`
    ).join(' ')}>`
  )
}

export default {
  generateEnhancedComponent,
  advancedComponents,
  animationPresets,
  addAnimations
}
