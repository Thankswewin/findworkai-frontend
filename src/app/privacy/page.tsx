import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p>Welcome to FindWorkAI. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
              <p>We may collect, use, store and transfer different kinds of personal data about you:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Identity Data:</strong> first name, last name, username</li>
                <li><strong>Contact Data:</strong> email address, telephone numbers</li>
                <li><strong>Technical Data:</strong> IP address, browser type and version, time zone setting, browser plug-in types, operating system</li>
                <li><strong>Usage Data:</strong> information about how you use our website and services</li>
                <li><strong>Marketing Data:</strong> preferences in receiving marketing from us</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
              <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information to improve our service</li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
              <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. We limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">5. Data Retention</h2>
              <p>We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">6. Third-Party Services</h2>
              <p>Our service may contain links to third-party websites or services that are not owned or controlled by FindWorkAI. We use the following third-party services:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Supabase:</strong> For authentication and database services</li>
                <li><strong>Google Maps API:</strong> For business location services</li>
                <li><strong>OpenRouter:</strong> For AI-powered analysis</li>
                <li><strong>Stripe:</strong> For payment processing (if applicable)</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">7. Your Rights</h2>
              <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Request transfer of your personal data</li>
                <li>Right to withdraw consent</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">8. Cookies</h2>
              <p>We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">9. Children's Privacy</h2>
              <p>Our service does not address anyone under the age of 18. We do not knowingly collect personally identifiable information from anyone under the age of 18.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">10. Changes to This Privacy Policy</h2>
              <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">11. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us:</p>
              <p className="mt-2">Email: privacy@findworkai.com</p>
              <p>Address: FindWorkAI, United States</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
