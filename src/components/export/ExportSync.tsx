'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FileDown, Upload, RefreshCw, Check, X, Loader2,
  Database, Cloud, Link2, Settings, AlertCircle,
  FileSpreadsheet, FileJson, FileText, Users,
  Calendar, TrendingUp, Filter, Download
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import toast from 'react-hot-toast'
import apiService from '@/services/api'

interface ExportFilter {
  category?: string
  location?: string
  minScore?: number
  hasWebsite?: boolean
  dateRange?: {
    start: string
    end: string
  }
}

interface CRMIntegration {
  type: string
  name: string
  icon: string
  connected: boolean
  lastSync?: string
  recordsSynced?: number
}

export function ExportSync() {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'excel'>('csv')
  const [exportType, setExportType] = useState('leads')
  const [filters, setFilters] = useState<ExportFilter>({})
  const [isExporting, setIsExporting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [businesses, setBusinesses] = useState<any[]>([])
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [showIntegrationDialog, setShowIntegrationDialog] = useState(false)
  const [selectedCRM, setSelectedCRM] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [integrations, setIntegrations] = useState<CRMIntegration[]>([
    {
      type: 'hubspot',
      name: 'HubSpot',
      icon: '🟠',
      connected: false
    },
    {
      type: 'salesforce',
      name: 'Salesforce',
      icon: '☁️',
      connected: false
    },
    {
      type: 'pipedrive',
      name: 'Pipedrive',
      icon: '🔵',
      connected: false
    },
    {
      type: 'zoho',
      name: 'Zoho CRM',
      icon: '🟡',
      connected: false
    },
    {
      type: 'monday',
      name: 'Monday.com',
      icon: '🟣',
      connected: false
    }
  ])
  const [exportHistory, setExportHistory] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalExports: 0,
    totalSynced: 0,
    lastExport: null as Date | null,
    lastSync: null as Date | null
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load businesses
      const businessData = await apiService.getBusinesses({ limit: 100 })
      setBusinesses(businessData)
      
      // Load campaigns
      const campaignData = await apiService.getCampaigns()
      setCampaigns(campaignData)
      
      // Load export history from localStorage
      const history = localStorage.getItem('export_history')
      if (history) {
        setExportHistory(JSON.parse(history))
      }
      
      // Load integration status
      const savedIntegrations = localStorage.getItem('crm_integrations')
      if (savedIntegrations) {
        setIntegrations(JSON.parse(savedIntegrations))
      }
      
      // Calculate stats
      updateStats()
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const updateStats = () => {
    const history = JSON.parse(localStorage.getItem('export_history') || '[]')
    const syncs = JSON.parse(localStorage.getItem('sync_history') || '[]')
    
    setStats({
      totalExports: history.length,
      totalSynced: syncs.reduce((acc: number, s: any) => acc + s.count, 0),
      lastExport: history.length > 0 ? new Date(history[0].date) : null,
      lastSync: syncs.length > 0 ? new Date(syncs[0].date) : null
    })
  }

  const handleExport = async () => {
    setIsExporting(true)
    setExportProgress(0)
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => Math.min(prev + 10, 90))
      }, 200)
      
      let data
      if (exportType === 'leads') {
        data = await apiService.exportLeads(exportFormat, {
          ...filters,
          business_ids: selectedLeads.length > 0 ? selectedLeads : undefined
        })
      } else if (exportType === 'campaigns') {
        data = await apiService.exportCampaigns()
      }
      
      clearInterval(progressInterval)
      setExportProgress(100)
      
      // Save to history
      const historyEntry = {
        id: Date.now().toString(),
        type: exportType,
        format: exportFormat,
        count: selectedLeads.length || businesses.length,
        date: new Date().toISOString(),
        filters
      }
      
      const history = JSON.parse(localStorage.getItem('export_history') || '[]')
      history.unshift(historyEntry)
      localStorage.setItem('export_history', JSON.stringify(history.slice(0, 20)))
      setExportHistory(history.slice(0, 20))
      
      updateStats()
      toast.success(`Successfully exported ${exportType} as ${exportFormat.toUpperCase()}`)
    } catch (error) {
      toast.error('Export failed. Please try again.')
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }

  const handleCRMConnect = async () => {
    if (!selectedCRM || !apiKey) {
      toast.error('Please select a CRM and enter your API key')
      return
    }
    
    try {
      await apiService.setupCRMIntegration(selectedCRM, apiKey)
      
      // Update integration status
      const updatedIntegrations = integrations.map(int => 
        int.type === selectedCRM 
          ? { ...int, connected: true, lastSync: new Date().toISOString() }
          : int
      )
      setIntegrations(updatedIntegrations)
      localStorage.setItem('crm_integrations', JSON.stringify(updatedIntegrations))
      
      toast.success(`Successfully connected to ${selectedCRM}`)
      setShowIntegrationDialog(false)
      setApiKey('')
    } catch (error) {
      toast.error('Failed to connect CRM. Please check your API key.')
    }
  }

  const handleSync = async (crmType: string) => {
    setIsSyncing(true)
    
    try {
      if (selectedLeads.length > 0) {
        await apiService.bulkSyncToCRM(selectedLeads, crmType)
      } else {
        // Sync all
        const allBusinessIds = businesses.map(b => b.id)
        await apiService.bulkSyncToCRM(allBusinessIds, crmType)
      }
      
      // Update sync history
      const syncHistory = JSON.parse(localStorage.getItem('sync_history') || '[]')
      syncHistory.unshift({
        id: Date.now().toString(),
        crm: crmType,
        count: selectedLeads.length || businesses.length,
        date: new Date().toISOString()
      })
      localStorage.setItem('sync_history', JSON.stringify(syncHistory.slice(0, 20)))
      
      // Update integration last sync
      const updatedIntegrations = integrations.map(int => 
        int.type === crmType 
          ? { 
              ...int, 
              lastSync: new Date().toISOString(),
              recordsSynced: (int.recordsSynced || 0) + (selectedLeads.length || businesses.length)
            }
          : int
      )
      setIntegrations(updatedIntegrations)
      localStorage.setItem('crm_integrations', JSON.stringify(updatedIntegrations))
      
      updateStats()
      toast.success(`Successfully synced ${selectedLeads.length || businesses.length} records to ${crmType}`)
    } catch (error) {
      toast.error('Sync failed. Please try again.')
      console.error('Sync error:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  const handleSelectLead = (leadId: string) => {
    if (selectedLeads.includes(leadId)) {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId))
    } else {
      setSelectedLeads([...selectedLeads, leadId])
    }
  }

  const formatOptions = [
    { value: 'csv', label: 'CSV', icon: FileSpreadsheet, description: 'Comma-separated values' },
    { value: 'json', label: 'JSON', icon: FileJson, description: 'JavaScript Object Notation' },
    { value: 'excel', label: 'Excel', icon: FileText, description: 'Microsoft Excel format' }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exports</CardTitle>
            <FileDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExports}</div>
            <p className="text-xs text-muted-foreground">
              {stats.lastExport ? `Last: ${stats.lastExport.toLocaleDateString()}` : 'No exports yet'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Records Synced</CardTitle>
            <Cloud className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSynced}</div>
            <p className="text-xs text-muted-foreground">
              {stats.lastSync ? `Last: ${stats.lastSync.toLocaleDateString()}` : 'No syncs yet'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected CRMs</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.filter(i => i.connected).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {integrations.length} available
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selected Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedLeads.length}</div>
            <p className="text-xs text-muted-foreground">
              {businesses.length} total available
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="export" className="space-y-4">
        <TabsList>
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="integrations">CRM Integrations</TabsTrigger>
          <TabsTrigger value="history">Export History</TabsTrigger>
        </TabsList>

        <TabsContent value="export" className="space-y-4">
          {/* Export Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Export Configuration</CardTitle>
              <CardDescription>
                Choose what data to export and in which format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Export Type</Label>
                  <Select value={exportType} onValueChange={setExportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leads">Leads/Businesses</SelectItem>
                      <SelectItem value="campaigns">Campaigns</SelectItem>
                      <SelectItem value="analytics">Analytics Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Format</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {formatOptions.map(format => {
                      const Icon = format.icon
                      return (
                        <button
                          key={format.value}
                          onClick={() => setExportFormat(format.value as any)}
                          className={`
                            flex flex-col items-center justify-center p-3 rounded-lg border transition-colors
                            ${exportFormat === format.value 
                              ? 'bg-primary text-primary-foreground border-primary' 
                              : 'hover:bg-accent'
                            }
                          `}
                        >
                          <Icon className="h-5 w-5 mb-1" />
                          <span className="text-xs font-medium">{format.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {exportType === 'leads' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Filters (Optional)</Label>
                    <div className="grid gap-2 md:grid-cols-3">
                      <Input
                        placeholder="Category"
                        value={filters.category || ''}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                      />
                      <Input
                        placeholder="Location"
                        value={filters.location || ''}
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      />
                      <Input
                        type="number"
                        placeholder="Min Score"
                        value={filters.minScore || ''}
                        onChange={(e) => setFilters({ ...filters, minScore: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters.hasWebsite === true}
                      onCheckedChange={(checked) => 
                        setFilters({ ...filters, hasWebsite: checked ? true : undefined })
                      }
                    />
                    <Label>Only businesses without websites</Label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lead Selection */}
          {exportType === 'leads' && (
            <Card>
              <CardHeader>
                <CardTitle>Select Leads to Export</CardTitle>
                <CardDescription>
                  Choose specific leads or export all ({selectedLeads.length} selected)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {businesses.slice(0, 10).map(business => (
                    <div
                      key={business.id}
                      className={`
                        flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors
                        ${selectedLeads.includes(business.id) 
                          ? 'bg-primary/10 border-primary' 
                          : 'hover:bg-accent'
                        }
                      `}
                      onClick={() => handleSelectLead(business.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={selectedLeads.includes(business.id)}
                          onCheckedChange={() => handleSelectLead(business.id)}
                        />
                        <div>
                          <p className="font-medium">{business.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {business.city}, {business.state} | Score: {business.opportunity_score || 0}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{business.business_category}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setSelectedLeads(businesses.map(b => b.id))}
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedLeads([])}
                >
                  Clear Selection
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Export Progress */}
          {isExporting && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Exporting {exportType}...</span>
                    <span>{exportProgress}%</span>
                  </div>
                  <Progress value={exportProgress} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Export Button */}
          <div className="flex justify-end">
            <Button
              size="lg"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export {exportType === 'leads' && selectedLeads.length > 0 
                    ? `${selectedLeads.length} Leads` 
                    : 'All Data'}
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CRM Integrations</CardTitle>
              <CardDescription>
                Connect and sync with your favorite CRM platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.map(integration => (
                <div
                  key={integration.type}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{integration.icon}</span>
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {integration.connected 
                          ? `Last sync: ${integration.lastSync ? new Date(integration.lastSync).toLocaleDateString() : 'Never'}`
                          : 'Not connected'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {integration.connected ? (
                      <>
                        <Badge variant="secondary">
                          {integration.recordsSynced || 0} synced
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSync(integration.type)}
                          disabled={isSyncing}
                        >
                          {isSyncing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const updated = integrations.map(i => 
                              i.type === integration.type ? { ...i, connected: false } : i
                            )
                            setIntegrations(updated)
                            localStorage.setItem('crm_integrations', JSON.stringify(updated))
                            toast.success(`Disconnected from ${integration.name}`)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedCRM(integration.type)
                          setShowIntegrationDialog(true)
                        }}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Sync */}
          {integrations.some(i => i.connected) && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Sync</CardTitle>
                <CardDescription>
                  Sync selected leads to connected CRMs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {integrations.filter(i => i.connected).map(integration => (
                    <Button
                      key={integration.type}
                      variant="outline"
                      onClick={() => handleSync(integration.type)}
                      disabled={isSyncing}
                    >
                      <span className="mr-2">{integration.icon}</span>
                      Sync to {integration.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export History</CardTitle>
              <CardDescription>
                Recent exports and downloads
              </CardDescription>
            </CardHeader>
            <CardContent>
              {exportHistory.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No export history yet. Start by exporting some data.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {exportHistory.map(entry => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FileDown className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {entry.type} Export ({entry.format.toUpperCase()})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {entry.count} records • {new Date(entry.date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Integration Dialog */}
      <Dialog open={showIntegrationDialog} onOpenChange={setShowIntegrationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect CRM</DialogTitle>
            <DialogDescription>
              Enter your API key to connect {integrations.find(i => i.type === selectedCRM)?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your API key will be securely stored and used only for syncing data.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowIntegrationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCRMConnect}>
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
