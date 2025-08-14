'use client'

import React from 'react'
import CampaignManager from '@/components/campaigns/CampaignManager'

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Campaigns</h2>
        <p className="text-muted-foreground">
          Create and manage your email outreach campaigns
        </p>
      </div>
      
      <CampaignManager />
    </div>
  )
}
