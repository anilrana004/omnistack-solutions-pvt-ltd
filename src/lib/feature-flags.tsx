import type { SanitySettings } from './sanity.types'
import { getSiteSettings } from './sanity.api'
import React from 'react'

// Default feature flags (fallback when CMS is unavailable)
const DEFAULT_FEATURE_FLAGS = {
  showBlogs: true,
  showCareers: false,
  showTestimonials: true,
  showPortfolio: true,
  enableChatbot: false,
  enableNewsletter: false,
  enableWhatsApp: true,
  enableInstagramFeed: true,
  showPricing: true,
  enableContactForm: true,
}

// Feature flag manager
export class FeatureFlagManager {
  private flags: SanitySettings['featureFlags'] = DEFAULT_FEATURE_FLAGS
  private lastFetch = 0
  private cacheTTL = 60 * 1000 // 1 minute

  constructor(initialFlags?: SanitySettings['featureFlags']) {
    if (initialFlags) {
      this.flags = { ...DEFAULT_FEATURE_FLAGS, ...initialFlags }
    }
  }

  // Check if a feature is enabled
  isEnabled(feature: keyof typeof DEFAULT_FEATURE_FLAGS): boolean {
    return this.flags?.[feature] ?? DEFAULT_FEATURE_FLAGS[feature]
  }

  // Get all feature flags
  getAllFlags(): typeof DEFAULT_FEATURE_FLAGS {
    return { ...DEFAULT_FEATURE_FLAGS, ...this.flags }
  }

  // Update flags from CMS (with caching)
  async updateFromCMS(force = false): Promise<void> {
    const now = Date.now()
    
    // Skip if recently fetched and not forced
    if (!force && now - this.lastFetch < this.cacheTTL) {
      return
    }

    try {
      const settingsResult = await getSiteSettings()
      if (settingsResult.success && settingsResult.data?.featureFlags) {
        this.flags = { ...DEFAULT_FEATURE_FLAGS, ...settingsResult.data.featureFlags }
        this.lastFetch = now
      }
    } catch (error) {
      console.error('Failed to fetch feature flags:', error)
      // Keep existing flags on error
    }
  }

  // Set flags manually (for testing/development)
  setFlags(newFlags: Partial<typeof DEFAULT_FEATURE_FLAGS>): void {
    this.flags = { ...this.flags, ...newFlags } as typeof DEFAULT_FEATURE_FLAGS
  }

  // Reset to defaults
  reset(): void {
    this.flags = { ...DEFAULT_FEATURE_FLAGS }
    this.lastFetch = 0
  }
}

// Global feature flag manager instance
export const featureFlags = new FeatureFlagManager()

// Convenience functions for common checks
export async function shouldShowSection(
  sectionName: keyof typeof DEFAULT_FEATURE_FLAGS
): Promise<boolean> {
  await featureFlags.updateFromCMS()
  return featureFlags.isEnabled(sectionName)
}

// React hook for feature flags (client-side)
export function useFeatureFlag(
  feature: keyof typeof DEFAULT_FEATURE_FLAGS,
  initialValue?: boolean
): boolean {
  // For client components, we can use the initial value passed from server
  // or fall back to defaults
  return initialValue ?? DEFAULT_FEATURE_FLAGS[feature]
}

// Server-side feature flag checking
export async function getFeatureFlags(): Promise<typeof DEFAULT_FEATURE_FLAGS> {
  try {
    const settingsResult = await getSiteSettings()
    if (settingsResult.success && settingsResult.data?.featureFlags) {
      return { ...DEFAULT_FEATURE_FLAGS, ...settingsResult.data.featureFlags }
    }
  } catch (error) {
    console.error('Failed to fetch feature flags, using defaults:', error)
  }
  
  return DEFAULT_FEATURE_FLAGS
}

// Component wrapper for feature-flagged content
export async function FeatureGate({
  feature,
  children,
  fallback = null,
}: {
  feature: keyof typeof DEFAULT_FEATURE_FLAGS
  children: React.ReactNode
  fallback?: React.ReactNode
}): Promise<JSX.Element | null> {
  const isEnabled = await shouldShowSection(feature)
  
  if (isEnabled) {
    return <>{children}</>
  }
  
  return <>{fallback}</>
}

// Middleware for feature flag validation
export function withFeatureFlag<T extends Record<string, any>>(
  feature: keyof typeof DEFAULT_FEATURE_FLAGS,
  handler: (params: T) => Promise<any>,
  fallbackHandler?: (params: T) => Promise<any>
) {
  return async (params: T) => {
    const isEnabled = await shouldShowSection(feature)
    
    if (isEnabled) {
      return handler(params)
    }
    
    if (fallbackHandler) {
      return fallbackHandler(params)
    }
    
    // Default 404 response for disabled features
    return new Response('Feature not available', { status: 404 })
  }
}

// Build-time feature flag validation
export function validateFeatureFlags(flags: any): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  if (!flags) {
    warnings.push('No feature flags configured, using defaults')
    return { valid: true, errors, warnings }
  }

  // Validate each flag is boolean
  Object.entries(DEFAULT_FEATURE_FLAGS).forEach(([key, defaultValue]) => {
    if (key in flags && typeof flags[key] !== 'boolean') {
      errors.push(`Feature flag '${key}' must be boolean, got ${typeof flags[key]}`)
    }
  })

  // Check for potentially problematic combinations
  if (flags.showBlogs === false && flags.enableNewsletter === true) {
    warnings.push('Newsletter is enabled but blogs are disabled - consider disabling newsletter too')
  }

  if (flags.enableContactForm === false && flags.enableWhatsApp === false) {
    warnings.push('All contact methods are disabled - users cannot reach you')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

// Export types for external use
export type FeatureFlag = keyof typeof DEFAULT_FEATURE_FLAGS
export type FeatureFlagConfig = typeof DEFAULT_FEATURE_FLAGS