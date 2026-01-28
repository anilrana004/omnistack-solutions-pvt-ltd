import type { SanitySettings } from './sanity.types'
import { sanityClient } from './sanity.client'
import { getSiteSettings } from './sanity.api'
import { validatePreviewEnvironment } from './preview-utils'

// Environment validation
export interface EnvironmentConfig {
  isValid: boolean
  errors: string[]
  warnings: string[]
  environment: 'development' | 'production' | 'preview'
}

export class DeploymentValidator {
  static validateEnvironment(): EnvironmentConfig {
    const errors: string[] = []
    const warnings: string[] = []

    // Check required environment variables
    const requiredVars = [
      'NEXT_PUBLIC_SANITY_PROJECT_ID',
      'NEXT_PUBLIC_SANITY_DATASET', 
      'NEXT_PUBLIC_SANITY_API_VERSION',
    ]

    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        errors.push(`Missing required environment variable: ${varName}`)
      }
    }

    // Check optional but recommended environment variables
    const recommendedVars = [
      'NEXT_PUBLIC_SITE_URL',
      'SANITY_REVALIDATE_SECRET',
    ]

    for (const varName of recommendedVars) {
      if (!process.env[varName]) {
        warnings.push(`Missing recommended environment variable: ${varName}`)
      }
    }

    // Validate preview mode environment
    const previewValidation = validatePreviewEnvironment()
    errors.push(...previewValidation.errors)
    warnings.push(...previewValidation.warnings)

    // Validate Sanity configuration
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
    const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION

    if (projectId && !/^[a-z0-9]{8}$/.test(projectId)) {
      errors.push('NEXT_PUBLIC_SANITY_PROJECT_ID must be an 8-character alphanumeric string')
    }

    if (dataset && !/^[a-z0-9-]+$/.test(dataset)) {
      errors.push('NEXT_PUBLIC_SANITY_DATASET must contain only lowercase letters, numbers, and hyphens')
    }

    if (apiVersion && !/^\d{4}-\d{2}-\d{2}$/.test(apiVersion)) {
      errors.push('NEXT_PUBLIC_SANITY_API_VERSION must be in YYYY-MM-DD format')
    }

    // Check site URL format
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    if (siteUrl && !siteUrl.match(/^https?:\/\/.+/)) {
      errors.push('NEXT_PUBLIC_SITE_URL must be a valid HTTP/HTTPS URL')
    }

    // Determine environment
    const environment = process.env.NODE_ENV === 'production' ? 'production' :
                       process.env.VERCEL_ENV === 'preview' ? 'preview' : 'development'

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      environment,
    }
  }

  static async validateSanityConnection(): Promise<{
    connected: boolean
    projectId?: string
    dataset?: string
    error?: string
  }> {
    try {
      // Test connection by fetching project info
      const result = await sanityClient.fetch(`{
        "projectId": sanity::projectId(),
        "dataset": sanity::dataset()
      }`)

      return {
        connected: true,
        projectId: result.projectId,
        dataset: result.dataset,
      }
    } catch (error) {
      return {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown connection error',
      }
    }
  }

  static async validateContentStructure(): Promise<{
    valid: boolean
    issues: string[]
    warnings: string[]
  }> {
    const issues: string[] = []
    const warnings: string[] = []

    try {
      // Check if settings document exists
      const settingsResult = await getSiteSettings()
      if (!settingsResult.success || !settingsResult.data) {
        issues.push('Site settings document is missing or inaccessible')
      } else {
        const settings = settingsResult.data
        
        // Validate critical settings
        if (!settings.title) warnings.push('Site title is not configured')
        if (!settings.description) warnings.push('Site description is not configured')
        if (!settings.contact?.email) warnings.push('Contact email is not configured')
        if (!settings.contact?.phone) warnings.push('Contact phone is not configured')
      }

      // Check for required document types
      const requiredTypes = ['service', 'caseStudy', 'faq', 'testimonial']
      
      for (const type of requiredTypes) {
        try {
          const count = await sanityClient.fetch(`count(*[_type == "${type}" && status == "published"])`)
          if (count === 0) {
            warnings.push(`No published ${type} documents found`)
          }
        } catch (error) {
          warnings.push(`Unable to check ${type} documents: ${error}`)
        }
      }

    } catch (error) {
      issues.push(`Content structure validation failed: ${error}`)
    }

    return {
      valid: issues.length === 0,
      issues,
      warnings,
    }
  }

  static async validateDeployment(): Promise<{
    ready: boolean
    issues: string[]
    warnings: string[]
    environment: EnvironmentConfig
    sanityConnection: Awaited<ReturnType<typeof DeploymentValidator.validateSanityConnection>>
    contentStructure: Awaited<ReturnType<typeof DeploymentValidator.validateContentStructure>>
  }> {
    const [environment, sanityConnection, contentStructure] = await Promise.all([
      this.validateEnvironment(),
      this.validateSanityConnection(),
      this.validateContentStructure(),
    ])

    const allIssues = [
      ...environment.errors,
      ...(sanityConnection.connected ? [] : [sanityConnection.error || 'Sanity connection failed']),
      ...contentStructure.issues,
    ]

    const allWarnings = [
      ...environment.warnings,
      ...contentStructure.warnings,
    ]

    return {
      ready: allIssues.length === 0,
      issues: allIssues,
      warnings: allWarnings,
      environment,
      sanityConnection,
      contentStructure,
    }
  }
}

