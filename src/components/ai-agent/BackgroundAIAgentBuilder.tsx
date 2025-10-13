'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe,
  Wand2,
  TrendingUp,
  Loader2,
  Eye,
  Download,
  Rocket,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  X,
  Minimize2,
  Maximize2,
  Pause,
  Play,
  Square
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArtifactViewer } from './ArtifactViewer'
import { GeneratedArtifact } from '@/lib/ai-agent'
import { useUserContentHistory } from '@/components/user/UserContentHistory'
import toast from 'react-hot-toast'

interface BackgroundAIAgentBuilderProps {
  business: {
    id: string
    name: string
    category: string
    location: string
    rating: number
    totalReviews: number
    hasWebsite: boolean
    website?: string
    phone?: string
    email?: string
    opportunityScore?: number
  }
  agentType: 'website' | 'content' | 'marketing'
  isOpen: boolean
  onClose: () => void
  apiKey?: string
}

interface BuildingTask {
  id: string
  businessId: string
  businessName: string
  agentType: string
  status: 'queued' | 'building' | 'completed' | 'error' | 'paused'
  progress: number
  currentStep: string
  startTime: Date
  estimatedCompletion?: Date
  artifact?: GeneratedArtifact
  error?: string
}

const agentConfigs = {
  website: {
    name: 'Website Builder',
    description: 'Creating a professional website',
    estimatedTime: '2-3 minutes',
    color: 'from-blue-500 to-cyan-500'
  },
  content: {
    name: 'Content Creator',
    description: 'Generating marketing content',
    estimatedTime: '1-2 minutes',
    color: 'from-purple-500 to-pink-500'
  },
  marketing: {
    name: 'Marketing Campaign',
    description: 'Building marketing materials',
    estimatedTime: '2-4 minutes',
    color: 'from-green-500 to-emerald-500'
  }
}

