'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Plus, Edit, Trash2, Copy, Eye, EyeOff, Search, Filter,
  Tag, Calendar, TrendingUp, BarChart3, Star, Clock, Check,
  X, Save, Loader2, FileText, Settings, Download
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import toast from 'react-hot-toast'
import apiService from '@/services/api'

interface EmailTemplate {
  id: number
  name: string
  service_type: string
  subject: string
  body: string
  description?: string
  category?: string
  tags?: string[]
  is_active: boolean
  created_at: string
  updated_at?: string
  usage_count?: number
  performance?: {
    total_sent: number
    opens: number
    clicks: number
    open_rate: number
    click_rate: number
  }
}

export default function TemplateManager() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<EmailTemplate[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [serviceTypes, setServiceTypes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all')
  const [showActiveOnly, setShowActiveOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'created_at' | 'name' | 'usage_count'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    service_type: '',
    subject: '',
    body: '',
    description: '',
    category: '',
    tags: [] as string[],
    is_active: true
  })
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterAndSortTemplates()
  }, [templates, searchQuery, selectedCategory, selectedServiceType, showActiveOnly, sortBy, sortOrder])

  const loadData = async () => {
    try {
      setLoading(true)
      const [templatesRes, categoriesRes, serviceTypesRes] = await Promise.all([
        apiService.getTemplates(),
        apiService.getTemplateCategories(),
        apiService.getServiceTypes()
      ])

      setTemplates(templatesRes.templates || [])
      setCategories(categoriesRes.categories || [])
      setServiceTypes(serviceTypesRes.service_types || [])
    } catch (error) {
      toast.error('Failed to load templates')
      console.error('Error loading templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortTemplates = () => {
    let filtered = templates.filter(template => {
      const matchesSearch = !searchQuery ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.body.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
      const matchesServiceType = selectedServiceType === 'all' || template.service_type === selectedServiceType
      const matchesActive = !showActiveOnly || template.is_active

      return matchesSearch && matchesCategory && matchesServiceType && matchesActive
    })

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy]
      let bValue: any = b[sortBy]

      if (sortBy === 'usage_count') {
        aValue = a.usage_count || 0
        bValue = b.usage_count || 0
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredTemplates(filtered)
  }

  const handleCreateTemplate = async () => {
    if (!formData.name || !formData.service_type || !formData.subject || !formData.body) {
      toast.error('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const result = await apiService.createTemplate(formData)
      if (result.success) {
        toast.success('Template created successfully!')
        setShowCreateDialog(false)
        resetForm()
        loadData()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create template')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateTemplate = async () => {
    if (!selectedTemplate) return

    setSaving(true)
    try {
      const result = await apiService.updateTemplate(selectedTemplate.id, formData)
      if (result.success) {
        toast.success('Template updated successfully!')
        setShowEditDialog(false)
        setSelectedTemplate(null)
        resetForm()
        loadData()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update template')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteTemplate = async (template: EmailTemplate) => {
    if (!confirm(`Are you sure you want to delete "${template.name}"?`)) {
      return
    }

    try {
      const result = await apiService.deleteTemplate(template.id)
      if (result.success) {
        toast.success('Template deleted successfully!')
        loadData()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to delete template')
    }
  }

  const handleCloneTemplate = async (template: EmailTemplate) => {
    const newName = prompt('Enter a name for the cloned template:', `${template.name} (Copy)`)
    if (!newName) return

    try {
      const result = await apiService.cloneTemplate(template.id, newName)
      if (result.success) {
        toast.success('Template cloned successfully!')
        loadData()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to clone template')
    }
  }

  const handleToggleActive = async (template: EmailTemplate) => {
    try {
      const result = await apiService.updateTemplate(template.id, {
        is_active: !template.is_active
      })
      if (result.success) {
        toast.success(`Template ${template.is_active ? 'deactivated' : 'activated'} successfully!`)
        loadData()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update template')
    }
  }

  const openEditDialog = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setFormData({
      name: template.name,
      service_type: template.service_type,
      subject: template.subject,
      body: template.body,
      description: template.description || '',
      category: template.category || '',
      tags: template.tags || [],
      is_active: template.is_active
    })
    setShowEditDialog(true)
  }

  const openPreviewDialog = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setShowPreviewDialog(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      service_type: '',
      subject: '',
      body: '',
      description: '',
      category: '',
      tags: [],
      is_active: true
    })
    setTagInput('')
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-2 text-gray-600">Loading templates...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Email Templates</h2>
          <p className="text-gray-600">Manage your email templates for outreach campaigns</p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-xs text-muted-foreground">
              {templates.filter(t => t.is_active).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              Template categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templates.length > 0
                ? (templates.reduce((acc, t) => acc + (t.performance?.open_rate || 0), 0) / templates.length).toFixed(1)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all templates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Uses</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templates.reduce((acc, t) => acc + (t.usage_count || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Emails sent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Service Type Filter */}
            <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Service Types</SelectItem>
                {serviceTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Active Only Toggle */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="active-only"
                checked={showActiveOnly}
                onCheckedChange={(checked) => setShowActiveOnly(checked as boolean)}
              />
              <Label htmlFor="active-only">Active only</Label>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Date Created</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="usage_count">Usage Count</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Templates List */}
      <div className="space-y-4">
        {filteredTemplates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || selectedCategory !== 'all' || selectedServiceType !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first email template to get started'
                }
              </p>
              {!searchQuery && selectedCategory === 'all' && selectedServiceType === 'all' && (
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                        <Badge variant={template.is_active ? "default" : "secondary"}>
                          {template.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        {template.category && (
                          <Badge variant="outline">{template.category}</Badge>
                        )}
                        {template.performance && (
                          <Badge variant="outline" className="text-green-600">
                            {template.performance.open_rate}% open rate
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-medium">Subject:</span>
                          <span className="truncate">{template.subject}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-medium">Service:</span>
                          <Badge variant="outline">{template.service_type}</Badge>
                        </div>

                        {template.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {template.description}
                          </p>
                        )}

                        {template.tags && template.tags.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            {template.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Performance Stats */}
                      {template.performance && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 p-3 bg-gray-50 rounded-lg">
                          <div className="text-center">
                            <p className="text-xs text-gray-600">Sent</p>
                            <p className="font-semibold">{template.performance.total_sent}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-600">Opens</p>
                            <p className="font-semibold">{template.performance.opens}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-600">Open Rate</p>
                            <p className="font-semibold text-green-600">{template.performance.open_rate}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-600">Click Rate</p>
                            <p className="font-semibold text-blue-600">{template.performance.click_rate}%</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Created {new Date(template.created_at).toLocaleDateString()}</span>
                        </div>
                        {template.usage_count !== undefined && (
                          <div className="flex items-center gap-1">
                            <BarChart3 className="h-4 w-4" />
                            <span>{template.usage_count} uses</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openPreviewDialog(template)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditDialog(template)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCloneTemplate(template)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleActive(template)}
                      >
                        {template.is_active ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteTemplate(template)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Template Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Email Template</DialogTitle>
            <DialogDescription>
              Create a new email template for your outreach campaigns
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Website Design Outreach"
                />
              </div>
              <div>
                <Label htmlFor="service_type">Service Type *</Label>
                <Select
                  value={formData.service_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, service_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website_development">Website Development</SelectItem>
                    <SelectItem value="seo_optimization">SEO Optimization</SelectItem>
                    <SelectItem value="social_media_marketing">Social Media Marketing</SelectItem>
                    <SelectItem value="ppc_advertising">PPC Advertising</SelectItem>
                    <SelectItem value="content_marketing">Content Marketing</SelectItem>
                    <SelectItem value="email_marketing">Email Marketing</SelectItem>
                    <SelectItem value="branding">Branding</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="subject">Email Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Enter email subject line"
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="e.g., Outreach, Follow-up, Newsletter"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this template's purpose"
                rows={2}
              />
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1"
                />
                <Button type="button" onClick={addTag}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    #{tag} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="body">Email Body *</Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                placeholder="Write your email content here..."
                rows={10}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked as boolean }))}
              />
              <Label htmlFor="is_active">Template is active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Template
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Email Template</DialogTitle>
            <DialogDescription>
              Update your email template
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Same form fields as create dialog */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Template Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-service_type">Service Type *</Label>
                <Select
                  value={formData.service_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, service_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website_development">Website Development</SelectItem>
                    <SelectItem value="seo_optimization">SEO Optimization</SelectItem>
                    <SelectItem value="social_media_marketing">Social Media Marketing</SelectItem>
                    <SelectItem value="ppc_advertising">PPC Advertising</SelectItem>
                    <SelectItem value="content_marketing">Content Marketing</SelectItem>
                    <SelectItem value="email_marketing">Email Marketing</SelectItem>
                    <SelectItem value="branding">Branding</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-subject">Email Subject *</Label>
              <Input
                id="edit-subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="edit-body">Email Body *</Label>
              <Textarea
                id="edit-body"
                value={formData.body}
                onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                rows={10}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTemplate} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Template
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Template Preview: {selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              Preview how this template will appear to recipients
            </DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <p className="text-sm font-medium text-gray-700 mb-2">Subject:</p>
                <p className="font-semibold">{selectedTemplate.subject}</p>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Email Body:</p>
                <div className="whitespace-pre-wrap bg-white border rounded p-4">
                  {selectedTemplate.body}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Service Type: <Badge>{selectedTemplate.service_type}</Badge></span>
                {selectedTemplate.category && (
                  <span>Category: <Badge variant="outline">{selectedTemplate.category}</Badge></span>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              if (selectedTemplate) {
                openEditDialog(selectedTemplate)
                setShowPreviewDialog(false)
              }
            }}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}