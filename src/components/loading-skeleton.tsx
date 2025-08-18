'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

export default function LoadingSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-5">
        {/* Header skeleton */}
        <div className="mb-3">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Details skeleton */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded flex-1"></div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
        </div>

        {/* Button skeleton */}
        <div className="h-9 bg-gray-200 rounded"></div>
      </CardContent>
    </Card>
  )
}
