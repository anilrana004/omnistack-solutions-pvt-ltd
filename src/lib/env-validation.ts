/**
 * Environment Variable Validation
 * 
 * Validates required and optional environment variables on server startup.
 * Logs warnings for missing optional vars, errors for missing required vars.
 * 
 * This runs during build and at runtime to catch configuration issues early.
 */

import { logger } from './logger'

interface EnvVarConfig {
  name: string
  required: boolean
  description: string
  validate?: (value: string) => boolean
  errorMessage?: string
}

// Define all environment variables
const ENV_VARS: EnvVarConfig[] = [
  // Required Sanity variables
  {
    name: 'NEXT_PUBLIC_SANITY_PROJECT_ID',
    required: true,
    description: 'Sanity project ID',
    validate: (v) => v.length > 0,
  },
  {
    name: 'NEXT_PUBLIC_SANITY_DATASET',
    required: true,
    description: 'Sanity dataset name',
    validate: (v) => v.length > 0,
  },
  {
    name: 'SANITY_API_TOKEN',
    required: true,
    description: 'Sanity API token for authenticated requests',
    validate: (v) => v.startsWith('sk'),
    errorMessage: 'SANITY_API_TOKEN should start with "sk"',
  },
  // Optional Sanity variables
  {
    name: 'SANITY_PREVIEW_SECRET',
    required: false,
    description: 'Secret for preview mode authentication',
  },
  {
    name: 'NEXT_PUBLIC_SANITY_API_VERSION',
    required: false,
    description: 'Sanity API version',
  },
  // SMTP variables (optional, but required if using contact form)
  {
    name: 'SMTP_HOST',
    required: false,
    description: 'SMTP server hostname',
  },
  {
    name: 'SMTP_PORT',
    required: false,
    description: 'SMTP server port',
  },
  {
    name: 'SMTP_USER',
    required: false,
    description: 'SMTP username',
  },
  {
    name: 'SMTP_PASS',
    required: false,
    description: 'SMTP password',
  },
  {
    name: 'ADMIN_EMAIL',
    required: false,
    description: 'Admin email for contact form',
  },
  // Instagram API (optional)
  {
    name: 'IG_LONG_LIVED_ACCESS_TOKEN',
    required: false,
    description: 'Instagram long-lived access token',
  },
  {
    name: 'IG_BUSINESS_ID',
    required: false,
    description: 'Instagram business account ID',
  },
  // Site configuration
  {
    name: 'NEXT_PUBLIC_SITE_URL',
    required: false,
    description: 'Public site URL for SEO',
  },
]

interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  missing: string[]
}

/**
 * Validate all environment variables
 */
export function validateEnvironment(): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const missing: string[] = []

  for (const config of ENV_VARS) {
    const value = process.env[config.name]

    if (!value || value.trim() === '') {
      if (config.required) {
        errors.push(`Missing required: ${config.name} - ${config.description}`)
        missing.push(config.name)
      } else {
        warnings.push(`Missing optional: ${config.name} - ${config.description}`)
      }
      continue
    }

    // Run custom validation if provided
    if (config.validate && !config.validate(value)) {
      const message = config.errorMessage || `Invalid format: ${config.name}`
      if (config.required) {
        errors.push(message)
      } else {
        warnings.push(message)
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    missing,
  }
}

/**
 * Log validation results
 */
export function logValidationResults(result: ValidationResult): void {
  if (result.errors.length > 0) {
    logger.error('Environment validation failed', undefined, {
      errors: result.errors,
      missing: result.missing,
    })
  }

  if (result.warnings.length > 0) {
    logger.warn('Environment validation warnings', {
      warnings: result.warnings,
    })
  }

  if (result.valid && result.warnings.length === 0) {
    logger.info('Environment validation passed')
  }
}

/**
 * Validate and log (convenience function)
 */
export function validateAndLog(): ValidationResult {
  const result = validateEnvironment()
  logValidationResults(result)
  return result
}

/**
 * Check if specific variable is set
 */
export function hasEnvVar(name: string): boolean {
  const value = process.env[name]
  return !!value && value.trim() !== ''
}

/**
 * Get environment variable with fallback
 */
export function getEnvVar(name: string, fallback?: string): string {
  const value = process.env[name]
  return value?.trim() || fallback || ''
}

/**
 * Validate environment for build (throws on critical errors)
 */
export function validateForBuild(): void {
  const result = validateEnvironment()
  
  if (!result.valid) {
    const errorMessage = [
      '❌ Build failed: Missing required environment variables',
      '',
      'Errors:',
      ...result.errors.map(e => `  - ${e}`),
      '',
      'Please set these variables in .env.local or your deployment platform.',
      'See .env.local.example for reference.',
    ].join('\n')

    throw new Error(errorMessage)
  }

  if (result.warnings.length > 0) {
    console.warn('\n⚠️  Build warnings (non-critical):')
    result.warnings.forEach(w => console.warn(`  - ${w}`))
    console.warn('')
  }
}