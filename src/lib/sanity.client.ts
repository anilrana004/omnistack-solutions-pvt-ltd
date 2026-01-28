import {createClient} from '@sanity/client'
import { logger } from './logger'

/**
 * Base Sanity Client (Published Content Only)
 * 
 * This client fetches only published content from the public dataset.
 * It does NOT use authentication tokens and is safe to use anywhere.
 * 
 * Environment variables loaded from .env.local:
 * - NEXT_PUBLIC_SANITY_PROJECT_ID: Your Sanity project ID
 * - NEXT_PUBLIC_SANITY_DATASET: Dataset name (e.g., "production")
 * - NEXT_PUBLIC_SANITY_API_VERSION: API version (e.g., "2024-01-01")
 * 
 * Note: These are NEXT_PUBLIC_ variables, meaning they're exposed to the client.
 * This is safe because they're public project identifiers, not secrets.
 */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kvjr9xh2'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

// Validate critical environment variables on module load (server-side only)
if (typeof window === 'undefined') {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    logger.warn('NEXT_PUBLIC_SANITY_PROJECT_ID not set, using fallback', { fallback: projectId })
  }
  if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
    logger.warn('NEXT_PUBLIC_SANITY_DATASET not set, using fallback', { fallback: dataset })
  }
}

// Base client for fetching published content (no authentication required)
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // CDN is great for production, but can delay seeing newly-published content locally.
  useCdn: process.env.NODE_ENV === 'production',
  // No token here - this client only accesses public published content
})

