'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, Sparkles, TrendingUp, Target, Lightbulb,
  ChevronRight, Loader2, BarChart, PieChart, Activity,
  AlertTriangle, CheckCircle, Info, X
} from 'lucide-react'
import apiService from '@/services/api'
import toast from 'react-hot-toast'

interface AnalysisResult {
  business_id: string
  business_name: string
  analysis_date: string
  overall_score: number
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  recommendations: {
    priority: 'high' | 'medium' | 'low'
    action: string
    impact: string
    timeframe: string
  }[]
  competitor_analysis: {
    total_competitors: number
    market_position: string
    competitive_advantages: string[]
    threats: string[]
  }
  market_insights: {
    market_size: string
    growth_trend: string
    customer_segments: string[]
    key_trends: string[]
  }
}

export default function AIAnalysis() {
  const [selectedBusiness, setSelectedBusiness] = useState<string>('')
  const [businessName, setBusinessName] = useState<string>('')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const runAnalysis = async () => {
    if (!selectedBusiness) {
      toast.error('Please enter a business ID')
      return
    }

    try {
      setLoading(true)
      const response = await apiService.analyzeBusiness(selectedBusiness)
      setAnalysisResult(response)
      setShowModal(true)
      toast.success('Analysis completed successfully!')
    } catch (error) {
      toast.error('Failed to analyze business')
      console.error('Error analyzing business:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-10 w-10" />
            <h2 className="text-3xl font-bold">AI Business Analysis</h2>
          </div>
          <p className="text-white/90 mb-6">
            Get comprehensive AI-powered insights for any business including strengths, 
            weaknesses, opportunities, and actionable recommendations.
          </p>
          
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter Business ID"
              value={selectedBusiness}
              onChange={(e) => setSelectedBusiness(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 bg-white/95 placeholder-gray-500"
            />
            <input
              type="text"
              placeholder="Business Name (optional)"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 bg-white/95 placeholder-gray-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runAnalysis}
              disabled={loading}
              className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-white/90 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="h-5 w-5" />
              )}
              Analyze Business
            </motion.button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Analysis Type</p>
                <p className="text-xl font-bold text-gray-900">Comprehensive</p>
              </div>
              <BarChart className="h-8 w-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Data Points</p>
                <p className="text-xl font-bold text-gray-900">50+</p>
              </div>
              <PieChart className="h-8 w-8 text-purple-600" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">AI Models</p>
                <p className="text-xl font-bold text-gray-900">GPT-4</p>
              </div>
              <Brain className="h-8 w-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Accuracy</p>
                <p className="text-xl font-bold text-gray-900">95%+</p>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">What You'll Get</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">SWOT Analysis</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Comprehensive breakdown of strengths, weaknesses, opportunities, and threats
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Target className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Competitor Analysis</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Market positioning and competitive advantages assessment
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lightbulb className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Actionable Recommendations</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Prioritized action items with impact assessment and timeframes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Results Modal */}
      {showModal && analysisResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{analysisResult.business_name}</h3>
                <p className="text-sm text-gray-600 mt-1">Analysis Date: {new Date(analysisResult.analysis_date).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Overall Score */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Overall Score</h4>
                    <p className="text-sm text-gray-600 mt-1">Based on comprehensive analysis</p>
                  </div>
                  <div className={`text-4xl font-bold ${getScoreColor(analysisResult.overall_score)}`}>
                    {analysisResult.overall_score}/100
                  </div>
                </div>
              </div>

              {/* SWOT Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-xl p-6">
                  <h4 className="font-semibold text-green-900 mb-3">Strengths</h4>
                  <ul className="space-y-2">
                    {analysisResult.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50 rounded-xl p-6">
                  <h4 className="font-semibold text-red-900 mb-3">Weaknesses</h4>
                  <ul className="space-y-2">
                    {analysisResult.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                        <span className="text-sm text-gray-700">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-900 mb-3">Opportunities</h4>
                  <ul className="space-y-2">
                    {analysisResult.opportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                        <span className="text-sm text-gray-700">{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-orange-50 rounded-xl p-6">
                  <h4 className="font-semibold text-orange-900 mb-3">Market Insights</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Market Size:</span> {analysisResult.market_insights.market_size}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Growth Trend:</span> {analysisResult.market_insights.growth_trend}
                    </p>
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Key Trends:</p>
                      {analysisResult.market_insights.key_trends.map((trend, index) => (
                        <span key={index} className="inline-block px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs mr-2 mb-2">
                          {trend}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h4>
                <div className="space-y-4">
                  {analysisResult.recommendations.map((rec, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                          {rec.priority.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">{rec.timeframe}</span>
                      </div>
                      <p className="font-medium text-gray-900">{rec.action}</p>
                      <p className="text-sm text-gray-600 mt-1">Impact: {rec.impact}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitor Analysis */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Competitor Analysis</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Competitors</p>
                    <p className="text-xl font-bold text-gray-900">{analysisResult.competitor_analysis.total_competitors}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Market Position</p>
                    <p className="text-xl font-bold text-gray-900">{analysisResult.competitor_analysis.market_position}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Competitive Advantages:</p>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.competitor_analysis.competitive_advantages.map((adv, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">
                          {adv}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Threats:</p>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.competitor_analysis.threats.map((threat, index) => (
                        <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm">
                          {threat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}
