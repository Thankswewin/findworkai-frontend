'use client'

import React from 'react'
import FollowUpManager from '@/components/followup/FollowUpManager'
import ErrorBoundary from '@/components/common/ErrorBoundary'

export default function FollowUpsPage() {
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Follow-ups</h2>
          <p className="text-muted-foreground">
            Manage automated follow-up sequences and reminders
          </p>
        </div>
        
        <FollowUpManager />
      </div>
    </ErrorBoundary>
  )
}
