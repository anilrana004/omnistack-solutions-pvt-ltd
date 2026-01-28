import { sanityClient } from './sanity.client'
import { getClient } from './sanity.preview'
import { logger } from './logger'
import type {
  SanityPage,
  SanitySection,
  SanityService,
  SanityCaseStudy,
  SanityFAQ,
  SanityTestimonial,
  SanitySettings,
  SanityBlogListItem,
  SanityBlogDetail,
  SanityApiResponse,
  SanityListResponse,
  ContentFallbacks,
} from './sanity.types'
import {
  pageBySlugQuery,
  allPagesQuery,
  sectionByIdentifierQuery,
  allSectionsQuery,
  allServicesQuery,
  serviceBySlugQuery,
  featuredServicesQuery,
  allCaseStudiesQuery,
  caseStudyBySlugQuery,
  featuredCaseStudiesQuery,
  allFAQsQuery,
  faqsByCategoryQuery,
  featuredFAQsQuery,
  allTestimonialsQuery,
  featuredTestimonialsQuery,
  siteSettingsQuery,
  allBlogsQuery,
  blogBySlugQuery,
} from './sanity.queries'

// Error handling utilities
class SanityAPIError extends Error {
  constructor(message: string, public code?: string, public details?: any) {
    super(message)
    this.name = 'SanityAPIError'
  }
}

// Cache utilities (simple in-memory cache)
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class SanityCache {
  private cache = new Map<string, CacheEntry<any>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const isExpired = Date.now() - entry.timestamp > entry.ttl
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  clear(): void {
    this.cache.clear()
  }
}

const cache = new SanityCache()

/**
 * Base fetch function with error handling and caching
 * 
 * Preview Mode Integration:
 * - When preview=true: Uses previewClient with SANITY_API_TOKEN to fetch drafts
 * - When preview=false: Uses sanityClient to fetch only published content
 * - Preview mode skips caching to always show latest draft content
 * 
 * The preview flag should be determined by checking the __sanity_preview cookie
 * using isPreviewMode() from preview-utils.ts
 */
