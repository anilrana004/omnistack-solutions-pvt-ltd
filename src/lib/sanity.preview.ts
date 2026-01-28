import { sanityClient } from './sanity.client'
import { createClient } from '@sanity/client'

/**
 * Sanity Preview Client Configuration
 * 
 * This client is used to fetch draft/unpublished content when preview mode is enabled.
 * 
 * Security:
 * - SANITY_API_TOKEN is loaded from .env.local (server-only, never exposed to client)
 * - Token is only used server-side in API routes and server components
 * - Client-side code never has access to the token
 * 
 * How it works:
 * 1. User visits /api/preview?secret=SECRET&slug=/blogs/my-post
 * 2. API validates secret and sets __sanity_preview cookie
 * 3. Server components check cookie and use previewClient if enabled
 * 4. previewClient uses perspective: 'previewDrafts' to fetch draft content
 * 5. Token authenticates the request to Sanity API
 */

// Load API token from environment (server-only, never sent to client)
// This token must have Editor permissions in Sanity to access drafts
const apiToken = process.env.SANITY_API_TOKEN

// Warn if token is missing (preview mode won't work without it)
if (!apiToken && process.env.NODE_ENV !== 'production') {
  console.warn(
    '⚠️  SANITY_API_TOKEN not found. Preview mode will not work. ' +
    'Add SANITY_API_TOKEN to .env.local to enable draft content preview.'
  )
}

// Preview client with authentication for fetching draft content
// Only used server-side when preview mode cookie is present
// If token is missing, this client will fail when trying to fetch drafts
export const previewClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kvjr9xh2',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false, // Always get latest data in preview mode (no CDN caching)
  token: apiToken, // Server-only token - authenticates requests to fetch drafts
  perspective: 'previewDrafts', // This perspective includes draft documents
  ignoreBrowserTokenWarning: true, // Suppress warning since token is server-only
})

/**
 * Preview-aware client selector
 * 
 * Returns the appropriate Sanity client based on preview mode:
 * - preview=true: Returns previewClient (fetches drafts using SANITY_API_TOKEN)
 * - preview=false: Returns sanityClient (fetches only published content)
 * 
 * The preview flag is determined by checking the __sanity_preview cookie
 * which is set by /api/preview route after secret validation.
 * 
 * Security: If preview is requested but token is missing, falls back to regular client
 * to prevent errors. Preview mode simply won't work until token is configured.
 * 
 * @param preview - Whether preview mode is enabled (checked via cookie)
 * @returns Sanity client instance (preview or regular)
 */
export function getClient(preview = false) {
  // If preview mode is enabled, use authenticated client to fetch drafts
  if (preview) {
    // Safety check: if token is missing, fall back to regular client
    // This prevents errors but preview won't show drafts
    if (!apiToken) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          'Preview mode requested but SANITY_API_TOKEN is missing. ' +
          'Falling back to published content only.'
        )
      }
      return sanityClient
    }
    return previewClient
  }
  
  // Normal mode: fetch only published content
  return sanityClient
}

// Preview mode utilities
export class PreviewMode {
  static isEnabled(req?: Request): boolean {
    if (typeof window !== 'undefined') {
      // Client-side check
      return document.cookie.includes('__sanity_preview')
    }
    
    if (req) {
      // Server-side check
      return req.headers.get('cookie')?.includes('__sanity_preview') || false
    }
    
    return false
  }

  static async enable(secret?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret }),
      })

      if (!response.ok) {
        throw new Error('Failed to enable preview mode')
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  static async disable(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch('/api/preview', {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to disable preview mode')
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}

// Preview-aware data fetching
export async function fetchWithPreview<T>(
  query: string,
  params: Record<string, any> = {},
  preview = false
): Promise<T> {
  const client = getClient(preview)
  return await client.fetch<T>(query, params)
}

// Live query for real-time preview updates
export function useLiveQuery<T>(
  initialData: T,
  query: string,
  params: Record<string, any> = {},
  enabled = false
) {
  // This would integrate with Sanity's live query system
  // For now, return initial data
  return {
    data: initialData,
    loading: false,
    error: null,
  }
}

// Visual editing helpers
export function generateEditUrl(
  documentType: string,
  documentId: string,
  path?: string
): string {
  const baseUrl = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.sanity.studio`
  const intent = `intent=edit&id=${documentId}&type=${documentType}`
  const pathParam = path ? `&path=${encodeURIComponent(path)}` : ''
  
  return `${baseUrl}/desk/${intent}${pathParam}`
}

// Preview banner component data
export interface PreviewBannerData {
  isPreview: boolean
  documentType?: string
  documentId?: string
  editUrl?: string
}

export function getPreviewBannerData(
  request?: Request,
  documentType?: string,
  documentId?: string
): PreviewBannerData {
  const isPreview = PreviewMode.isEnabled(request)
  
  return {
    isPreview,
    documentType,
    documentId,
    editUrl: documentType && documentId 
      ? generateEditUrl(documentType, documentId)
      : undefined,
  }
}