import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mail, Phone, MessageSquare, MapPin, Clock } from 'lucide-react'
import { Footer } from '@/components/layouts/Footer'
import { LandingHeader } from '@/components/layouts/LandingHeader'

export const metadata: Metadata = {
  title: 'Contact Us - FindWorkAI',
  description: 'Get in touch with the FindWorkAI team for support, sales inquiries, or any questions about our AI-powered business discovery platform.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <LandingHeader />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Have questions about FindWorkAI? We're here to help you succeed with AI-powered business discovery.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">

              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold mb-8">Send us a Message</h2>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a topic</option>
                      <option value="sales">Sales Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="feedback">General Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us how we can help you..."
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-black hover:from-blue-700 hover:to-gray-900">
                    Send Message
                  </Button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-8">Contact Information</h2>

                  <div className="space-y-6">
                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Mail className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Email Support</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-2">
                            Get help from our support team
                          </p>
                          <a href="mailto:support@findworkai.com" className="text-blue-600 hover:text-blue-700 font-medium">
                            support@findworkai.com
                          </a>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Phone className="h-6 w-6 text-green-600 dark:text-green-300" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Phone Support</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-2">
                            Mon-Fri 9AM-6PM EST
                          </p>
                          <a href="tel:+1-555-0123" className="text-blue-600 hover:text-blue-700 font-medium">
                            +1 (555) 012-3456
                          </a>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Live Chat</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-2">
                            Instant help when you need it
                          </p>
                          <button className="text-blue-600 hover:text-blue-700 font-medium">
                            Start Chat
                          </button>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Clock className="h-6 w-6 text-orange-600 dark:text-orange-300" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Response Times</h3>
                          <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                            <li>• Email: Within 24 hours</li>
                            <li>• Live Chat: Instant during business hours</li>
                            <li>• Phone: Immediate during business hours</li>
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Office Location */}
                <Card className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Headquarters</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        123 Tech Street<br />
                        San Francisco, CA 94105<br />
                        United States
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Find answers to common questions about FindWorkAI
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  q: "How does the 14-day free trial work?",
                  a: "You get full access to all Pro features for 14 days. No credit card required to start. After the trial, you can choose to upgrade to a paid plan or continue with our free plan."
                },
                {
                  q: "Can I cancel my subscription anytime?",
                  a: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period, and you won't be charged again."
                },
                {
                  q: "Do you offer enterprise support?",
                  a: "Yes, we offer dedicated support for enterprise customers with custom SLAs, dedicated account managers, and priority response times."
                },
                {
                  q: "How accurate is your business data?",
                  a: "Our AI continuously analyzes and verifies business data from multiple sources. We maintain a 94% accuracy rate and update our database regularly."
                }
              ].map((faq, index) => (
                <Card key={index} className="p-6">
                  <h3 className="font-semibold mb-3">{faq.q}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}