async function fetchFromSanity<T>(
  query: string, 
  params: Record<string, any> = {},
  cacheKey?: string,
  cacheTTL?: number,
  preview = false
): Promise<SanityApiResponse<T>> {
  try {
    // Skip cache in preview mode (always fetch fresh draft content)
    if (!preview && cacheKey) {
      const cached = cache.get<T>(cacheKey)
      if (cached) {
        return {
          success: true,
          data: cached,
          cached: true,
          timestamp: new Date().toISOString(),
        }
      }
    }

    // Get appropriate client based on preview mode
    // preview=true → previewClient (uses SANITY_API_TOKEN, fetches drafts)
    // preview=false → sanityClient (public client, published content only)
    const client = getClient(preview)
    
    // Log Sanity fetch in development
    logger.debug('Fetching from Sanity', {
      preview,
      hasCacheKey: !!cacheKey,
      queryLength: query.length,
    })
    
    // Fetch from Sanity (will fetch drafts if preview mode is enabled)
    const data = await client.fetch<T>(query, params)
    
    // Log empty responses (might indicate missing content or query issues)
    if (!data || (Array.isArray(data) && data.length === 0)) {
      logger.warn('Empty Sanity response', {
        preview,
        query: query.substring(0, 100), // First 100 chars for debugging
      })
    }

    // Cache the result (skip caching in preview mode)
    if (!preview && cacheKey && data !== null) {
      cache.set(cacheKey, data, cacheTTL)
    }

    return {
      success: true,
      data: data || null,
      cached: false,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorCode = (error as any)?.response?.statusCode || (error as any)?.statusCode || 'UNKNOWN'
    
    // Log Sanity errors with full context
    logger.sanityError('fetchFromSanity', error instanceof Error ? error : new Error(errorMessage), {
      preview,
      query: query.substring(0, 200), // First 200 chars for debugging
      errorCode,
      params: Object.keys(params), // Log param keys, not values (might contain sensitive data)
    })
    
    return {
      success: false,
      data: null,
      error: errorMessage,
      timestamp: new Date().toISOString(),
    }
  }
}

// Page API functions
export async function getPageBySlug(slug: string, preview = false): Promise<SanityApiResponse<SanityPage>> {
  return fetchFromSanity<SanityPage>(
    pageBySlugQuery,
    { slug },
    preview ? undefined : `page:${slug}`,
    10 * 60 * 1000, // 10 minutes
    preview
  )
}

export async function getAllPages(): Promise<SanityListResponse<SanityPage>> {
  const result = await fetchFromSanity<SanityPage[]>(
    allPagesQuery,
    {},
    'pages:all',
    5 * 60 * 1000 // 5 minutes
  )

  return {
    ...result,
    data: result.data || [],
    total: result.data?.length || 0,
  }
}

// Section API functions
export async function getSectionByIdentifier(identifier: string): Promise<SanityApiResponse<SanitySection>> {
  return fetchFromSanity<SanitySection>(
    sectionByIdentifierQuery,
    { identifier },
    `section:${identifier}`,
    10 * 60 * 1000
  )
}

export async function getAllSections(): Promise<SanityListResponse<SanitySection>> {
  const result = await fetchFromSanity<SanitySection[]>(
    allSectionsQuery,
    {},
    'sections:all',
    5 * 60 * 1000
  )

  return {
    ...result,
    data: result.data || [],
    total: result.data?.length || 0,
  }
}

// Service API functions
export async function getAllServices(preview = false): Promise<SanityListResponse<SanityService>> {
  const result = await fetchFromSanity<SanityService[]>(
    allServicesQuery,
    {},
    preview ? undefined : 'services:all',
    10 * 60 * 1000,
    preview
  )

  return {
    ...result,
    data: result.data || [],
    total: result.data?.length || 0,
  }
}

export async function getServiceBySlug(slug: string, preview = false): Promise<SanityApiResponse<SanityService>> {
  return fetchFromSanity<SanityService>(
    serviceBySlugQuery,
    { slug },
    preview ? undefined : `service:${slug}`,
    15 * 60 * 1000,
    preview
  )
}

export async function getFeaturedServices(): Promise<SanityListResponse<SanityService>> {
  const result = await fetchFromSanity<SanityService[]>(
    featuredServicesQuery,
    {},
    'services:featured',
    10 * 60 * 1000
  )

  return {
    ...result,
    data: result.data || [],
    total: result.data?.length || 0,
  }
}

// Case Study API functions
export async function getAllCaseStudies(): Promise<SanityListResponse<SanityCaseStudy>> {
  const result = await fetchFromSanity<SanityCaseStudy[]>(
    allCaseStudiesQuery,
    {},
    'casestudies:all',
    10 * 60 * 1000
  )

  return {
    ...result,
    data: result.data || [],
    total: result.data?.length || 0,
  }
}

export async function getCaseStudyBySlug(slug: string): Promise<SanityApiResponse<SanityCaseStudy>> {
  return fetchFromSanity<SanityCaseStudy>(
    caseStudyBySlugQuery,
    { slug },
    `casestudy:${slug}`,
    15 * 60 * 1000
  )
}

export async function getFeaturedCaseStudies(): Promise<SanityListResponse<SanityCaseStudy>> {
  const result = await fetchFromSanity<SanityCaseStudy[]>(
    featuredCaseStudiesQuery,
    {},
    'casestudies:featured',
    10 * 60 * 1000
  )

  return {
    ...result,
    data: result.data || [],
    total: result.data?.length || 0,
  }
}

// FAQ API functions
export async function getAllFAQs(): Promise<SanityListResponse<SanityFAQ>> {
  const result = await fetchFromSanity<SanityFAQ[]>(
    allFAQsQuery,
    {},
    'faqs:all',
    15 * 60 * 1000
  )

  return {
    ...result,
    data: result.data || [],
    total: result.data?.length || 0,
  }
}

export async function getFAQsByCategory(category: string): Promise<SanityListResponse<SanityFAQ>> {
  const result = await fetchFromSanity<SanityFAQ[]>(
    faqsByCategoryQuery,
    { category },
    `faqs:${category}`,
    15 * 60 * 1000
  )

  return {
    ...result,
    data: result.data || [],
    total: result.data?.length || 0,
  }
}

export async function getFeaturedFAQs(): Promise<SanityListResponse<SanityFAQ>> {
  const result = await fetchFromSanity<SanityFAQ[]>(
    featuredFAQsQuery,
    {},
    'faqs:featured',
    10 * 60 * 1000
  )

  return {
    ...result,
    data: result.data || [],
    total: result.data?.length || 0,
  }
}

// Testimonial API functions
export async function getAllTestimonials(): Promise<SanityListResponse<SanityTestimonial>> {
  const result = await fetchFromSanity<SanityTestimonial[]>(
    allTestimonialsQuery,
    {},
    'testimonials:all',
    10 * 60 * 1000
  )

  return {
    ...result,
    data: result.data || [],
    total: result.data?.length || 0,
  }
}

export async function getFeaturedTestimonials(): Promise<SanityListResponse<SanityTestimonial>> {
  const result = await fetchFromSanity<SanityTestimonial[]>(
    featuredTestimonialsQuery,
    {},
    'testimonials:featured',
    8 * 60 * 1000
  )

  return {
    ...result,
    data: result.data || [],
    total: result.data?.length || 0,
  }
}

// Settings API functions
export async function getSiteSettings(): Promise<SanityApiResponse<SanitySettings>> {
  return fetchFromSanity<SanitySettings>(
    siteSettingsQuery,
    {},
    'settings:site',
    30 * 60 * 1000 // 30 minutes - settings change rarely
  )
}

// Blog API functions (existing, updated)
export async function getAllBlogs(preview = false): Promise<SanityListResponse<SanityBlogListItem>> {
  const result = await fetchFromSanity<SanityBlogListItem[]>(
    allBlogsQuery,
    {},
    preview ? undefined : 'blogs:all',
    5 * 60 * 1000,
    preview
  )

  return {
    ...result,
    data: result.data || [],
    total: result.data?.length || 0,
  }
}

export async function getBlogBySlug(slug: string, preview = false): Promise<SanityApiResponse<SanityBlogDetail>> {
  return fetchFromSanity<SanityBlogDetail>(
    blogBySlugQuery,
    { slug },
    preview ? undefined : `blog:${slug}`,
    10 * 60 * 1000,
    preview
  )
}

// Utility functions
export function clearCache(): void {
  cache.clear()
}

export async function preloadCriticalContent(): Promise<void> {
  // Preload critical content that's needed on most pages
  try {
    await Promise.all([
      getSiteSettings(),
      getFeaturedServices(),
      getFeaturedTestimonials(),
      getFeaturedCaseStudies(),
    ])
  } catch (error) {
    console.error('Error preloading critical content:', error)
  }
}

// Image URL helper (moved from sanity.client.ts)
export function urlForImage(image: any): string | null {
  if (!image?.asset?._ref) return null
  
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kvjr9xh2'
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  
  // Parse asset reference
  const [, id, dimensions, format] = image.asset._ref.split('-')
  if (!id || !dimensions || !format) return null
  
  // Build image URL
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`
}

// Fallback content for when Sanity is unavailable
export const fallbackContent: ContentFallbacks = {
  hero: {
    heading: 'Building Everything. Empowering Everyone.',
    subheading: 'OmniStack Solutions designs and builds scalable websites, applications, AI systems, and cloud infrastructure for modern businesses.',
    ctaButtons: [
      { text: 'Get Started', link: '/contact', style: 'primary' },
      { text: 'View Our Work', link: '/projects', style: 'secondary' },
    ],
  },
  services: [],
  caseStudies: [],
  faqs: [],
  testimonials: [],
}

// Content fetching with automatic fallback
export async function getContentWithFallback<T>(
  fetchFunction: () => Promise<SanityApiResponse<T> | SanityListResponse<T>>,
  fallback: T
): Promise<T> {
  try {
    const result = await fetchFunction()
    return (result.success && result.data ? result.data : fallback) as T
  } catch (error) {
    console.error('Content fetch failed, using fallback:', error)
    return fallback
  }
}