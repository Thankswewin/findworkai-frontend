'use client'

import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface ErrorStateProps {
  message: string
  onRetry?: () => void
  details?: string
}

export default function ErrorState({ message, onRetry, details }: ErrorStateProps) {
  return (
    <Alert variant="destructive" className="my-6">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="mt-2">
        <p>{message}</p>
        {details && (
          <p className="text-sm mt-2 opacity-80">{details}</p>
        )}
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="mt-4"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}