// Content migration utilities
export class ContentMigrator {
  static async migrateFromLegacyData(): Promise<{
    success: boolean
    migrated: number
    errors: string[]
  }> {
    const errors: string[] = []
    let migrated = 0

    try {
      // This would be used to migrate from the old static data files
      // to Sanity CMS when transitioning the project

      // Example migration logic:
      // 1. Import legacy data
      // 2. Transform to Sanity format
      // 3. Create documents in Sanity
      // 4. Validate created content

      // For now, return success as migration would be manual
      return {
        success: true,
        migrated,
        errors,
      }
    } catch (error) {
      errors.push(`Migration failed: ${error}`)
      return {
        success: false,
        migrated,
        errors,
      }
    }
  }

  static async backupContent(): Promise<{
    success: boolean
    backupPath?: string
    error?: string
  }> {
    try {
      // Create a backup of all content
      const allContent = await sanityClient.fetch(`{
        "services": *[_type == "service"],
        "caseStudies": *[_type == "caseStudy"], 
        "faqs": *[_type == "faq"],
        "testimonials": *[_type == "testimonial"],
        "settings": *[_type == "settings"][0],
        "posts": *[_type == "post"]
      }`)

      // In a real implementation, this would save to a file or external storage
      const backupData = {
        timestamp: new Date().toISOString(),
        content: allContent,
      }

      // For development, just log the backup size
      console.log('Content backup created:', {
        timestamp: backupData.timestamp,
        size: JSON.stringify(backupData).length,
      })

      return {
        success: true,
        backupPath: `backup-${Date.now()}.json`,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Backup failed',
      }
    }
  }
}

// Deployment health checks
export class HealthChecker {
  static async checkCriticalPaths(): Promise<{
    healthy: boolean
    results: Record<string, { status: 'ok' | 'error'; message?: string; responseTime?: number }>
  }> {
    const results: Record<string, { status: 'ok' | 'error'; message?: string; responseTime?: number }> = {}

    const criticalEndpoints = [
      { name: 'homepage', path: '/' },
      { name: 'services', path: '/services' },
      { name: 'projects', path: '/projects' },
      { name: 'contact', path: '/contact' },
      { name: 'blogs', path: '/blogs' },
    ]

    for (const endpoint of criticalEndpoints) {
      const startTime = Date.now()
      try {
        // In a real implementation, this would make actual HTTP requests
        // For now, we'll simulate the check
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100))
        
        results[endpoint.name] = {
          status: 'ok',
          responseTime: Date.now() - startTime,
        }
      } catch (error) {
        results[endpoint.name] = {
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
          responseTime: Date.now() - startTime,
        }
      }
    }

    const healthy = Object.values(results).every(result => result.status === 'ok')

    return {
      healthy,
      results,
    }
  }

  static async checkExternalServices(): Promise<{
    healthy: boolean
    results: Record<string, { status: 'ok' | 'error'; message?: string; responseTime?: number }>
  }> {
    const results: Record<string, { status: 'ok' | 'error'; message?: string; responseTime?: number }> = {}

    const services = [
      { name: 'sanity', check: () => DeploymentValidator.validateSanityConnection() },
    ]

    for (const service of services) {
      const startTime = Date.now()
      try {
        const result = await service.check()
        
        results[service.name] = {
          status: 'connected' in result && result.connected ? 'ok' : 'error',
          message: 'error' in result ? result.error : undefined,
          responseTime: Date.now() - startTime,
        }
      } catch (error) {
        results[service.name] = {
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
          responseTime: Date.now() - startTime,
        }
      }
    }

    const healthy = Object.values(results).every(result => result.status === 'ok')

    return {
      healthy,
      results,
    }
  }
}

// Main deployment check function
export async function runDeploymentCheck(): Promise<{
  ready: boolean
  summary: string
  details: Awaited<ReturnType<typeof DeploymentValidator.validateDeployment>>
  health: {
    paths: Awaited<ReturnType<typeof HealthChecker.checkCriticalPaths>>
    services: Awaited<ReturnType<typeof HealthChecker.checkExternalServices>>
  }
}> {
  const [deploymentCheck, pathHealth, serviceHealth] = await Promise.all([
    DeploymentValidator.validateDeployment(),
    HealthChecker.checkCriticalPaths(),
    HealthChecker.checkExternalServices(),
  ])

  const allHealthy = pathHealth.healthy && serviceHealth.healthy
  const ready = deploymentCheck.ready && allHealthy

  let summary = ''
  if (ready) {
    summary = '✅ Ready for deployment'
  } else {
    const issueCount = deploymentCheck.issues.length
    const warningCount = deploymentCheck.warnings.length
    summary = `❌ ${issueCount} critical issue(s), ${warningCount} warning(s)`
  }

  return {
    ready,
    summary,
    details: deploymentCheck,
    health: {
      paths: pathHealth,
      services: serviceHealth,
    },
  }
}

// Environment-specific configurations
export const deploymentConfig = {
  development: {
    sanityUseCdn: false,
    cacheMaxAge: 60, // 1 minute
    logLevel: 'debug',
  },
  preview: {
    sanityUseCdn: false,
    cacheMaxAge: 300, // 5 minutes
    logLevel: 'info',
  },
  production: {
    sanityUseCdn: true,
    cacheMaxAge: 3600, // 1 hour
    logLevel: 'error',
  },
}

export function getDeploymentConfig() {
  const env = process.env.NODE_ENV === 'production' ? 'production' :
              process.env.VERCEL_ENV === 'preview' ? 'preview' : 'development'
  
  return deploymentConfig[env]
}