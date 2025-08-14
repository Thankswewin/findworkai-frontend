'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Send, Sparkles, Copy, Edit, Save, X, Check,
  RefreshCw, Users, Target, Zap, Clock, ChevronRight,
  FileText, Settings, Loader2, AlertCircle, TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import toast from 'react-hot-toast'
import apiService from '@/services/api'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  tone: string
  service_type: string
  performance?: {
    open_rate: number
    reply_rate: number
    uses: number
  }
}

interface GeneratedEmail {
  subject: string
  body: string
  tone: string
  personalization_score: number
  estimated_open_rate: number
}

export function EmailOutreach() {
  const [selectedBusinesses, setSelectedBusinesses] = useState<any[]>([])
  const [businesses, setBusinesses] = useState<any[]>([])
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('none')
  const [serviceType, setServiceType] = useState('website_development')
  const [tone, setTone] = useState('professional')
  const [generatedEmails, setGeneratedEmails] = useState<Map<string, GeneratedEmail>>(new Map())
  const [editingEmail, setEditingEmail] = useState<string | null>(null)
  const [customSubject, setCustomSubject] = useState('')
  const [customBody, setCustomBody] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewEmail, setPreviewEmail] = useState<any>(null)
  const [batchProgress, setBatchProgress] = useState(0)
  const [stats, setStats] = useState({
    totalGenerated: 0,
    totalSent: 0,
    avgOpenRate: 0,
    avgReplyRate: 0
  })

  const serviceTypes = [
    { value: 'website_development', label: 'Website Development' },
    { value: 'seo_optimization', label: 'SEO Optimization' },
    { value: 'social_media_marketing', label: 'Social Media Marketing' },
    { value: 'ppc_advertising', label: 'PPC Advertising' },
    { value: 'content_marketing', label: 'Content Marketing' },
    { value: 'email_marketing', label: 'Email Marketing' },
    { value: 'branding', label: 'Branding & Design' },
    { value: 'consulting', label: 'Digital Consulting' }
  ]

  const toneOptions = [
    { value: 'professional', label: 'Professional', icon: '💼' },
    { value: 'friendly', label: 'Friendly', icon: '😊' },
    { value: 'casual', label: 'Casual', icon: '👋' },
    { value: 'formal', label: 'Formal', icon: '🎩' },
    { value: 'enthusiastic', label: 'Enthusiastic', icon: '🚀' },
    { value: 'consultative', label: 'Consultative', icon: '🤝' }
  ]

  useEffect(() => {
    loadBusinesses()
    loadTemplates()
    loadStats()
  }, [])

  const loadBusinesses = async () => {
    try {
      const data = await apiService.getBusinesses({ limit: 100 })
      setBusinesses(data)
    } catch (error) {
      console.error('Failed to load businesses:', error)
    }
  }

  const loadTemplates = async () => {
    try {
      const data = await apiService.getEmailTemplates()
      // Ensure data is an array before setting
      if (Array.isArray(data)) {
        setTemplates(data)
      } else {
        console.warn('Templates response is not an array:', data)
        setTemplates([])
      }
    } catch (error) {
      console.error('Failed to load templates:', error)
      // Keep templates as empty array on error
      setTemplates([])
    }
  }

  const loadStats = () => {
    // Simulate stats - in production, this would come from the API
    setStats({
      totalGenerated: 156,
      totalSent: 89,
      avgOpenRate: 42.3,
      avgReplyRate: 8.7
    })
  }

  const handleSelectBusiness = (business: any) => {
    const isSelected = selectedBusinesses.find(b => b.id === business.id)
    if (isSelected) {
      setSelectedBusinesses(selectedBusinesses.filter(b => b.id !== business.id))
    } else {
      setSelectedBusinesses([...selectedBusinesses, business])
    }
  }

  const handleGenerateEmails = async () => {
    if (selectedBusinesses.length === 0) {
      toast.error('Please select at least one business')
      return
    }

    setIsGenerating(true)
    setBatchProgress(0)
    const newEmails = new Map(generatedEmails)

    try {
      if (selectedBusinesses.length === 1) {
        // Single email generation
        const business = selectedBusinesses[0]
        const response = await apiService.generateEmail(business.id, serviceType, tone)
        
        newEmails.set(business.id, {
          subject: response.subject,
          body: response.body,
          tone: response.tone,
          personalization_score: response.personalization_score || 85,
          estimated_open_rate: response.estimated_open_rate || 45
        })
        
        toast.success('Email generated successfully!')
      } else {
        // Batch generation
        const businessIds = selectedBusinesses.map(b => b.id)
        const response = await apiService.batchGenerateEmails(businessIds, serviceType, tone)
        
        response.emails.forEach((email: any) => {
          newEmails.set(email.business_id, {
            subject: email.subject,
            body: email.body,
            tone: email.tone,
            personalization_score: email.personalization_score || 85,
            estimated_open_rate: email.estimated_open_rate || 45
          })
          setBatchProgress((prev) => prev + (100 / selectedBusinesses.length))
        })
        
        toast.success(`Generated ${response.emails.length} emails!`)
      }
      
      setGeneratedEmails(newEmails)
      setStats(prev => ({ ...prev, totalGenerated: prev.totalGenerated + selectedBusinesses.length }))
    } catch (error) {
      toast.error('Failed to generate emails')
      console.error('Generation error:', error)
    } finally {
      setIsGenerating(false)
      setBatchProgress(0)
    }
  }

  const handleEditEmail = (businessId: string) => {
    const email = generatedEmails.get(businessId)
    if (email) {
      setEditingEmail(businessId)
      setCustomSubject(email.subject)
      setCustomBody(email.body)
    }
  }

  const handleSaveEdit = () => {
    if (editingEmail) {
      const newEmails = new Map(generatedEmails)
      const email = newEmails.get(editingEmail)
      if (email) {
        email.subject = customSubject
        email.body = customBody
        setGeneratedEmails(newEmails)
        toast.success('Email updated!')
      }
      setEditingEmail(null)
    }
  }

  const handlePreviewEmail = (businessId: string) => {
    const business = businesses.find(b => b.id === businessId)
    const email = generatedEmails.get(businessId)
    if (business && email) {
      setPreviewEmail({ business, email })
      setShowPreview(true)
    }
  }

  const handleSendEmails = async () => {
    if (generatedEmails.size === 0) {
      toast.error('No emails to send. Generate emails first.')
      return
    }

    setIsSending(true)
    
    try {
      // In production, this would actually send emails
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setStats(prev => ({ ...prev, totalSent: prev.totalSent + generatedEmails.size }))
      toast.success(`Successfully sent ${generatedEmails.size} emails!`)
      
      // Clear sent emails
      setGeneratedEmails(new Map())
      setSelectedBusinesses([])
    } catch (error) {
      toast.error('Failed to send emails')
    } finally {
      setIsSending(false)
    }
  }

  const handleCopyEmail = (email: GeneratedEmail) => {
    const fullEmail = `Subject: ${email.subject}\n\n${email.body}`
    navigator.clipboard.writeText(fullEmail)
    toast.success('Email copied to clipboard!')
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Generated</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGenerated}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSent}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Open Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgOpenRate}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Reply Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgReplyRate}%</div>
            <p className="text-xs text-muted-foreground">
              +1.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generate Emails</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Set up your email generation preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Service Type</Label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <span className="flex items-center gap-2">
                            <span>{option.icon}</span>
                            <span>{option.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Template (Optional)</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="No template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No template</SelectItem>
                      {Array.isArray(templates) && templates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Recipients</CardTitle>
              <CardDescription>
                Choose businesses to generate emails for ({selectedBusinesses.length} selected)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {businesses.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No businesses found. Search for businesses first.
                    </AlertDescription>
                  </Alert>
                ) : (
                  businesses.slice(0, 10).map(business => (
                    <div
                      key={business.id}
                      className={`
                        flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors
                        ${selectedBusinesses.find(b => b.id === business.id) 
                          ? 'bg-primary/10 border-primary' 
                          : 'hover:bg-accent'
                        }
                      `}
                      onClick={() => handleSelectBusiness(business)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`
                          h-4 w-4 rounded border-2 flex items-center justify-center
                          ${selectedBusinesses.find(b => b.id === business.id) 
                            ? 'bg-primary border-primary' 
                            : 'border-muted-foreground'
                          }
                        `}>
                          {selectedBusinesses.find(b => b.id === business.id) && (
                            <Check className="h-3 w-3 text-primary-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{business.name}</p>
                          <p className="text-sm text-muted-foreground">{business.city}, {business.state}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{business.business_category}</Badge>
                        {generatedEmails.has(business.id) && (
                          <Badge variant="secondary">
                            <Mail className="mr-1 h-3 w-3" />
                            Generated
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setSelectedBusinesses(businesses.slice(0, 10))}
                disabled={businesses.length === 0}
              >
                Select All
              </Button>
              <Button
                onClick={handleGenerateEmails}
                disabled={selectedBusinesses.length === 0 || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Emails
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Progress Bar */}
          {isGenerating && batchProgress > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Generating emails...</span>
                    <span>{Math.round(batchProgress)}%</span>
                  </div>
                  <Progress value={batchProgress} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generated Emails */}
          {generatedEmails.size > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Emails</CardTitle>
                <CardDescription>
                  Review and edit your generated emails before sending
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from(generatedEmails.entries()).map(([businessId, email]) => {
                  const business = businesses.find(b => b.id === businessId)
                  if (!business) return null

                  return (
                    <motion.div
                      key={businessId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{business.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Personalization: {email.personalization_score}% | 
                            Est. Open Rate: {email.estimated_open_rate}%
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handlePreviewEmail(businessId)}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditEmail(businessId)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyEmail(email)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {editingEmail === businessId ? (
                        <div className="space-y-3">
                          <Input
                            value={customSubject}
                            onChange={(e) => setCustomSubject(e.target.value)}
                            placeholder="Email subject"
                          />
                          <Textarea
                            value={customBody}
                            onChange={(e) => setCustomBody(e.target.value)}
                            rows={6}
                            placeholder="Email body"
                          />
                          <div className="flex justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingEmail(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                            >
                              <Save className="mr-2 h-4 w-4" />
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Subject: {email.subject}</p>
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {email.body}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setGeneratedEmails(new Map())
                    setSelectedBusinesses([])
                  }}
                >
                  Clear All
                </Button>
                <Button
                  onClick={handleSendEmails}
                  disabled={isSending}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send All Emails
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Pre-built templates for different scenarios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {templates.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No templates available. Create your first template.
                  </AlertDescription>
                </Alert>
              ) : (
                templates.map(template => (
                  <div key={template.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{template.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {template.service_type} | {template.tone}
                        </p>
                      </div>
                      {template.performance && (
                        <div className="flex items-center space-x-4 text-sm">
                          <span>Open: {template.performance.open_rate}%</span>
                          <span>Reply: {template.performance.reply_rate}%</span>
                          <Badge>{template.performance.uses} uses</Badge>
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium">Subject: {template.subject}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{template.body}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email History</CardTitle>
              <CardDescription>
                Track your sent emails and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  Email history will appear here once you start sending emails.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Email Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Email Preview</DialogTitle>
            <DialogDescription>
              Preview how your email will appear to {previewEmail?.business.name}
            </DialogDescription>
          </DialogHeader>
          {previewEmail && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground">To: {previewEmail.business.email || 'contact@example.com'}</p>
                <p className="text-sm text-muted-foreground">From: you@yourcompany.com</p>
                <p className="text-sm font-medium mt-2">Subject: {previewEmail.email.subject}</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="whitespace-pre-wrap">{previewEmail.email.body}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            <Button onClick={() => {
              handleCopyEmail(previewEmail.email)
              setShowPreview(false)
            }}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
