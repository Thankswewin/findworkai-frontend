import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function RefundPolicyPage() {
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
          <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. 14-Day Money Back Guarantee</h2>
              <p>We offer a 14-day money back guarantee for all new subscriptions. If you're not satisfied with FindWorkAI within the first 14 days of your purchase, contact us for a full refund.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Eligibility for Refunds</h2>
              <p>To be eligible for a refund, you must meet the following criteria:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Request the refund within 14 days of your initial purchase</li>
                <li>Have used the service in accordance with our Terms of Service</li>
                <li>Not have previously received a refund for the same subscription</li>
                <li>Provide a valid reason for the refund request</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. How to Request a Refund</h2>
              <p>To request a refund, please contact us with:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Your account email address</li>
                <li>The reason for your refund request</li>
                <li>Your order ID or subscription details</li>
                <li>Any feedback that could help us improve our service</li>
              </ul>
              <p className="mt-3">Email: <a href="mailto:support@findworkai.com" className="text-blue-600 hover:underline">support@findworkai.com</a></p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Refund Processing Time</h2>
              <p>Refund requests are typically processed within 5-7 business days. The funds will be credited back to your original payment method. Please note that your bank or payment provider may take additional time to process the refund.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Non-Refundable Items</h2>
              <p>The following items are not eligible for refunds:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Services used beyond the 14-day money back guarantee period</li>
                <li>Custom enterprise solutions or one-time setup fees</li>
                <li>Add-on purchases or credits that have been partially or fully used</li>
                <li>Accounts terminated for violation of our Terms of Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Subscription Cancellations</h2>
              <p>You can cancel your subscription at any time. When you cancel, you'll continue to have access to the service until the end of your current billing period. No refunds will be issued for partial months or unused portions of your subscription.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Service Interruptions</h2>
              <p>In the unlikely event of a significant service interruption or downtime that affects your ability to use our service, we may offer partial refunds or service credits at our discretion. Such decisions will be made on a case-by-case basis.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Changes to This Policy</h2>
              <p>We reserve the right to modify this refund policy at any time. Any changes will be effective immediately upon posting on this page. Your continued use of our service after any changes constitutes acceptance of the new policy.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Contact Information</h2>
              <p>If you have any questions about this Refund Policy, please contact us:</p>
              <p className="mt-2">Email: <a href="mailto:support@findworkai.com" className="text-blue-600 hover:underline">support@findworkai.com</a></p>
              <p>Response time: Within 24-48 hours</p>
            </section>

            <section className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">Customer Satisfaction Promise</h3>
              <p className="text-blue-800 dark:text-blue-200">
                At FindWorkAI, we're committed to your success. If you're experiencing any issues with our service,
                please reach out to our support team first. We'll work with you to resolve any problems and ensure
                you get the most value from our platform.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}