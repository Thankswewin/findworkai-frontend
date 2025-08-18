'use client'

import React from 'react'
import { AIAgentDashboard } from '@/components/ai-agent/AIAgentDashboard'

export default function AIAgentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">AI Agent</h2>
        <p className="text-muted-foreground">
          Autonomous AI agents to automate your business development workflow
        </p>
      </div>
      
      <AIAgentDashboard />
    </div>
  )
}
