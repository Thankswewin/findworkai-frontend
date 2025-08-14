'use client'

import React from 'react'
import LeadScoring from '@/components/leads/LeadScoring'

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Lead Scoring</h2>
        <p className="text-muted-foreground">
          Score and prioritize your leads based on AI-powered analysis
        </p>
      </div>
      
      <LeadScoring />
    </div>
  )
}
