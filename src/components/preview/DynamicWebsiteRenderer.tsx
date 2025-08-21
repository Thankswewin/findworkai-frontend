'use client'

import React, { useMemo, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getDesignTokens, generateCSSVariables } from '@/lib/premium-ui-system'
import { 
  ArrowRight, 
  Play, 
  ChevronDown, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin,
  Star,
  Clock,
  Heart,
  Shield,
  CheckCircle
} from 'lucide-react'

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
  hours?: { [key: string]: string }
  images?: string[]
  socialMedia?: { [platform: string]: string }
  primaryColor?: string
  industry?: string
}

interface DynamicWebsiteRendererProps {
  businessData: BusinessData
  businessType: string
  includeAnimations?: boolean
}

export function DynamicWebsiteRenderer({ 
  businessData, 
  businessType, 
  includeAnimations = true 
}: DynamicWebsiteRendererProps) {
  const designTokens = getDesignTokens(businessType)
  
  // Generate CSS variables as inline styles
  const cssVariables = useMemo(() => {
    const tokens = generateCSSVariables(designTokens)
    const variables: Record<string, string> = {}
    
    // Parse CSS variables from the generated string
    const matches = tokens.match(/--[\w-]+:\s*[^;]+/g)
    if (matches) {
      matches.forEach(match => {
        const [prop, value] = match.split(':')
        variables[prop.trim()] = value.trim()
      })
    }
    
    return variables
  }, [designTokens])

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  // Hero component based on business type
  const renderHero = () => {
    const HeroContent = () => (
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ 
          background: businessType === 'restaurant' 
            ? 'linear-gradient(to bottom right, #FFF7ED, #FFFFFF, #FEF3C7)' 
            : businessType === 'medical'
            ? 'linear-gradient(to bottom right, #EFF6FF, #FFFFFF, #F0F9FF)'
            : 'linear-gradient(to bottom right, #F8FAFC, #FFFFFF, #EFF6FF)'
        }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-30 animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Status Badge */}
            <motion.div
              {...(includeAnimations ? fadeInUp : {})}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg mb-6"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              <span className="text-sm font-medium text-gray-700">
                {businessType === 'restaurant' ? 'Open Now • Fresh Ingredients Daily' : 
                 businessType === 'medical' ? 'Certified Healthcare Excellence' :
                 'Premium Service Available'}
              </span>
            </motion.div>
            
            {/* Main Heading */}
            <motion.h1
              {...(includeAnimations ? { ...fadeInUp, transition: { delay: 0.2, duration: 0.6 } } : {})}
              className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent"
              style={{ fontFamily: designTokens.typography.fontFamilies.display }}
            >
              {businessData.name}
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p
              {...(includeAnimations ? { ...fadeInUp, transition: { delay: 0.4, duration: 0.6 } } : {})}
              className="text-xl md:text-2xl lg:text-3xl text-gray-600 mb-8 font-light"
            >
              {businessType === 'restaurant' ? 'Where Every Meal Becomes a Memory' :
               businessType === 'medical' ? 'Your Health, Our Priority' :
               businessType === 'fitness' ? 'Transform Your Body, Transform Your Life' :
               'Excellence in Every Service'}
            </motion.p>
            
            {/* Stats */}
            <motion.div
              {...(includeAnimations ? { ...fadeInUp, transition: { delay: 0.6, duration: 0.6 } } : {})}
              className="flex flex-wrap justify-center gap-8 mb-12"
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600">
                  {businessData.rating || 4.9}⭐
                </div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600">
                  {businessData.reviews || 500}+
                </div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600">15+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
            </motion.div>
            
            {/* CTA Buttons */}
            <motion.div
              {...(includeAnimations ? { ...fadeInUp, transition: { delay: 0.8, duration: 0.6 } } : {})}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button 
                size="lg" 
                className="group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-6 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <span className="mr-2">
                  {businessType === 'restaurant' ? 'Reserve Your Table' :
                   businessType === 'medical' ? 'Book Appointment' :
                   'Get Started Today'}
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-500 px-8 py-6 rounded-2xl text-lg font-semibold bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                {businessType === 'restaurant' ? 'View Menu' : 'Learn More'}
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          {...(includeAnimations ? { ...fadeInUp, transition: { delay: 1.2, duration: 0.6 } } : {})}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 text-gray-400 animate-bounce" />
        </motion.div>
      </section>
    )

    return <HeroContent />
  }

  // About section
  const renderAbout = () => (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            {...(includeAnimations ? staggerChildren : {})}
            className="text-center mb-16"
          >
            <motion.h2
              {...(includeAnimations ? fadeInUp : {})}
              className="text-3xl md:text-5xl font-bold mb-6"
              style={{ fontFamily: designTokens.typography.fontFamilies.display }}
            >
              About {businessData.name}
            </motion.h2>
            <motion.p
              {...(includeAnimations ? { ...fadeInUp, transition: { delay: 0.2, duration: 0.6 } } : {})}
              className="text-xl text-gray-600 leading-relaxed"
            >
              {businessData.description || 
               `${businessData.name} is your trusted partner for all your ${businessData.type} needs. We're committed to providing exceptional service and exceeding your expectations.`}
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              {...(includeAnimations ? { ...fadeInUp, transition: { delay: 0.4, duration: 0.6 } } : {})}
            >
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl shadow-2xl">
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Heart className="w-8 h-8 text-blue-600" />
                    </div>
                    <p>Business Image Placeholder</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              {...(includeAnimations ? { ...fadeInUp, transition: { delay: 0.6, duration: 0.6 } } : {})}
              className="space-y-6"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Trusted Excellence</h3>
                  <p className="text-gray-600">Years of experience and thousands of satisfied customers</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
                  <p className="text-gray-600">We stand behind every service with our quality promise</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Always Available</h3>
                  <p className="text-gray-600">Professional service when you need it most</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )

  // Services section
  const renderServices = () => (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          {...(includeAnimations ? staggerChildren : {})}
          className="text-center mb-16"
        >
          <motion.h2
            {...(includeAnimations ? fadeInUp : {})}
            className="text-3xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: designTokens.typography.fontFamilies.display }}
          >
            Our Services
          </motion.h2>
          <motion.p
            {...(includeAnimations ? { ...fadeInUp, transition: { delay: 0.2, duration: 0.6 } } : {})}
            className="text-xl text-gray-600"
          >
            Comprehensive solutions tailored to your needs
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(businessData.services || ['Primary Service', 'Secondary Service', 'Premium Service']).map((service, index) => (
            <motion.div
              key={index}
              {...(includeAnimations ? { 
                ...scaleIn, 
                transition: { delay: index * 0.1, duration: 0.6 }
              } : {})}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <Star className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{service}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Professional {service.toLowerCase()} services delivered with excellence and attention to detail.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )

  // Contact section
  const renderContact = () => (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            {...(includeAnimations ? staggerChildren : {})}
            className="text-center mb-16"
          >
            <motion.h2
              {...(includeAnimations ? fadeInUp : {})}
              className="text-3xl md:text-5xl font-bold mb-6"
              style={{ fontFamily: designTokens.typography.fontFamilies.display }}
            >
              Get In Touch
            </motion.h2>
            <motion.p
              {...(includeAnimations ? { ...fadeInUp, transition: { delay: 0.2, duration: 0.6 } } : {})}
              className="text-xl text-gray-600"
            >
              Ready to get started? Contact us today
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              {...(includeAnimations ? { ...fadeInUp, transition: { delay: 0.4, duration: 0.6 } } : {})}
              className="space-y-6"
            >
              {businessData.phone && (
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-gray-600">{businessData.phone}</p>
                  </div>
                </div>
              )}

              {businessData.email && (
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-600">{businessData.email}</p>
                  </div>
                </div>
              )}

              {businessData.address && (
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p className="text-gray-600">{businessData.address}</p>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              {...(includeAnimations ? { ...scaleIn, transition: { delay: 0.6, duration: 0.6 } } : {})}
            >
              <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>We'll get back to you within 24 hours</CardDescription>
                </CardHeader>
                <CardContent className="px-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-10 bg-gray-100 rounded-lg flex items-center px-3 text-gray-500">
                      Your Name
                    </div>
                    <div className="h-10 bg-gray-100 rounded-lg flex items-center px-3 text-gray-500">
                      Your Email
                    </div>
                  </div>
                  <div className="h-24 bg-gray-100 rounded-lg flex items-start p-3 text-gray-500">
                    Your Message
                  </div>
                  <Button className="w-full">Send Message</Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )

  return (
    <div className="min-h-screen bg-white" style={cssVariables}>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        {renderHero()}
        {renderAbout()}
        {renderServices()}
        {renderContact()}
      </Suspense>
    </div>
  )
}
