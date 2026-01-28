/**
 * Structured Logger Utility
 * 
 * Provides consistent logging across the application with:
 * - Development-only client-side logs
 * - Server-side logs for Vercel Functions
 * - Structured error logging
 * - Production-safe error messages
 * 
 * Usage:
 * - Server: logger.error('API Error', { error, route: '/api/contact' })
 * - Client: logger.dev('Component rendered', { props })
 * 
 * Logs appear in:
 * - Local: Terminal/console
 * - Vercel: Functions logs in dashboard
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: any
}

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: LogContext
  error?: {
    name: string
    message: string
    stack?: string
    code?: string
  }
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isServer = typeof window === 'undefined'

  /**
   * Format log entry for consistent output
   */
  private formatLog(level: LogLevel, message: string, context?: LogContext, error?: Error): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: this.sanitizeContext(context),
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
        code: (error as any).code,
      }
    }

    return entry
  }

  /**
   * Sanitize context to prevent logging sensitive data
   */
  private sanitizeContext(context?: LogContext): LogContext | undefined {
    if (!context) return undefined

    const sanitized = { ...context }
    const sensitiveKeys = ['password', 'token', 'secret', 'apiKey', 'authorization', 'cookie']

    for (const key of Object.keys(sanitized)) {
      const lowerKey = key.toLowerCase()
      if (sensitiveKeys.some(sk => lowerKey.includes(sk))) {
        sanitized[key] = '[REDACTED]'
      }
    }

    return sanitized
  }

  /**
   * Write log to appropriate output
   */
  private writeLog(entry: LogEntry): void {
    const logString = JSON.stringify(entry)

    if (this.isServer) {
      // Server-side: Always log (appears in Vercel Functions logs)
      console.log(logString)
    } else {
      // Client-side: Only in development
      if (this.isDevelopment) {
        console.log(logString)
      }
    }
  }

  /**
   * Debug logs (development only)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      const entry = this.formatLog('debug', message, context)
      this.writeLog(entry)
    }
  }

  /**
   * Info logs (always logged on server, dev-only on client)
   */
  info(message: string, context?: LogContext): void {
    const entry = this.formatLog('info', message, context)
    this.writeLog(entry)
  }

  /**
   * Warning logs
   */
  warn(message: string, context?: LogContext): void {
    const entry = this.formatLog('warn', message, context)
    this.writeLog(entry)
  }

  /**
   * Error logs (always logged)
   */
  error(message: string, error?: Error, context?: LogContext): void {
    const entry = this.formatLog('error', message, context, error)
    this.writeLog(entry)
    
    // Also log to console.error for immediate visibility
    if (this.isServer || this.isDevelopment) {
      console.error(`[ERROR] ${message}`, error || context)
    }
  }

  /**
   * Development-only logs (client-side)
   */
  dev(message: string, context?: LogContext): void {
    if (this.isDevelopment && !this.isServer) {
      console.log(`[DEV] ${message}`, context)
    }
  }

  /**
   * API route error logging with route context
   */
  apiError(route: string, error: Error | unknown, context?: LogContext): void {
    const errorObj = error instanceof Error ? error : new Error(String(error))
    this.error(`API Error: ${route}`, errorObj, {
      route,
      ...context,
    })
  }

  /**
   * Sanity CMS error logging
   */
  sanityError(operation: string, error: Error | unknown, context?: LogContext): void {
    const errorObj = error instanceof Error ? error : new Error(String(error))
    this.error(`Sanity Error: ${operation}`, errorObj, {
      operation,
      ...context,
    })
  }
}

// Export singleton instance
export const logger = new Logger()

// Export types for use in other files
export type { LogLevel, LogContext, LogEntry }