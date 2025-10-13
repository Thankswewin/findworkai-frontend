import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Check, Star, Zap, Shield, Headphones } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your business. Start free, upgrade when you're ready.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Starter Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-gray-600 dark:text-gray-400">Perfect for individuals and small projects</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">/month</span>
              </div>
            </div>

            <Button className="w-full mb-8" variant="outline">
              Get Started
            </Button>

            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>100 business searches per month</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Basic AI analysis</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Email support</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Basic export features</span>
              </li>
            </ul>
          </div>

          {/* Professional Plan - Popular */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl shadow-xl p-8 border-2 border-blue-500 relative transform scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                <Star className="w-4 h-4 mr-1" />
                Most Popular
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <p className="text-blue-100">Best for growing businesses</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-blue-100 ml-2">/month</span>
              </div>
            </div>

            <Button className="w-full mb-8 bg-white text-blue-600 hover:bg-gray-100">
              Start Free Trial
            </Button>

            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                <span>Unlimited business searches</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                <span>Advanced AI analysis & insights</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                <span>Priority email & chat support</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                <span>Advanced export & integrations</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                <span>Custom AI agent training</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-white mr-3 mt-0.5 flex-shrink-0" />
                <span>Team collaboration tools</span>
              </li>
            </ul>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-gray-600 dark:text-gray-400">Custom solutions for large teams</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">Custom</span>
              </div>
            </div>

            <Button className="w-full mb-8">
              Contact Sales
            </Button>

            <ul className="space-y-3">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Everything in Professional</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Custom AI model training</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Dedicated account manager</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>SLA guarantees</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>Custom integrations</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>On-premise deployment option</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose FindWorkAI?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get results in seconds, not hours. Our AI-powered search processes thousands of businesses instantly.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Bank-level security with 99.9% uptime. Your data is always protected and available when you need it.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-purple-600 dark:text-purple-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get help when you need it from our team of experts who understand your business needs.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Can I change plans anytime?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at the next billing cycle.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Is there a free trial?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! Professional plan comes with a 14-day free trial. No credit card required to start.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                We accept all major credit cards, PayPal, and bank transfers for enterprise customers.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Is my data secure?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Absolutely. We use industry-standard encryption and security practices to protect your data.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to grow your business?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of businesses already using FindWorkAI to discover opportunities.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}