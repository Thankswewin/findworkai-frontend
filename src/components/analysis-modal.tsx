'use client'

import { X, TrendingUp, AlertTriangle, Lightbulb, Target } from 'lucide-react'

interface AnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  business: {
    name: string
    category: string
    location: string
    rating: number
    opportunityScore: number
  }
  analysis: {
    weaknesses: any[]
    opportunities: any[]
    priority_recommendations: string[]
  }
}

export function AnalysisModal({ isOpen, onClose, business, analysis }: AnalysisModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Business Analysis</h2>
            <p className="text-sm text-gray-500 mt-1">{business.name}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Opportunity Score */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  Opportunity Score
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Overall potential for business improvement
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">
                  {business.opportunityScore}%
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {business.opportunityScore >= 80 ? 'High Priority' : 
                   business.opportunityScore >= 60 ? 'Good Potential' : 'Moderate'}
                </p>
              </div>
            </div>
          </div>

          {/* Business Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium text-gray-900">{business.category}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium text-gray-900">{business.location}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Current Rating</p>
              <p className="font-medium text-gray-900">{business.rating} ⭐</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Analysis Date</p>
              <p className="font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Weaknesses */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
              Identified Weaknesses
            </h3>
            <div className="space-y-3">
              {analysis.weaknesses.length > 0 ? (
                analysis.weaknesses.map((weakness, index) => (
                  <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {typeof weakness === 'string' ? weakness : weakness.description || 'Issue identified'}
                        </p>
                        {weakness.impact && (
                          <p className="text-sm text-gray-600 mt-1">
                            Impact: {weakness.impact}
                          </p>
                        )}
                        {weakness.severity && (
                          <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${
                            weakness.severity === 'high' ? 'bg-red-100 text-red-700' :
                            weakness.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {weakness.severity} priority
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No specific weaknesses identified</p>
              )}
            </div>
          </div>

          {/* Opportunities */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-green-500" />
              Growth Opportunities
            </h3>
            <div className="space-y-3">
              {analysis.opportunities && analysis.opportunities.length > 0 ? (
                analysis.opportunities.map((opportunity, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <Lightbulb className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {opportunity.service || 'Service Opportunity'}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {opportunity.value_proposition || 'Potential for improvement'}
                        </p>
                        {opportunity.expected_roi && (
                          <p className="text-sm text-green-600 font-medium mt-2">
                            Expected ROI: {opportunity.expected_roi}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Analysis in progress...</p>
              )}
            </div>
          </div>

          {/* Recommendations */}
          {analysis.priority_recommendations && analysis.priority_recommendations.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                Priority Recommendations
              </h3>
              <ul className="space-y-2">
                {analysis.priority_recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium text-center leading-6 mr-2 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                // Trigger email generation
                onClose()
              }}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate Outreach Email
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
