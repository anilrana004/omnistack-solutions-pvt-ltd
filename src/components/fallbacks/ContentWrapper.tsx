'use client'

import { ReactNode, useState, useEffect } from 'react'
import ContentError from './ContentError'
import ContentSkeleton from './ContentSkeleton'
import type { ContentError as ContentErrorType } from '@/src/lib/error-handling'

interface ContentWrapperProps {
  children: ReactNode
  loading?: boolean
  error?: ContentErrorType | null
  empty?: boolean
  emptyMessage?: string
  emptyAction?: {
    text: string
    onClick: () => void
  }
  loadingSkeleton?: 'card' | 'list' | 'hero' | 'text' | 'image' | 'grid'
  skeletonCount?: number
  onRetry?: () => void
  className?: string
  minHeight?: string
  retryDelay?: number
}

export default function ContentWrapper({
  children,
  loading = false,
  error = null,
  empty = false,
  emptyMessage = 'No content available',
  emptyAction,
  loadingSkeleton = 'card',
  skeletonCount = 3,
  onRetry,
  className = '',
  minHeight = 'min-h-[200px]',
  retryDelay = 0,
}: ContentWrapperProps) {
  const [retrying, setRetrying] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const handleRetry = async () => {
    if (!onRetry || retrying) return

    setRetrying(true)
    setRetryCount(prev => prev + 1)

    if (retryDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, retryDelay))
    }

    try {
      await onRetry()
    } finally {
      setRetrying(false)
    }
  }

  // Auto-retry for certain error types
  useEffect(() => {
    if (error?.retryable && retryCount < 3 && onRetry) {
      const timeout = setTimeout(() => {
        handleRetry()
      }, Math.pow(2, retryCount) * 1000) // Exponential backoff

      return () => clearTimeout(timeout)
    }
  }, [error, retryCount, onRetry])

  const wrapperClasses = `
    ${minHeight}
    ${className}
  `

  // Loading state
  if (loading || retrying) {
    return (
      <div className={wrapperClasses}>
        <ContentSkeleton 
          variant={loadingSkeleton} 
          count={skeletonCount}
          className="w-full"
        />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className={wrapperClasses}>
        <ContentError
          error={error}
          onRetry={handleRetry}
          size="md"
          variant="card"
          className="w-full"
        />
      </div>
    )
  }

  // Empty state
  if (empty) {
    return (
      <div className={wrapperClasses}>
        <div className="flex flex-col items-center justify-center text-center p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
          <div className="w-16 h-16 mb-4 flex items-center justify-center bg-white/10 rounded-full">
            <svg 
              className="w-8 h-8 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-100 mb-2">
            No Content Available
          </h3>
          
          <p className="text-gray-300 mb-4 max-w-md">
            {emptyMessage}
          </p>

          {emptyAction && (
            <button
              onClick={emptyAction.onClick}
              className="px-6 py-2 bg-olive-600 hover:bg-olive-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              {emptyAction.text}
            </button>
          )}
        </div>
      </div>
    )
  }

  // Success state - render children
  return (
    <div className={wrapperClasses}>
      {children}
    </div>
  )
}

// Specialized wrappers for common use cases
export function ServiceWrapper({
  children,
  ...props
}: Omit<ContentWrapperProps, 'loadingSkeleton' | 'emptyMessage'>) {
  return (
    <ContentWrapper
      loadingSkeleton="grid"
      emptyMessage="No services available at the moment."
      {...props}
    >
      {children}
    </ContentWrapper>
  )
}

export function CaseStudyWrapper({
  children,
  ...props
}: Omit<ContentWrapperProps, 'loadingSkeleton' | 'emptyMessage'>) {
  return (
    <ContentWrapper
      loadingSkeleton="grid"
      emptyMessage="No case studies available at the moment."
      {...props}
    >
      {children}
    </ContentWrapper>
  )
}

export function BlogWrapper({
  children,
  ...props
}: Omit<ContentWrapperProps, 'loadingSkeleton' | 'emptyMessage'>) {
  return (
    <ContentWrapper
      loadingSkeleton="card"
      emptyMessage="No blog posts available at the moment."
      {...props}
    >
      {children}
    </ContentWrapper>
  )
}

export function FAQWrapper({
  children,
  ...props
}: Omit<ContentWrapperProps, 'loadingSkeleton' | 'emptyMessage'>) {
  return (
    <ContentWrapper
      loadingSkeleton="list"
      emptyMessage="No frequently asked questions available."
      {...props}
    >
      {children}
    </ContentWrapper>
  )
}

export function TestimonialWrapper({
  children,
  ...props
}: Omit<ContentWrapperProps, 'loadingSkeleton' | 'emptyMessage'>) {
  return (
    <ContentWrapper
      loadingSkeleton="card"
      emptyMessage="No testimonials available at the moment."
      {...props}
    >
      {children}
    </ContentWrapper>
  )
}