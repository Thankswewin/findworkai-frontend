'use client'

import React from 'react'
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">
          Track performance metrics and gain insights into your lead generation efforts
        </p>
      </div>
      
      <AnalyticsDashboard />
    </div>
  )
}
