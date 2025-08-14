'use client'

import React, { useState } from 'react'
import { Zap, Check, X, Mail, Target, FileDown, Upload, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import toast from 'react-hot-toast'

interface Lead {
  id: string
  name: string
  category: string
  city: string
  rating: number
  hasWebsite: boolean
  status: 'new' | 'contacted' | 'interested' | 'closed'
}

export default function BulkOperationsPage() {
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const sampleLeads: Lead[] = [
    { id: '1', name: 'Downtown Pizza Palace', category: 'Restaurant', city: 'San Francisco', rating: 3.2, hasWebsite: false, status: 'new' },
    { id: '2', name: 'Bay Area Auto Repair', category: 'Auto Service', city: 'Oakland', rating: 4.1, hasWebsite: true, status: 'new' },
    { id: '3', name: 'Sunset Dental Care', category: 'Healthcare', city: 'San Francisco', rating: 2.8, hasWebsite: false, status: 'contacted' },
    { id: '4', name: 'Tech Solutions Inc', category: 'Technology', city: 'Palo Alto', rating: 4.5, hasWebsite: true, status: 'interested' },
    { id: '5', name: 'Green Thumb Landscaping', category: 'Home Services', city: 'San Jose', rating: 3.9, hasWebsite: false, status: 'new' },
  ]

  const bulkActions = [
    { value: 'analyze', label: 'Run AI Analysis', icon: Target },
    { value: 'generate-emails', label: 'Generate Emails', icon: Mail },
    { value: 'export', label: 'Export to CSV', icon: FileDown },
    { value: 'mark-contacted', label: 'Mark as Contacted', icon: Check },
    { value: 'mark-interested', label: 'Mark as Interested', icon: Check },
    { value: 'delete', label: 'Delete Selected', icon: X },
  ]

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(sampleLeads.map(lead => lead.id))
    } else {
      setSelectedLeads([])
    }
  }

  const handleSelectLead = (leadId: string, checked: boolean) => {
    if (checked) {
      setSelectedLeads([...selectedLeads, leadId])
    } else {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId))
    }
  }

  const executeBulkAction = async () => {
    if (!bulkAction || selectedLeads.length === 0) {
      toast.error('Please select leads and an action')
      return
    }

    setIsProcessing(true)
    setProgress(0)

    // Simulate processing
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setProgress(i)
    }

    setIsProcessing(false)
    setProgress(0)

    const action = bulkActions.find(a => a.value === bulkAction)
    toast.success(`${action?.label} completed for ${selectedLeads.length} leads!`)

    // Clear selection after action
    setSelectedLeads([])
    setBulkAction('')
  }

  const getStatusBadge = (status: Lead['status']) => {
    const variants = {
      new: 'default',
      contacted: 'secondary',
      interested: 'default',
      closed: 'outline'
    } as const

    const colors = {
      new: 'bg-blue-500',
      contacted: 'bg-yellow-500',
      interested: 'bg-green-500',
      closed: 'bg-gray-500'
    }

    return (
      <Badge variant={variants[status]} className={`${colors[status]} text-white`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bulk Operations</h2>
        <p className="text-muted-foreground">
          Perform actions on multiple leads simultaneously to save time
        </p>
      </div>

      {/* Action Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Bulk Actions</span>
          </CardTitle>
          <CardDescription>
            Select leads and choose an action to apply to all selected items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Selected:</span>
              <Badge variant="secondary">{selectedLeads.length} leads</Badge>
            </div>
            
            <Select value={bulkAction} onValueChange={setBulkAction}>
              <SelectTrigger className="w-60">
                <SelectValue placeholder="Choose bulk action..." />
              </SelectTrigger>
              <SelectContent>
                {bulkActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <SelectItem key={action.value} value={action.value}>
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span>{action.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>

            <Button 
              onClick={executeBulkAction}
              disabled={selectedLeads.length === 0 || !bulkAction || isProcessing}
              className="flex items-center space-x-2"
            >
              <Zap className="h-4 w-4" />
              <span>Execute Action</span>
            </Button>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Processing {selectedLeads.length} leads...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:border-primary transition-colors">
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto text-primary mb-2" />
            <p className="text-sm font-medium">Bulk Analysis</p>
            <p className="text-xs text-muted-foreground">Analyze all leads with AI</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:border-primary transition-colors">
          <CardContent className="p-4 text-center">
            <Mail className="h-8 w-8 mx-auto text-primary mb-2" />
            <p className="text-sm font-medium">Generate Emails</p>
            <p className="text-xs text-muted-foreground">Create personalized emails</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:border-primary transition-colors">
          <CardContent className="p-4 text-center">
            <Upload className="h-8 w-8 mx-auto text-primary mb-2" />
            <p className="text-sm font-medium">Import Leads</p>
            <p className="text-xs text-muted-foreground">Upload CSV or Excel file</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:border-primary transition-colors">
          <CardContent className="p-4 text-center">
            <FileDown className="h-8 w-8 mx-auto text-primary mb-2" />
            <p className="text-sm font-medium">Export Data</p>
            <p className="text-xs text-muted-foreground">Download filtered results</p>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lead Management</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedLeads.length} of {sampleLeads.length} selected
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Header with Select All */}
            <div className="flex items-center space-x-4 p-3 border rounded-lg bg-muted/50">
              <Checkbox
                checked={selectedLeads.length === sampleLeads.length}
                onCheckedChange={handleSelectAll}
              />
              <div className="grid grid-cols-5 gap-4 flex-1 text-sm font-medium">
                <span>Business Name</span>
                <span>Category</span>
                <span>Location</span>
                <span>Rating</span>
                <span>Status</span>
              </div>
            </div>

            {/* Lead Rows */}
            {sampleLeads.map((lead) => (
              <div 
                key={lead.id} 
                className={`flex items-center space-x-4 p-3 border rounded-lg transition-colors ${
                  selectedLeads.includes(lead.id) ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'
                }`}
              >
                <Checkbox
                  checked={selectedLeads.includes(lead.id)}
                  onCheckedChange={(checked) => handleSelectLead(lead.id, checked as boolean)}
                />
                <div className="grid grid-cols-5 gap-4 flex-1 text-sm">
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    {!lead.hasWebsite && (
                      <Badge variant="destructive" className="mt-1 text-xs">No Website</Badge>
                    )}
                  </div>
                  <span className="text-muted-foreground">{lead.category}</span>
                  <span className="text-muted-foreground">{lead.city}</span>
                  <div className="flex items-center space-x-1">
                    <span>{lead.rating}</span>
                    <span className="text-yellow-500">⭐</span>
                  </div>
                  {getStatusBadge(lead.status)}
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {sampleLeads.length} leads</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <FileDown className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
