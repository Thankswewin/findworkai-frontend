'use client'

import React from 'react'
import { ExportSync } from '@/components/export/ExportSync'

export default function ExportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Export & Sync</h2>
        <p className="text-muted-foreground">
          Export your data and sync with CRM platforms
        </p>
      </div>
      
      <ExportSync />
    </div>
  )
}
