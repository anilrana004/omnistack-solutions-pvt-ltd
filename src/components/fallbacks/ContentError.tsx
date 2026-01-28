'use client'

import { RefreshCw, AlertTriangle, Wifi, Clock } from 'lucide-react'
import { ContentErrorType, type ContentError } from '@/src/lib/error-handling'

interface ContentErrorProps {
  error?: ContentError | null
  onRetry?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'card' | 'banner' | 'inline'
}

export default function ContentError({
  error,
  onRetry,
  className = '',
  size = 'md',
  variant = 'card',
}: ContentErrorProps) {
  const getErrorIcon = (errorType?: ContentErrorType) => {
    switch (errorType) {
      case ContentErrorType.NETWORK_ERROR:
        return <Wifi className="text-red-500" />
      case ContentErrorType.TIMEOUT:
        return <Clock className="text-amber-500" />
      case ContentErrorType.MAINTENANCE_MODE:
        return <AlertTriangle className="text-blue-500" />
      default:
        return <AlertTriangle className="text-red-500" />
    }
  }

  const getErrorMessage = (error?: ContentError | null) => {
    if (!error) return 'Something went wrong'
    
    switch (error.type) {
      case ContentErrorType.NETWORK_ERROR:
        return 'Unable to load content. Please check your internet connection.'
      case ContentErrorType.TIMEOUT:
        return 'Content is taking longer than expected to load.'
      case ContentErrorType.NOT_FOUND:
        return 'The requested content was not found.'
      case ContentErrorType.MAINTENANCE_MODE:
        return 'Content is temporarily unavailable due to maintenance.'
      default:
        return error.message || 'An unexpected error occurred'
    }
  }

  const getErrorTitle = (errorType?: ContentErrorType) => {
    switch (errorType) {
      case ContentErrorType.NETWORK_ERROR:
        return 'Connection Issue'
      case ContentErrorType.TIMEOUT:
        return 'Loading Timeout'
      case ContentErrorType.NOT_FOUND:
        return 'Content Not Found'
      case ContentErrorType.MAINTENANCE_MODE:
        return 'Maintenance Mode'
      default:
        return 'Error Loading Content'
    }
  }

  const sizeClasses = {
    sm: 'p-3 text-sm',
    md: 'p-6 text-base',
    lg: 'p-8 text-lg',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  const buttonSizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const baseClasses = `
    flex flex-col items-center justify-center text-center
    ${sizeClasses[size]}
    ${className}
  `

  const variantClasses = {
    card: 'bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg',
    banner: 'bg-red-50 border-l-4 border-red-400 text-red-700',
    inline: 'bg-transparent',
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`}>
      <div className={`${iconSizes[size]} mb-3`}>
        {getErrorIcon(error?.type)}
      </div>
      
      <h3 className="font-semibold text-gray-100 mb-2">
        {getErrorTitle(error?.type)}
      </h3>
      
      <p className="text-gray-300 mb-4 max-w-md">
        {getErrorMessage(error)}
      </p>

      {onRetry && error?.retryable !== false && (
        <button
          onClick={onRetry}
          className={`
            inline-flex items-center gap-2 
            bg-olive-600 hover:bg-olive-700 
            text-white font-medium rounded-lg
            transition-colors duration-200
            ${buttonSizes[size]}
          `}
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}

      {process.env.NODE_ENV === 'development' && error?.details && (
        <details className="mt-4 text-xs text-gray-400 max-w-md">
          <summary className="cursor-pointer hover:text-gray-300">
            Debug Info
          </summary>
          <pre className="mt-2 p-2 bg-gray-800 rounded text-left overflow-auto">
            {JSON.stringify(error.details, null, 2)}
          </pre>
        </details>
      )}
    </div>
  )
}