#!/usr/bin/env node

/**
 * Build-Time Validation Script
 * 
 * Validates critical environment variables before build.
 * This script runs during `npm run build` to catch configuration issues early.
 * 
 * Usage:
 *   node scripts/validate-build.js
 * 
 * This is automatically called in package.json before build.
 */

/**
 * Note: Next.js automatically loads .env.local and .env files.
 * This script runs in Node.js context, so we need to manually load env vars.
 * We use a simple file read approach to avoid requiring dotenv as a dependency.
 */

const fs = require('fs')
const path = require('path')

// Simple .env file parser (no external dependencies)
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {}
  
  const content = fs.readFileSync(filePath, 'utf-8')
  const env = {}
  
  content.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const match = trimmed.match(/^([^=]+)=(.*)$/)
      if (match) {
        const key = match[1].trim()
        let value = match[2].trim()
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        }
        env[key] = value
      }
    }
  })
  
  return env
}

// Load environment variables
const envLocal = loadEnvFile(path.join(__dirname, '../.env.local'))
const env = loadEnvFile(path.join(__dirname, '../.env'))

// Merge into process.env (env.local takes precedence)
Object.assign(process.env, env, envLocal)

function validateBuild() {
  console.log('🔍 Validating environment for build...\n')

  const errors = []
  const warnings = []

  // Required environment variables
  const required = [
    {
      name: 'NEXT_PUBLIC_SANITY_PROJECT_ID',
      description: 'Sanity project ID',
      validate: (v) => v && v.length > 0,
    },
    {
      name: 'NEXT_PUBLIC_SANITY_DATASET',
      description: 'Sanity dataset name',
      validate: (v) => v && v.length > 0,
    },
    {
      name: 'SANITY_API_TOKEN',
      description: 'Sanity API token',
      validate: (v) => v && v.startsWith('sk'),
      errorMessage: 'SANITY_API_TOKEN should start with "sk"',
    },
  ]

  // Check required variables
  for (const config of required) {
    const value = process.env[config.name]

    if (!value || !config.validate(value)) {
      const message = config.errorMessage || `Missing required: ${config.name} - ${config.description}`
      errors.push(message)
    }
  }

  // Optional but recommended
  const optional = [
    {
      name: 'SANITY_PREVIEW_SECRET',
      description: 'Preview mode secret',
    },
    {
      name: 'SMTP_HOST',
      description: 'SMTP host (required for contact form)',
    },
    {
      name: 'SMTP_USER',
      description: 'SMTP username (required for contact form)',
    },
    {
      name: 'SMTP_PASS',
      description: 'SMTP password (required for contact form)',
    },
  ]

  for (const config of optional) {
    const value = process.env[config.name]
    if (!value || value.trim() === '') {
      warnings.push(`Missing optional: ${config.name} - ${config.description}`)
    }
  }

  // Print results
  if (warnings.length > 0) {
    console.log('⚠️  Warnings (non-critical):')
    warnings.forEach(w => console.log(`   ${w}`))
    console.log('')
  }

  if (errors.length > 0) {
    console.error('❌ Build validation failed:\n')
    errors.forEach(e => console.error(`   ${e}`))
    console.error('\n💡 Please set these variables in .env.local or your deployment platform.')
    console.error('   See .env.local.example for reference.\n')
    process.exit(1)
  }

  console.log('✅ Build validation passed!\n')
  process.exit(0)
}

// Run validation
try {
  validateBuild()
} catch (error) {
  console.error('❌ Validation script error:', error.message)
  process.exit(1)
}