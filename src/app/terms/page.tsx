import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p>By accessing and using FindWorkAI, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">2. Use License</h2>
              <p>Permission is granted to temporarily use FindWorkAI for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on FindWorkAI</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">3. Service Description</h2>
              <p>FindWorkAI provides AI-powered lead generation and business analysis services. We help businesses identify potential clients and generate outreach campaigns.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">4. User Responsibilities</h2>
              <p>Users are responsible for:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Maintaining the confidentiality of their account</li>
                <li>All activities that occur under their account</li>
                <li>Ensuring their use complies with applicable laws</li>
                <li>Not using the service for spam or unsolicited communications</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">5. Privacy</h2>
              <p>Your use of FindWorkAI is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">6. Disclaimer</h2>
              <p>The materials on FindWorkAI are provided on an 'as is' basis. FindWorkAI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">7. Limitations</h2>
              <p>In no event shall FindWorkAI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use FindWorkAI, even if FindWorkAI or a FindWorkAI authorized representative has been notified orally or in writing of the possibility of such damage.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">8. Governing Law</h2>
              <p>These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">9. Changes to Terms</h2>
              <p>FindWorkAI reserves the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide notice prior to any new terms taking effect.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">10. Contact Information</h2>
              <p>If you have any questions about these Terms, please contact us at:</p>
              <p className="mt-2">Email: legal@findworkai.com</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
