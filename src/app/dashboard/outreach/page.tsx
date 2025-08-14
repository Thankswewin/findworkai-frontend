'use client'

import React from 'react'
import { EmailOutreach } from '@/components/outreach/EmailOutreach'

export default function OutreachPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Email Outreach</h2>
        <p className="text-muted-foreground">
          Generate personalized emails and manage your outreach campaigns
        </p>
      </div>
      
      <EmailOutreach />
    </div>
  )
}
