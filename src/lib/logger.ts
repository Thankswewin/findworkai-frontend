/**
 * Logger utility for debugging and monitoring
 * Provides real-time logging to console and optional remote logging
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
  error?: any
  context?: string
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 1000
  private isProduction = process.env.NODE_ENV === 'production'

  private formatMessage(level: LogLevel, message: string, context?: string): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? `[${context}]` : ''
    return `${timestamp} [${level}]${contextStr} ${message}`
  }

  private getStyle(level: LogLevel): string {
    switch (level) {
      case LogLevel.DEBUG:
        return 'color: #888; font-weight: normal;'
      case LogLevel.INFO:
        return 'color: #2563eb; font-weight: normal;'
      case LogLevel.WARN:
        return 'color: #f59e0b; font-weight: bold;'
      case LogLevel.ERROR:
        return 'color: #ef4444; font-weight: bold;'
      default:
        return ''
    }
  }

  private log(level: LogLevel, message: string, data?: any, error?: any, context?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      error,
      context
    }

    // Store log entry
    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Console output with styling
    const formattedMessage = this.formatMessage(level, message, context)
    const style = this.getStyle(level)

    if (level === LogLevel.ERROR && error) {
      console.group(`%c${formattedMessage}`, style)
      console.error('Error:', error)
      if (data) console.log('Data:', data)
      console.groupEnd()
    } else if (data) {
      console.group(`%c${formattedMessage}`, style)
      console.log('Data:', data)
      console.groupEnd()
    } else {
      console.log(`%c${formattedMessage}`, style)
    }

    // Send critical errors to remote logging in production
    if (this.isProduction && level === LogLevel.ERROR) {
      this.sendToRemote(entry)
    }
  }

  private async sendToRemote(entry: LogEntry) {
    try {
      // You can implement remote logging here (e.g., Sentry, LogRocket, etc.)
      // For now, we'll just store in localStorage for debugging
      const remoteErrors = JSON.parse(localStorage.getItem('app_errors') || '[]')
      remoteErrors.push(entry)
      // Keep only last 50 errors
      if (remoteErrors.length > 50) {
        remoteErrors.shift()
      }
      localStorage.setItem('app_errors', JSON.stringify(remoteErrors))
    } catch (err) {
      console.error('Failed to send log to remote:', err)
    }
  }

  debug(message: string, data?: any, context?: string) {
    if (!this.isProduction) {
      this.log(LogLevel.DEBUG, message, data, undefined, context)
    }
  }

  info(message: string, data?: any, context?: string) {
    this.log(LogLevel.INFO, message, data, undefined, context)
  }

  warn(message: string, data?: any, context?: string) {
    this.log(LogLevel.WARN, message, data, undefined, context)
  }

  error(message: string, error?: any, data?: any, context?: string) {
    this.log(LogLevel.ERROR, message, data, error, context)
  }

  // API specific logging
  apiRequest(method: string, url: string, data?: any) {
    this.debug(`API Request: ${method} ${url}`, data, 'API')
  }

  apiResponse(method: string, url: string, status: number, data?: any) {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.DEBUG
    this.log(level, `API Response: ${method} ${url} - Status: ${status}`, data, undefined, 'API')
  }

  apiError(method: string, url: string, error: any) {
    this.error(`API Error: ${method} ${url}`, error, {
      response: error.response?.data,
      status: error.response?.status
    }, 'API')
  }

  // Get all logs for debugging
  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level)
    }
    return this.logs
  }

  // Clear logs
  clearLogs() {
    this.logs = []
  }

  // Export logs for debugging
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  // Get remote errors from localStorage
  getRemoteErrors(): LogEntry[] {
    try {
      return JSON.parse(localStorage.getItem('app_errors') || '[]')
    } catch {
      return []
    }
  }

  clearRemoteErrors() {
    localStorage.removeItem('app_errors')
  }
}

// Export singleton instance
export const logger = new Logger()

// Export for use in components
export default logger
