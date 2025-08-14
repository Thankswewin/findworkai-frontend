'use client'

import { useState } from 'react'
import { Star, Globe, AlertTriangle, TrendingUp, Mail } from 'lucide-react'
import { useBusinessStore } from '@/store/business-store'
import { AnalysisModal } from './analysis-modal'

interface Business {
  id: string
  name: string
  category: string
  location: string
  rating: number
  totalReviews: number
  hasWebsite: boolean
  opportunityScore: number
  weaknesses: string[]
}

interface BusinessListProps {
  businesses: Business[]
}

export function BusinessList({ businesses }: BusinessListProps) {
  const { analyzeBusinesses, generateEmail } = useBusinessStore()
  const [analyzingId, setAnalyzingId] = useState<string | null>(null)
  const [generatingEmailId, setGeneratingEmailId] = useState<string | null>(null)
  const [emailModal, setEmailModal] = useState<any>(null)
  const [analysisModal, setAnalysisModal] = useState<{
    isOpen: boolean
    business: Business | null
    analysis: any
  }>({ isOpen: false, business: null, analysis: null })
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  const handleAnalyze = async (business: Business) => {
    setAnalyzingId(business.id)
    try {
      // Call the analysis API directly to get results
      const response = await fetch(`http://localhost:8000/api/v1/demo/analyze-business`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: business.name,
          business_category: business.category,
          city: business.location.split(',')[0],
          state: business.location.split(',')[1]?.trim() || '',
          rating: business.rating,
          total_reviews: business.totalReviews,
          has_website: business.hasWebsite,
          website: null
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Update the business in the store
        await analyzeBusinesses([business.id])
        
        // Show the analysis in the modal
        setAnalysisModal({
          isOpen: true,
          business: {
            ...business,
            opportunityScore: result.opportunity_score
          },
          analysis: result.analysis
        })
      } else {
        alert('Analysis failed. Please try again.')
      }
    } catch (error) {
      alert('Analysis failed. Please try again.')
    } finally {
      setAnalyzingId(null)
    }
  }

  const handleGenerateEmail = async (business: Business) => {
    setGeneratingEmailId(business.id)
    try {
      const result = await generateEmail(business.id, 'website_design')
      if (result.success) {
        setEmailModal({
          business: business.name,
          email: result.email
        })
        alert(`Email Generated!\n\nSubject: ${result.email.subject}\n\n${result.email.body}`)
      }
    } catch (error) {
      alert('Email generation failed. Please try again.')
    } finally {
      setGeneratingEmailId(null)
    }
  }

  return (
    <>
      <div className="divide-y divide-gray-200">
        {businesses.map((business) => (
        <div key={business.id} className="p-6 hover:bg-gray-50 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {business.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {business.category} • {business.location}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(business.opportunityScore)}`}>
                  {business.opportunityScore}% opportunity
                </span>
              </div>

              <div className="mt-3 flex items-center space-x-4">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm text-gray-600">
                    {business.rating} ({business.totalReviews} reviews)
                  </span>
                </div>
                
                {!business.hasWebsite && (
                  <div className="flex items-center text-red-600">
                    <Globe className="h-4 w-4 mr-1" />
                    <span className="text-sm">No website</span>
                  </div>
                )}
              </div>

              {business.weaknesses.length > 0 && (
                <div className="mt-3 flex items-start">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mr-2 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Issues: </span>
                    {business.weaknesses.slice(0, 2).join(', ')}
                  </div>
                </div>
              )}

              <div className="mt-4 flex space-x-3">
                <button 
                  onClick={() => handleAnalyze(business)}
                  disabled={analyzingId === business.id}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {analyzingId === business.id ? 'Analyzing...' : 'Analyze'}
                </button>
                <button 
                  onClick={() => handleGenerateEmail(business)}
                  disabled={generatingEmailId === business.id}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  <Mail className="h-3 w-3 mr-1" />
                  {generatingEmailId === business.id ? 'Generating...' : 'Generate Email'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
        {businesses.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No businesses found. Try searching for businesses in your area.
          </div>
        )}
      </div>
      
      {/* Analysis Modal */}
      {analysisModal.isOpen && analysisModal.business && (
        <AnalysisModal
          isOpen={analysisModal.isOpen}
          onClose={() => setAnalysisModal({ isOpen: false, business: null, analysis: null })}
          business={analysisModal.business}
          analysis={analysisModal.analysis || {}}
        />
      )}
    </>
  )
}
