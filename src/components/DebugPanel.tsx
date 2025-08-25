'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { 
  Bug, 
  Download, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  Info,
  AlertTriangle,
  XCircle,
  Copy,
  Check
} from 'lucide-react'
import logger, { LogLevel, LogEntry } from '@/lib/logger'
import { cn } from '@/lib/utils'

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filter, setFilter] = useState<LogLevel | 'ALL'>('ALL')
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check if we should show debug panel
    const isDev = process.env.NODE_ENV === 'development'
    const hasDebugParam = window.location.search.includes('debug=true')
    
    if (!isDev && !hasDebugParam) return

    // Update logs every second
    const interval = setInterval(() => {
      const allLogs = logger.getLogs()
      setLogs([...allLogs].reverse()) // Show newest first
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Don't render until mounted (prevents hydration mismatch)
  if (!mounted) {
    return null
  }

  // Check if we should render the debug panel
  const isDev = process.env.NODE_ENV === 'development'
  const hasDebugParam = window.location.search.includes('debug=true')
  
  if (!isDev && !hasDebugParam) {
    return null
  }

  const filteredLogs = filter === 'ALL' 
    ? logs 
    : logs.filter(log => log.level === filter)

  const getLogIcon = (level: LogLevel) => {
    switch (level) {
      case LogLevel.DEBUG:
        return <Bug className="h-3 w-3" />
      case LogLevel.INFO:
        return <Info className="h-3 w-3" />
      case LogLevel.WARN:
        return <AlertTriangle className="h-3 w-3" />
      case LogLevel.ERROR:
        return <XCircle className="h-3 w-3" />
    }
  }

  const getLogColor = (level: LogLevel) => {
    switch (level) {
      case LogLevel.DEBUG:
        return 'text-gray-500'
      case LogLevel.INFO:
        return 'text-blue-500'
      case LogLevel.WARN:
        return 'text-yellow-500'
      case LogLevel.ERROR:
        return 'text-red-500'
    }
  }

  const exportLogs = () => {
    const logData = logger.exportLogs()
    const blob = new Blob([logData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logs-${new Date().toISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyLogs = async () => {
    const logData = logger.exportLogs()
    await navigator.clipboard.writeText(logData)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearLogs = () => {
    logger.clearLogs()
    setLogs([])
  }

  const errorCount = logs.filter(l => l.level === LogLevel.ERROR).length
  const warnCount = logs.filter(l => l.level === LogLevel.WARN).length

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className={cn(
          "shadow-lg",
          errorCount > 0 && "border-red-500",
          warnCount > 0 && errorCount === 0 && "border-yellow-500"
        )}
      >
        <Bug className="h-4 w-4 mr-2" />
        Debug
        {errorCount > 0 && (
          <Badge variant="destructive" className="ml-2">
            {errorCount}
          </Badge>
        )}
        {isOpen ? <ChevronDown className="h-4 w-4 ml-2" /> : <ChevronUp className="h-4 w-4 ml-2" />}
      </Button>

      {/* Debug Panel */}
      {isOpen && (
        <Card className="absolute bottom-12 right-0 w-[600px] h-[400px] shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Debug Console</CardTitle>
              <div className="flex items-center gap-2">
                {/* Filter Buttons */}
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant={filter === 'ALL' ? 'default' : 'ghost'}
                    className="h-7 px-2"
                    onClick={() => setFilter('ALL')}
                  >
                    All ({logs.length})
                  </Button>
                  <Button
                    size="sm"
                    variant={filter === LogLevel.ERROR ? 'destructive' : 'ghost'}
                    className="h-7 px-2"
                    onClick={() => setFilter(LogLevel.ERROR)}
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    {errorCount}
                  </Button>
                  <Button
                    size="sm"
                    variant={filter === LogLevel.WARN ? 'default' : 'ghost'}
                    className="h-7 px-2"
                    onClick={() => setFilter(LogLevel.WARN)}
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {warnCount}
                  </Button>
                  <Button
                    size="sm"
                    variant={filter === LogLevel.INFO ? 'default' : 'ghost'}
                    className="h-7 px-2"
                    onClick={() => setFilter(LogLevel.INFO)}
                  >
                    <Info className="h-3 w-3 mr-1" />
                    {logs.filter(l => l.level === LogLevel.INFO).length}
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={copyLogs}
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={exportLogs}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={clearLogs}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[340px] px-4">
              {filteredLogs.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  No logs to display
                </div>
              ) : (
                <div className="space-y-1 py-2">
                  {filteredLogs.map((log, index) => (
                    <div
                      key={`${log.timestamp}-${index}`}
                      className="font-mono text-xs border-b border-border/50 pb-1"
                    >
                      <div className="flex items-start gap-2">
                        <span className={cn("mt-0.5", getLogColor(log.level))}>
                          {getLogIcon(log.level)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                            {log.context && (
                              <Badge variant="outline" className="h-4 px-1 text-[10px]">
                                {log.context}
                              </Badge>
                            )}
                          </div>
                          <div className="text-foreground break-words">
                            {log.message}
                          </div>
                          {log.data && (
                            <pre className="text-[10px] text-muted-foreground mt-1 overflow-x-auto">
                              {JSON.stringify(log.data, null, 2)}
                            </pre>
                          )}
                          {log.error && (
                            <div className="text-[10px] text-red-500 mt-1">
                              {log.error.message || log.error}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
