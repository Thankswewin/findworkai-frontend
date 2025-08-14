'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Check,
  X,
  Link,
  Unlink,
  Settings,
  Key,
  Building2,
  Users,
  Briefcase,
  RefreshCw,
  Upload,
  Download,
  AlertCircle,
  CheckCircle,
  Info,
  ExternalLink,
  ArrowRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { hubspotService } from '@/services/hubspot'
import toast from 'react-hot-toast'

interface HubSpotSettingsProps {
  onSyncBusinesses?: (businesses: any[]) => void
  analyzedBusinesses?: any[]
}

export function HubSpotSettings({ onSyncBusinesses, analyzedBusinesses = [] }: HubSpotSettingsProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [accessToken, setAccessToken] = useState('')
  const [portalId, setPortalId] = useState('')
  const [showTokenInput, setShowTokenInput] = useState(false)
  const [hubspotStats, setHubspotStats] = useState({
    contacts: 0,
    companies: 0,
    deals: 0,
    lastSync: null as Date | null
  })
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)

  // Load HubSpot configuration on mount
  useEffect(() => {
    const connected = hubspotService.loadConfig()
    setIsConnected(connected)
    
    if (connected) {
      testConnection()
      fetchHubSpotStats()
    }
  }, [])

  // Test HubSpot connection
  const testConnection = async () => {
    const isValid = await hubspotService.testConnection()
    setIsConnected(isValid)
    
    if (!isValid) {
      toast.error('HubSpot connection expired. Please reconnect.')
      hubspotService.disconnect()
    }
  }

  // Fetch HubSpot statistics
  const fetchHubSpotStats = async () => {
    try {
      const [contacts, companies, deals] = await Promise.all([
        hubspotService.getContacts(1).then(() => hubspotService.getContacts(100)),
        hubspotService.getCompanies(1).then(() => hubspotService.getCompanies(100)),
        hubspotService.getDeals(1).then(() => hubspotService.getDeals(100))
      ])
      
      setHubspotStats({
        contacts: contacts.length,
        companies: companies.length,
        deals: deals.length,
        lastSync: new Date()
      })
    } catch (error) {
      console.error('Failed to fetch HubSpot stats:', error)
    }
  }

  // Connect to HubSpot
  const handleConnect = async () => {
    if (!accessToken) {
      toast.error('Please enter your HubSpot access token')
      return
    }
    
    setIsConnecting(true)
    
    try {
      hubspotService.initialize(accessToken, portalId)
      const isValid = await hubspotService.testConnection()
      
      if (isValid) {
        setIsConnected(true)
        setShowTokenInput(false)
        setAccessToken('')
        toast.success('Successfully connected to HubSpot!')
        await fetchHubSpotStats()
      } else {
        toast.error('Invalid access token. Please check and try again.')
        hubspotService.disconnect()
      }
    } catch (error: any) {
      toast.error(`Connection failed: ${error.message}`)
      hubspotService.disconnect()
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect from HubSpot
  const handleDisconnect = () => {
    hubspotService.disconnect()
    setIsConnected(false)
    setHubspotStats({
      contacts: 0,
      companies: 0,
      deals: 0,
      lastSync: null
    })
  }

  // Sync single business
  const syncBusiness = async (business: any) => {
    try {
      await hubspotService.syncAnalyzedBusiness(business)
      await fetchHubSpotStats()
    } catch (error: any) {
      toast.error(`Failed to sync ${business.name}`)
    }
  }

  // Batch sync all businesses
  const syncAllBusinesses = async () => {
    if (analyzedBusinesses.length === 0) {
      toast.error('No businesses to sync')
      return
    }
    
    setIsSyncing(true)
    setSyncProgress(0)
    
    try {
      const totalBusinesses = analyzedBusinesses.length
      let synced = 0
      
      for (const business of analyzedBusinesses) {
        try {
          await hubspotService.syncAnalyzedBusiness(business)
          synced++
          setSyncProgress(Math.round((synced / totalBusinesses) * 100))
        } catch (error) {
          console.error(`Failed to sync ${business.name}:`, error)
        }
      }
      
      toast.success(`Synced ${synced} out of ${totalBusinesses} businesses`)
      await fetchHubSpotStats()
    } catch (error: any) {
      toast.error('Sync failed. Please try again.')
    } finally {
      setIsSyncing(false)
      setSyncProgress(0)
    }
  }

  // Import from HubSpot
  const importFromHubSpot = async () => {
    try {
      const companies = await hubspotService.getCompanies(100)
      
      if (onSyncBusinesses) {
        const formattedBusinesses = companies.map((company: any) => ({
          id: company.id,
          name: company.properties.name,
          category: company.properties.industry || 'Unknown',
          location: `${company.properties.city || ''}, ${company.properties.state || ''}`.trim(),
          website: company.properties.website,
          phone: company.properties.phone,
          opportunityScore: 0,
          hasWebsite: !!company.properties.website,
          rating: 0,
          totalReviews: 0
        }))
        
        onSyncBusinesses(formattedBusinesses)
        toast.success(`Imported ${companies.length} companies from HubSpot`)
      }
    } catch (error: any) {
      toast.error(`Import failed: ${error.message}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Connection Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <img src="https://www.hubspot.com/hubfs/HubSpot_Logos/HubSpot-Inversed-Favicon.png" alt="HubSpot" className="h-6 w-6" />
                HubSpot Integration
              </CardTitle>
              <CardDescription>
                Connect your HubSpot account to sync leads and track deals
              </CardDescription>
            </div>
            <Badge className={isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
              {isConnected ? (
                <>
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Connected
                </>
              ) : (
                <>
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Disconnected
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {!isConnected && !showTokenInput && (
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Connect to HubSpot</AlertTitle>
                <AlertDescription>
                  Sync your analyzed businesses directly to HubSpot CRM to manage leads and track deals.
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-3">
                <Button onClick={() => setShowTokenInput(true)}>
                  <Link className="mr-2 h-4 w-4" />
                  Connect HubSpot
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open('https://app.hubspot.com/private-apps', '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Get Access Token
                </Button>
              </div>
            </div>
          )}

          {!isConnected && showTokenInput && (
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>How to get your HubSpot Access Token</AlertTitle>
                <AlertDescription className="space-y-2 mt-2">
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Go to your HubSpot account settings</li>
                    <li>Navigate to Integrations → Private Apps</li>
                    <li>Create a new private app or use existing one</li>
                    <li>Grant CRM permissions (contacts, companies, deals)</li>
                    <li>Copy the access token</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="access-token">Access Token *</Label>
                  <Input
                    id="access-token"
                    type="password"
                    placeholder="pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="portal-id">Portal ID (Optional)</Label>
                  <Input
                    id="portal-id"
                    type="text"
                    placeholder="12345678"
                    value={portalId}
                    onChange={(e) => setPortalId(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleConnect} disabled={isConnecting}>
                    {isConnecting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Connect
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setShowTokenInput(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isConnected && (
            <div className="space-y-6">
              {/* HubSpot Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{hubspotStats.contacts}</div>
                  <div className="text-sm text-gray-600">Contacts</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Building2 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{hubspotStats.companies}</div>
                  <div className="text-sm text-gray-600">Companies</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Briefcase className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{hubspotStats.deals}</div>
                  <div className="text-sm text-gray-600">Deals</div>
                </div>
              </div>

              {hubspotStats.lastSync && (
                <p className="text-sm text-gray-600 text-center">
                  Last synced: {hubspotStats.lastSync.toLocaleString()}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button onClick={syncAllBusinesses} disabled={isSyncing}>
                  {isSyncing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Syncing... {syncProgress}%
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Sync All Businesses ({analyzedBusinesses.length})
                    </>
                  )}
                </Button>
                
                <Button variant="outline" onClick={importFromHubSpot}>
                  <Download className="mr-2 h-4 w-4" />
                  Import from HubSpot
                </Button>
                
                <Button variant="outline" onClick={fetchHubSpotStats}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Stats
                </Button>
                
                <Button variant="destructive" onClick={handleDisconnect}>
                  <Unlink className="mr-2 h-4 w-4" />
                  Disconnect
                </Button>
              </div>

              {/* Sync Progress */}
              {isSyncing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Syncing businesses...</span>
                    <span>{syncProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${syncProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {isConnected && analyzedBusinesses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Sync</CardTitle>
            <CardDescription>
              Sync individual businesses to HubSpot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {analyzedBusinesses.slice(0, 5).map((business) => (
                <div key={business.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{business.name}</p>
                    <p className="text-sm text-gray-600">
                      Score: {business.opportunityScore}% • {business.category}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => syncBusiness(business)}>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>HubSpot Integration Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <div className="p-2 bg-blue-100 rounded-lg h-fit">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">Automatic Company Creation</h4>
                <p className="text-sm text-gray-600">
                  Analyzed businesses are automatically added as companies
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="p-2 bg-purple-100 rounded-lg h-fit">
                <Briefcase className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">Deal Pipeline Management</h4>
                <p className="text-sm text-gray-600">
                  High-opportunity businesses create deals automatically
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="p-2 bg-green-100 rounded-lg h-fit">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">Contact Tracking</h4>
                <p className="text-sm text-gray-600">
                  Keep track of all your business contacts in one place
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="p-2 bg-orange-100 rounded-lg h-fit">
                <RefreshCw className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium">Two-Way Sync</h4>
                <p className="text-sm text-gray-600">
                  Import existing HubSpot data and keep everything in sync
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
