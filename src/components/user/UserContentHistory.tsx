'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Globe,
  FileText,
  TrendingUp,
  Calendar,
  Clock,
  Eye,
  Download,
  Share2,
  Trash2,
  Filter,
  Search,
  MoreVertical,
  ExternalLink,
  Zap,
  History,
  Folder,
  Tag,
  Star
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { GeneratedArtifact } from '@/lib/ai-agent'
import { ArtifactViewer } from '@/components/ai-agent/ArtifactViewer'
import toast from 'react-hot-toast'

// Types
interface UserProject {
  id: string
  businessId: string
  businessName: string
  businessCategory: string
  location: string
  artifacts: GeneratedArtifact[]
  createdAt: Date
  lastModified: Date
  status: 'active' | 'archived' | 'draft'
  tags: string[]
  opportunityScore?: number
}

interface UserContentHistoryProps {
  userId?: string
}

export function UserContentHistory({ userId }: UserContentHistoryProps) {
  const [projects, setProjects] = useState<UserProject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState<UserProject | null>(null)
  const [selectedArtifact, setSelectedArtifact] = useState<GeneratedArtifact | null>(null)
  const [showArtifactViewer, setShowArtifactViewer] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [filterType, setFilterType] = useState<'all' | 'website' | 'content' | 'marketing'>('all')

  // Load user's content history from localStorage
  useEffect(() => {
    loadUserProjects()
  }, [])

  const loadUserProjects = () => {
    try {
      setLoading(true)
      const storedProjects = localStorage.getItem(`findworkai_user_projects_${userId || 'guest'}`)
      if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects).map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          lastModified: new Date(p.lastModified)
        }))
        setProjects(parsedProjects.sort((a: UserProject, b: UserProject) =>
          b.lastModified.getTime() - a.lastModified.getTime()
        ))
      }
    } catch (error) {
      console.error('Error loading projects:', error)
      toast.error('Failed to load your projects')
    } finally {
      setLoading(false)
    }
  }

  const saveProject = (project: UserProject) => {
    try {
      const updatedProjects = projects.map(p =>
        p.id === project.id ? project : p
      )
      setProjects(updatedProjects)
      localStorage.setItem(
        `findworkai_user_projects_${userId || 'guest'}`,
        JSON.stringify(updatedProjects)
      )
    } catch (error) {
      console.error('Error saving project:', error)
      toast.error('Failed to save project')
    }
  }

  const addArtifactToProject = (businessId: string, artifact: GeneratedArtifact) => {
    let project = projects.find(p => p.businessId === businessId)

    if (!project) {
      // Create new project if it doesn't exist
      project = {
        id: Date.now().toString(),
        businessId,
        businessName: artifact.metadata?.businessName || 'Unknown Business',
        businessCategory: artifact.metadata?.businessCategory || 'General',
        location: artifact.metadata?.location || 'Unknown',
        artifacts: [],
        createdAt: new Date(),
        lastModified: new Date(),
        status: 'active',
        tags: []
      }
      projects.push(project)
    }

    // Add the new artifact
    project.artifacts.push(artifact)
    project.lastModified = new Date()

    // Auto-tag based on content
    if (!project.tags.includes(artifact.type)) {
      project.tags.push(artifact.type)
    }

    saveProject(project)
    toast.success(`${artifact.type} added to your projects!`)
  }

  const deleteProject = (projectId: string) => {
    try {
      const updatedProjects = projects.filter(p => p.id !== projectId)
      setProjects(updatedProjects)
      localStorage.setItem(
        `findworkai_user_projects_${userId || 'guest'}`,
        JSON.stringify(updatedProjects)
      )
      toast.success('Project deleted successfully')
    } catch (error) {
      toast.error('Failed to delete project')
    }
  }

  const deleteArtifact = (projectId: string, artifactId: string) => {
    try {
      const project = projects.find(p => p.id === projectId)
      if (project) {
        project.artifacts = project.artifacts.filter(a => a.id !== artifactId)
        project.lastModified = new Date()
        saveProject(project)
        toast.success('Artifact deleted successfully')
      }
    } catch (error) {
      toast.error('Failed to delete artifact')
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.businessCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === 'all' ||
                       project.artifacts.some(a => a.type === filterType)

    const matchesTab = activeTab === 'all' ||
                      (activeTab === 'recent' && Date.now() - project.lastModified.getTime() < 7 * 24 * 60 * 60 * 1000) ||
                      (activeTab === 'starred' && project.opportunityScore && project.opportunityScore > 70)

    return matchesSearch && matchesType && matchesTab
  })

  const getArtifactIcon = (type: string) => {
    switch (type) {
      case 'website': return Globe
      case 'content': return FileText
      case 'marketing': return TrendingUp
      default: return FileText
    }
  }

  const getArtifactTypeColor = (type: string) => {
    switch (type) {
      case 'website': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'content': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'marketing': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
          <p className="text-gray-600">All your generated content in one place</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadUserProjects()}
          >
            <History className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Folder className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{projects.length}</p>
                <p className="text-sm text-gray-600">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Globe className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {projects.reduce((sum, p) => sum + p.artifacts.filter(a => a.type === 'website').length, 0)}
                </p>
                <p className="text-sm text-gray-600">Websites</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {projects.reduce((sum, p) => sum + p.artifacts.filter(a => a.type === 'content').length, 0)}
                </p>
                <p className="text-sm text-gray-600">Content Packs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {projects.reduce((sum, p) => sum + p.artifacts.filter(a => a.type === 'marketing').length, 0)}
                </p>
                <p className="text-sm text-gray-600">Marketing Kits</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Tabs value={filterType} onValueChange={(value) => setFilterType(value as any)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="website">Websites</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="starred">High Opportunity</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Folder className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery ? 'Try adjusting your search' : 'Start generating content to see it here'}
                </p>
                {!searchQuery && (
                  <p className="text-sm text-gray-500">
                    Generated websites and content will automatically appear here
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {project.businessName}
                          </h3>
                          {project.opportunityScore && project.opportunityScore > 70 && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                              <Star className="h-3 w-3 mr-1" />
                              High Opportunity
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">
                          {project.businessCategory} • {project.location}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(project.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Updated {formatDate(project.lastModified)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {project.artifacts.length} items
                          </span>
                        </div>

                        {/* Tags */}
                        {project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedProject(project)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => deleteProject(project.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Artifacts Grid */}
                    {project.artifacts.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {project.artifacts.map((artifact) => {
                          const Icon = getArtifactIcon(artifact.type)
                          return (
                            <div
                              key={artifact.id}
                              className={`border rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer ${getArtifactTypeColor(artifact.type)}`}
                              onClick={() => {
                                setSelectedArtifact(artifact)
                                setShowArtifactViewer(true)
                              }}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  <span className="font-medium text-sm capitalize">{artifact.type}</span>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                      <MoreVertical className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation()
                                      setSelectedArtifact(artifact)
                                      setShowArtifactViewer(true)
                                    }}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation()
                                      // Download functionality
                                      const content = typeof artifact.content === 'string'
                                        ? artifact.content
                                        : JSON.stringify(artifact.content, null, 2)
                                      const blob = new Blob([content], { type: 'text/html' })
                                      const url = URL.createObjectURL(blob)
                                      const a = document.createElement('a')
                                      a.href = url
                                      a.download = `${artifact.name.replace(/\s+/g, '_')}.html`
                                      document.body.appendChild(a)
                                      a.click()
                                      document.body.removeChild(a)
                                      URL.revokeObjectURL(url)
                                      toast.success('Downloaded successfully!')
                                    }}>
                                      <Download className="h-4 w-4 mr-2" />
                                      Download
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        deleteArtifact(project.id, artifact.id)
                                      }}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <div className="text-sm">
                                <p className="font-medium mb-1">{artifact.name}</p>
                                <p className="text-xs opacity-75">
                                  {formatDate(artifact.generatedAt)}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Project Details Dialog */}
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProject.businessName}</DialogTitle>
              <DialogDescription>
                {selectedProject.businessCategory} • {selectedProject.location}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Project Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="font-medium">{formatDate(selectedProject.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Modified</p>
                  <p className="font-medium">{formatDate(selectedProject.lastModified)}</p>
                </div>
              </div>

              {/* Artifacts */}
              <div>
                <h4 className="font-semibold mb-3">Generated Content</h4>
                {selectedProject.artifacts.length === 0 ? (
                  <p className="text-gray-500">No content generated yet</p>
                ) : (
                  <div className="space-y-3">
                    {selectedProject.artifacts.map((artifact) => {
                      const Icon = getArtifactIcon(artifact.type)
                      return (
                        <div
                          key={artifact.id}
                          className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="font-medium">{artifact.name}</p>
                              <p className="text-sm text-gray-600 capitalize">{artifact.type}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedArtifact(artifact)
                                setShowArtifactViewer(true)
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Artifact Viewer */}
      {showArtifactViewer && selectedArtifact && (
        <ArtifactViewer
          artifact={selectedArtifact}
          onClose={() => setShowArtifactViewer(false)}
          onSave={(content) => {
            // Update artifact content
            if (selectedProject) {
              const artifact = selectedProject.artifacts.find(a => a.id === selectedArtifact.id)
              if (artifact) {
                artifact.content = content
                saveProject(selectedProject)
                toast.success('Changes saved!')
              }
            }
          }}
          onDeploy={(artifact) => {
            toast.success('Deployed successfully!')
          }}
          apiKey={process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || ''}
        />
      )}
    </div>
  )
}

// Export hook to use in other components
export const useUserContentHistory = () => {
  const addArtifact = (businessId: string, artifact: GeneratedArtifact) => {
    // This will be called from the AI agent builder to save artifacts
    try {
      const userId = 'current_user' // Get from auth context
      const storedProjects = localStorage.getItem(`findworkai_user_projects_${userId}`)
      let projects = storedProjects ? JSON.parse(storedProjects) : []

      let project = projects.find((p: any) => p.businessId === businessId)

      if (!project) {
        project = {
          id: Date.now().toString(),
          businessId,
          businessName: artifact.metadata?.businessName || 'Unknown Business',
          businessCategory: artifact.metadata?.businessCategory || 'General',
          location: artifact.metadata?.location || 'Unknown',
          artifacts: [],
          createdAt: new Date(),
          lastModified: new Date(),
          status: 'active',
          tags: []
        }
        projects.push(project)
      }

      project.artifacts.push(artifact)
      project.lastModified = new Date()

      if (!project.tags.includes(artifact.type)) {
        project.tags.push(artifact.type)
      }

      localStorage.setItem(`findworkai_user_projects_${userId}`, JSON.stringify(projects))
    } catch (error) {
      console.error('Error saving artifact:', error)
    }
  }

  return { addArtifact }
}