export function BackgroundAIAgentBuilder({
  business,
  agentType,
  isOpen,
  onClose,
  apiKey
}: BackgroundAIAgentBuilderProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentTask, setCurrentTask] = useState<BuildingTask | null>(null)
  const [showViewer, setShowViewer] = useState(false)
  const [selectedArtifact, setSelectedArtifact] = useState<GeneratedArtifact | null>(null)
  const [allowBackground, setAllowBackground] = useState(true)

  const { addArtifact } = useUserContentHistory()
  const abortControllerRef = useRef<AbortController | null>(null)
  const buildingRef = useRef(false)

  const config = agentConfigs[agentType]

  // Check for existing tasks on mount
  useEffect(() => {
    loadExistingTask()
  }, [business.id, agentType])

  const loadExistingTask = () => {
    try {
      const existingTasks = JSON.parse(localStorage.getItem('ai_building_tasks') || '[]')
      const existingTask = existingTasks.find((task: BuildingTask) =>
        task.businessId === business.id && task.agentType === agentType
      )

      if (existingTask && (existingTask.status === 'building' || existingTask.status === 'queued')) {
        setCurrentTask(existingTask)
        if (existingTask.status === 'queued') {
          startBuilding(existingTask)
        }
      }
    } catch (error) {
      console.error('Error loading existing task:', error)
    }
  }

  const saveTask = (task: BuildingTask) => {
    try {
      const existingTasks = JSON.parse(localStorage.getItem('ai_building_tasks') || '[]')
      const updatedTasks = existingTasks.filter((t: BuildingTask) => t.id !== task.id)
      updatedTasks.push(task)
      localStorage.setItem('ai_building_tasks', JSON.stringify(updatedTasks))
    } catch (error) {
      console.error('Error saving task:', error)
    }
  }

  const completeTask = (task: BuildingTask, artifact: GeneratedArtifact) => {
    task.status = 'completed'
    task.progress = 100
    task.currentStep = 'Complete!'
    task.artifact = artifact

    saveTask(task)
    setCurrentTask(task)

    // Auto-save to user history
    addArtifact(business.id, artifact)

    toast.success(`${config.name} completed successfully!`)

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('FindWorkAI - Build Complete!', {
        body: `${config.name} for ${business.name} is ready to view.`,
        icon: '/favicon.ico'
      })
    }
  }

  const failTask = (task: BuildingTask, error: string) => {
    task.status = 'error'
    task.error = error
    saveTask(task)
    setCurrentTask(task)
  }

  const startBuilding = async (task?: BuildingTask) => {
    if (buildingRef.current) return

    const buildTask = task || {
      id: Date.now().toString(),
      businessId: business.id,
      businessName: business.name,
      agentType,
      status: 'building' as const,
      progress: 0,
      currentStep: 'Initializing...',
      startTime: new Date(),
      estimatedCompletion: new Date(Date.now() + 180000) // 3 minutes estimate
    }

    buildingRef.current = true
    setCurrentTask(buildTask)
    saveTask(buildTask)

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    if (allowBackground && task) {
      // Minimize and continue in background
      setIsMinimized(true)
    }

    try {
      abortControllerRef.current = new AbortController()
      const controller = abortControllerRef.current

      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://findworkai-backend-1.onrender.com/api/v1'

      const businessInfo = {
        name: business.name,
        business_category: business.category,
        city: business.location?.split(',')[0] || 'Unknown',
        state: business.location?.split(',')[1] || '',
        rating: business.rating || 4.0,
        total_reviews: business.totalReviews || 0,
        has_website: business.hasWebsite || false,
        phone: business.phone,
        email: business.email,
        address: business.location
      }

      // Update progress
      buildTask.currentStep = 'Connecting to AI service...'
      buildTask.progress = 20
      saveTask(buildTask)

      const response = await fetch(`${backendUrl}/mcp-enhanced/generate-enhanced`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_info: businessInfo,
          enable_mcp: true,
          enable_self_reflection: true,
          enable_self_correction: true,
          max_iterations: 1,
          framework: 'html',
          style_preference: 'modern'
        }),
        signal: controller.signal
      })

      if (controller.signal.aborted) {
        failTask(buildTask, 'Build was cancelled')
        return
      }

      buildTask.currentStep = 'AI generating content...'
      buildTask.progress = 60
      saveTask(buildTask)

      if (!response.ok) {
        let errorMessage = 'AI service temporarily unavailable'
        try {
          const error = await response.json()
          if (error.detail) {
            errorMessage = error.detail
          }
        } catch (e) {
          // Use default message
        }

        if (response.status === 500) {
          errorMessage = 'The backend AI service is currently unavailable. Please try again in a moment.'
        }

        throw new Error(errorMessage)
      }

      buildTask.currentStep = 'Processing response...'
      buildTask.progress = 80
      saveTask(buildTask)

      const data = await response.json()
      const aiContent = data.final_output || data.output || data.response || ''

      const artifact: GeneratedArtifact = {
        id: buildTask.id,
        name: `${business.name} - ${config.name}`,
        type: agentType,
        content: aiContent,
        generatedAt: new Date(),
        metadata: {
          framework: 'HTML/CSS/JS',
          responsive: true,
          seoOptimized: true,
          businessName: business.name,
          businessCategory: business.category,
          generatedByAI: true,
          aiModel: data.model_used || 'AI Service'
        }
      }

      completeTask(buildTask, artifact)

    } catch (error: any) {
      console.error('Build error:', error)
      failTask(buildTask, error.message || 'Build failed. Please try again.')
      toast.error(error.message || 'Build failed')
    } finally {
      buildingRef.current = false
      abortControllerRef.current = null
    }
  }

  const pauseBuilding = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      buildingRef.current = false

      if (currentTask) {
        currentTask.status = 'paused'
        currentTask.currentStep = 'Paused'
        saveTask(currentTask)
        setCurrentTask({ ...currentTask })
      }

      toast.success('Build paused')
    }
  }

  const cancelBuilding = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      buildingRef.current = false

      if (currentTask) {
        failTask(currentTask, 'Cancelled by user')
      }

      toast.success('Build cancelled')
      onClose()
    }
  }

  const resumeBuilding = () => {
    if (currentTask && currentTask.status === 'paused') {
      startBuilding(currentTask)
    }
  }

  const openViewer = () => {
    if (currentTask?.artifact) {
      setSelectedArtifact(currentTask.artifact)
      setShowViewer(true)
    }
  }

  const downloadArtifact = () => {
    if (!currentTask?.artifact) return

    const content = typeof currentTask.artifact.content === 'string'
      ? currentTask.artifact.content
      : JSON.stringify(currentTask.artifact.content, null, 2)

    const blob = new Blob([content], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentTask.artifact.name.replace(/\s+/g, '_')}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Downloaded successfully!')
  }

  // Minimized floating widget
  if (isMinimized && currentTask) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Card className="w-80 shadow-lg border-2 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${config.color} text-white`}>
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{config.name}</p>
                  <p className="text-xs text-gray-600">{business.name}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMinimized(false)}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>

            {currentTask.status === 'building' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{currentTask.currentStep}</span>
                  <span className="font-medium">{currentTask.progress}%</span>
                </div>
                <Progress value={currentTask.progress} className="h-2" />
                <div className="flex items-center gap-2 text-blue-600">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span className="text-xs">Building in background...</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={pauseBuilding}>
                    <Pause className="w-3 h-3 mr-1" />
                    Pause
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelBuilding}>
                    <Square className="w-3 h-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {currentTask.status === 'completed' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Build Complete!</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={openViewer}>
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" onClick={downloadArtifact}>
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            )}

            {currentTask.status === 'error' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Build Failed</span>
                </div>
                <p className="text-xs text-gray-600">{currentTask.error}</p>
                <Button size="sm" onClick={() => {
                  setCurrentTask(null)
                  setIsMinimized(false)
                }}>
                  Try Again
                </Button>
              </div>
            )}

            {currentTask.status === 'paused' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-orange-600">
                  <Pause className="w-4 h-4" />
                  <span className="text-sm font-medium">Paused</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={resumeBuilding}>
                    <Play className="w-3 h-3 mr-1" />
                    Resume
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelBuilding}>
                    <Square className="w-3 h-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${
        isFullscreen ? 'max-w-7xl h-[90vh]' : 'max-w-2xl'
      } ${isMinimized ? 'p-0' : ''}`}>
        {!isMinimized && (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${config.color} text-white`}>
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <DialogTitle>{config.name}</DialogTitle>
                    <DialogDescription>
                      {config.description} for {business.name}
                    </DialogDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              {/* Business Info */}
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Target Business</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{business.name}</p>
                      <p className="text-sm text-gray-600">{business.category} • {business.location}</p>
                    </div>
                    <Badge variant="outline">
                      {business.rating}⭐ ({business.totalReviews})
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Background Option */}
              {!currentTask && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <div className="flex-1">
                        <p className="font-medium">Continue building in background</p>
                        <p className="text-sm text-gray-600">
                          You can keep exploring the app while the AI builds your {agentType}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={allowBackground}
                        onChange={(e) => setAllowBackground(e.target.checked)}
                        className="w-4 h-4"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Building Progress */}
              {currentTask && (
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{currentTask.currentStep}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{currentTask.progress}%</span>
                          {currentTask.status === 'building' && (
                            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                          )}
                        </div>
                      </div>
                      <Progress value={currentTask.progress} className="h-2" />

                      {currentTask.status === 'building' && (
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Clock className="w-4 h-4" />
                          <span>Estimated time: {config.estimatedTime}</span>
                        </div>
                      )}

                      {currentTask.status === 'completed' && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">Build completed successfully!</span>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={openViewer} className="flex-1">
                              <Eye className="w-4 h-4 mr-2" />
                              View Result
                            </Button>
                            <Button variant="outline" onClick={downloadArtifact}>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      )}

                      {currentTask.status === 'error' && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Build Failed</AlertTitle>
                          <AlertDescription>
                            {currentTask.error}
                          </AlertDescription>
                        </Alert>
                      )}

                      {currentTask.status === 'paused' && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-orange-600">
                            <Pause className="w-5 h-5" />
                            <span className="font-medium">Build paused</span>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={resumeBuilding}>
                              <Play className="w-4 h-4 mr-2" />
                              Resume
                            </Button>
                            <Button variant="outline" onClick={cancelBuilding}>
                              <Square className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Warning for missing API key */}
              {!apiKey && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>API Key Required</AlertTitle>
                  <AlertDescription>
                    Please configure your OpenRouter API key in settings to enable AI building.
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button variant="outline" onClick={onClose}>
                  {currentTask ? 'Minimize' : 'Cancel'}
                </Button>

                {!currentTask && (
                  <Button
                    onClick={() => startBuilding()}
                    disabled={!apiKey}
                    className={`bg-gradient-to-r ${config.color} text-white`}
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Start Building
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>

      {/* Artifact Viewer */}
      {showViewer && selectedArtifact && (
        <ArtifactViewer
          artifact={selectedArtifact}
          onClose={() => setShowViewer(false)}
          onSave={(content) => {
            toast.success('Changes saved!')
          }}
          onDeploy={(artifact) => {
            toast.success('Deployed successfully!')
          }}
          apiKey={apiKey}
        />
      )}
    </Dialog>
  )
}