import Link from 'next/link'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  Users,
  BarChart3,
  CheckCircle,
  Star,
  TrendingUp,
  Shield,
  Globe,
  Mail,
  Phone,
  MessageSquare
} from 'lucide-react'
import { Footer } from '@/components/layouts/Footer'
import { LandingHeader } from '@/components/layouts/LandingHeader'

export const metadata: Metadata = {
  title: 'FindWorkAI - AI-Powered Business Discovery Platform',
  description: 'Transform your lead generation with intelligent automation. Discover real businesses, analyze opportunities, and generate leads with AI.',
  keywords: 'FindWorkAI, business discovery, AI leads, lead generation, Pheelymon',
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-20 pt-4">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 mb-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>

            <div className="flex items-center justify-center mb-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                <Sparkles className="h-12 w-12 text-white" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-black bg-clip-text text-transparent">
              AI-Powered Business Discovery
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your lead generation with intelligent automation. Discover real businesses, analyze opportunities, and generate targeted outreach campaigns that convert.
            </p>

            {/* Customer Rating */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                4.9/5 from 2,347+ satisfied customers
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-black hover:from-blue-700 hover:to-gray-900 text-lg px-8 py-3">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Businesses Discovered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Lead Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">3.5M</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Emails Sent</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Trusted by 10,000+ Businesses Worldwide
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                See what our customers have to say about their experience
              </p>
            </div>

            {/* Company Logos */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16 items-center opacity-60">
              {['TechCorp', 'DataFlow', 'CloudNet', 'AI Solutions', 'Growth Co', 'StartupHub'].map((company) => (
                <div key={company} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                  {company}
                </div>
              ))}
            </div>

            {/* Testimonials Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Sarah Johnson',
                  role: 'CEO at TechCorp',
                  content: 'FindWorkAI transformed our lead generation. We discovered 150+ qualified leads in the first month alone.',
                  rating: 5,
                  avatar: 'SJ'
                },
                {
                  name: 'Michael Chen',
                  role: 'Marketing Director at DataFlow',
                  content: 'The AI-powered analysis is incredibly accurate. Our conversion rate increased by 45% using FindWorkAI.',
                  rating: 5,
                  avatar: 'MC'
                },
                {
                  name: 'Emily Rodriguez',
                  role: 'Sales Manager at CloudNet',
                  content: 'Best investment we made this year. The automated outreach campaigns save us 20+ hours per week.',
                  rating: 5,
                  avatar: 'ER'
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to Grow Your Business
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Powerful AI-driven features that help you discover opportunities, connect with prospects, and close more deals.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Target,
                  title: 'Smart Lead Generation',
                  description: 'Our AI analyzes thousands of businesses to find the perfect leads for your specific needs and criteria.',
                  color: 'blue'
                },
                {
                  icon: Zap,
                  title: 'Lightning Fast Analysis',
                  description: 'Get comprehensive business insights and opportunity analysis in seconds, not hours of manual research.',
                  color: 'green'
                },
                {
                  icon: BarChart3,
                  title: 'Advanced Analytics',
                  description: 'Track your performance, optimize your campaigns, and make data-driven decisions with our analytics dashboard.',
                  color: 'purple'
                },
                {
                  icon: Mail,
                  title: 'Automated Outreach',
                  description: 'Send personalized email campaigns at scale with AI-powered content generation and timing optimization.',
                  color: 'orange'
                },
                {
                  icon: Shield,
                  title: 'Data Security',
                  description: 'Enterprise-grade security with GDPR compliance and advanced encryption to protect your sensitive data.',
                  color: 'red'
                },
                {
                  icon: Globe,
                  title: 'Global Database',
                  description: 'Access millions of verified business profiles across 195+ countries with real-time data updates.',
                  color: 'indigo'
                }
              ].map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="group">
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 h-full hover:shadow-lg transition-shadow">
                      <div className={`w-16 h-16 bg-${feature.color}-100 dark:bg-${feature.color}-900 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-8 w-8 text-${feature.color}-600 dark:text-${feature.color}-300`} />
                      </div>
                      <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Feature CTA */}
            <div className="text-center mt-16">
              <div className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                <span>Explore all features</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Choose the plan that fits your business needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">Free</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-gray-600 dark:text-gray-400">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    '100 business searches',
                    'Basic analytics',
                    'Email support',
                    '3 AI agents'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button className="w-full" variant="outline">
                    Get Started
                  </Button>
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="bg-gradient-to-br from-blue-600 to-black rounded-xl p-8 shadow-lg text-white relative transform scale-105">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">Pro</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">$99</span>
                    <span className="text-blue-100">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    'Unlimited searches',
                    'Advanced analytics',
                    'Priority support',
                    'Unlimited AI agents',
                    'Custom integrations',
                    'API access'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                    Start Free Trial
                  </Button>
                </Link>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">Custom</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    'Everything in Pro',
                    'Dedicated account manager',
                    'Custom training',
                    'SLA guarantee',
                    'White-label options'
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact">
                  <Button className="w-full" variant="outline">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-gray-600 dark:text-gray-400">
                All plans include 14-day free trial • No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Lead Generation?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of businesses already using FindWorkAI to discover opportunities and grow their revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-gray-900 hover:text-white">
                  View Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Have questions? We're here to help you succeed
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Email Support</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Get help from our support team
                </p>
                <a href="mailto:support@findworkai.com" className="text-blue-600 hover:text-blue-700 font-medium">
                  support@findworkai.com
                </a>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-green-600 dark:text-green-300" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Mon-Fri 9AM-6PM EST
                </p>
                <a href="tel:+1-555-0123" className="text-blue-600 hover:text-blue-700 font-medium">
                  +1 (555) 012-3456
                </a>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-purple-600 dark:text-purple-300" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Instant help when you need it
                </p>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Start Chat
                </button>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">
                Stay Updated with AI Insights
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Get the latest tips, trends, and best practices delivered to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button className="bg-gradient-to-r from-blue-600 to-black hover:from-blue-700 hover:to-gray-900">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
