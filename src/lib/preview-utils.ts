import { headers } from 'next/headers'
import { NextRequest } from 'next/server'

/**
 * Preview Mode Utilities
 * 
 * These functions check if preview mode is enabled by looking for the
 * __sanity_preview cookie, which is set by /api/preview after validating
 * the SANITY_PREVIEW_SECRET.
 * 
 * The cookie is httpOnly (server-only), so these functions are the only
 * way to check preview status. The cookie never reaches client JavaScript.
 */

// Check if preview mode is enabled from server components
// Reads the __sanity_preview cookie set by /api/preview route
export function isPreviewMode(): boolean {
  const headersList = headers()
  const cookie = headersList.get('cookie')
  return cookie?.includes('__sanity_preview') ?? false
}

// Check if preview mode is enabled from API routes
export function isPreviewModeFromRequest(req: NextRequest): boolean {
  return req.cookies.get('__sanity_preview')?.value === 'true'
}

// Get preview mode status for page components
export function getPreviewMode(req?: Request): boolean {
  if (typeof window !== 'undefined') {
    // Client-side check
    return document.cookie.includes('__sanity_preview')
  }
  
  if (req) {
    // Server-side check with Request object
    return req.headers.get('cookie')?.includes('__sanity_preview') ?? false
  }
  
  // Server component check
  return isPreviewMode()
}

// Middleware to add preview mode to request context
export function withPreviewMode<T extends Record<string, any>>(
  handler: (params: T & { preview: boolean }) => Promise<any>
) {
  return async (params: T, req?: NextRequest) => {
    const preview = req ? isPreviewModeFromRequest(req) : isPreviewMode()
    return handler({ ...params, preview })
  }
}

// Type guard for preview-enabled API responses
export interface PreviewResponse<T = any> {
  data: T
  preview: boolean
  message?: string
}

export function createPreviewResponse<T>(
  data: T, 
  preview: boolean, 
  message?: string
): PreviewResponse<T> {
  return {
    data,
    preview,
    message: message || (preview ? 'Preview mode enabled' : 'Published content'),
  }
}

// Preview mode constants
export const PREVIEW_COOKIE_NAME = '__sanity_preview'
export const PREVIEW_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24, // 24 hours
  path: '/',
}

// Environment validation for preview mode
export function validatePreviewEnvironment(): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Check for preview secret
  if (!process.env.SANITY_PREVIEW_SECRET) {
    warnings.push('SANITY_PREVIEW_SECRET not set - using default (not recommended for production)')
  }

  // Check for API token (required for preview mode)
  if (!process.env.SANITY_API_TOKEN) {
    errors.push('SANITY_API_TOKEN is required for preview mode')
  }

  // Validate API token format
  const token = process.env.SANITY_API_TOKEN
  if (token && !token.startsWith('sk')) {
    warnings.push('SANITY_API_TOKEN should start with "sk" for API tokens')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}