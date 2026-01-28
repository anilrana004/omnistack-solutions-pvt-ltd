# Debugging System Documentation

## Overview

A comprehensive, production-safe debugging system has been implemented across the Next.js application. All debugging features are designed to work seamlessly in both development and production environments.

## Components

### 1. Global Error Handling

**File:** `app/error.tsx`

- Catches unhandled errors in the application
- Displays user-friendly error page (500)
- Logs full error details server-side
- Shows error details in development mode only
- Production-safe (no sensitive data exposed)

**Usage:** Automatically catches errors. No manual setup required.

### 2. Not Found Handling

**File:** `app/not-found.tsx`

- Displays when routes don't exist
- Used when CMS content is not found (via `notFound()`)
- Clean 404 UI with navigation links

**Usage:** Automatically used by Next.js. Call `notFound()` from `next/navigation` in pages.

### 3. Structured Logger

**File:** `src/lib/logger.ts`

Provides consistent logging across the application:

```typescript
import { logger } from '@/src/lib/logger'

// Server-side (always logged)
logger.info('Operation completed', { userId: 123 })
logger.error('API Error', error, { route: '/api/contact' })

// Client-side (development only)
logger.dev('Component rendered', { props })

// API-specific
logger.apiError('/api/contact', error, { context })

// Sanity-specific
logger.sanityError('fetchBlogs', error, { query })
```

**Features:**
- Development-only client-side logs
- Always-on server-side logs (appear in Vercel Functions logs)
- Automatic sanitization of sensitive data (tokens, passwords, etc.)
- Structured JSON output for easy parsing

### 4. Environment Variable Validation

**File:** `src/lib/env-validation.ts`

Validates environment variables on server startup:

```typescript
import { validateAndLog, hasEnvVar, getEnvVar } from '@/src/lib/env-validation'

// Validate all variables
const result = validateAndLog()

// Check specific variable
if (hasEnvVar('SANITY_API_TOKEN')) {
  // Use token
}

// Get with fallback
const projectId = getEnvVar('NEXT_PUBLIC_SANITY_PROJECT_ID', 'fallback')
```

**Validated Variables:**
- Required: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN`
- Optional: `SANITY_PREVIEW_SECRET`, SMTP vars, Instagram API vars

### 5. API Route Error Handling

All API routes now include:
- Try/catch blocks wrapping all operations
- Structured error logging with route context
- Proper HTTP status codes
- User-friendly error messages (no sensitive data)

**Example:**
```typescript
export async function POST(req: NextRequest) {
  try {
    // Your code
  } catch (error) {
    logger.apiError('/api/contact', error, { context })
    return NextResponse.json(
      { error: 'User-friendly message' },
      { status: 500 }
    )
  }
}
```

**Updated Routes:**
- `/api/contact` - Contact form submission
- `/api/instagram` - Instagram feed
- `/api/feedback` - Testimonials
- `/api/revalidate` - Cache revalidation
- `/api/preview` - Preview mode (already had error handling)

### 6. Sanity CMS Debugging

**Enhanced in:** `src/lib/sanity.api.ts`

- Logs all Sanity fetch operations (development)
- Detects and logs empty responses
- Logs query errors with context (query preview, params)
- Validates environment variables on client initialization
- Graceful fallback when CMS data is unavailable

**Logs Include:**
- Preview mode status
- Query information (first 200 chars)
- Error codes and messages
- Parameter keys (not values, for security)

### 7. Build-Time Validation

**File:** `scripts/validate-build.js`

Runs automatically before `npm run build`:

```bash
npm run build  # Automatically runs validate-build.js first
```

**Checks:**
- Required environment variables are set
- Token format validation (SANITY_API_TOKEN starts with "sk")
- Warns about missing optional variables

**Manual Run:**
```bash
npm run validate:build
```

### 8. Runtime Environment Validation

**File:** `app/layout.tsx`

- Validates environment variables on every server render
- Logs warnings for missing optional vars
- Doesn't crash for optional variables
- Critical validation happens at build time

## Where to Check Logs

### Local Development

**Server-side logs:**
- Terminal/console where `npm run dev` is running
- All `logger.*` calls appear here

**Client-side logs:**
- Browser console (development only)
- Only `logger.dev()` calls appear here

### Production (Vercel)

**Server-side logs:**
1. Go to Vercel Dashboard
2. Select your project
3. Click "Functions" tab
4. Click on any function to see logs
5. Or use Vercel CLI: `vercel logs`

**Client-side logs:**
- No logs appear in production (by design)
- Only errors are logged to error tracking services

## Error Types

### 1. Global Errors
- Caught by `app/error.tsx`
- Unhandled React errors
- Server component errors

### 2. API Errors
- Caught by try/catch in API routes
- Logged with `logger.apiError()`
- Return structured JSON responses

### 3. Sanity Errors
- Caught in `fetchFromSanity()`
- Logged with `logger.sanityError()`
- Return error objects in API responses

### 4. Not Found Errors
- Handled by `app/not-found.tsx`
- Triggered by `notFound()` from `next/navigation`

## Best Practices

### 1. Always Use Try/Catch in API Routes

```typescript
export async function POST(req: NextRequest) {
  try {
    // Your code
  } catch (error) {
    logger.apiError('/api/route', error)
    return NextResponse.json({ error: 'Message' }, { status: 500 })
  }
}
```

### 2. Log with Context

```typescript
// Good
logger.error('Failed to send email', error, { userId, email })

// Bad
logger.error('Failed', error)
```

### 3. Never Log Sensitive Data

The logger automatically sanitizes:
- `password`, `token`, `secret`, `apiKey`, `authorization`, `cookie`

But still be careful:
```typescript
// Good
logger.info('User logged in', { userId: user.id })

// Bad
logger.info('User logged in', { user }) // Might include sensitive fields
```

### 4. Use Appropriate Log Levels

- `logger.debug()` - Development-only detailed info
- `logger.info()` - General information
- `logger.warn()` - Warnings (missing optional config, etc.)
- `logger.error()` - Errors that need attention
- `logger.dev()` - Client-side development logs

## Troubleshooting

### Build Fails with "Missing required environment variables"

**Solution:**
1. Check `.env.local` file exists
2. Ensure all required variables are set:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_TOKEN`
3. Run `npm run validate:build` to see specific errors

### No Logs Appearing in Vercel

**Check:**
1. Logs are server-side only (API routes, server components)
2. Client-side logs only appear in development
3. Check Vercel Functions tab for server logs
4. Ensure `logger.*` calls are in server-side code

### Sanity Errors Not Showing Details

**Solution:**
- Check Vercel Functions logs (not browser console)
- Sanity errors are logged server-side
- Use `logger.sanityError()` for better context

## Files Modified/Created

### Created:
- `app/error.tsx` - Global error boundary
- `app/not-found.tsx` - 404 page
- `src/lib/logger.ts` - Structured logger utility
- `src/lib/env-validation.ts` - Environment variable validation
- `scripts/validate-build.js` - Build-time validation
- `DEBUGGING-SYSTEM.md` - This documentation

### Modified:
- `app/layout.tsx` - Added env validation on startup
- `app/api/contact/route.ts` - Enhanced error handling
- `app/api/instagram/route.ts` - Enhanced error handling
- `app/api/feedback/route.ts` - Enhanced error handling
- `app/api/revalidate/route.ts` - Enhanced error handling
- `src/lib/sanity.api.ts` - Added logging and debugging
- `src/lib/sanity.client.ts` - Added env validation warnings
- `package.json` - Added prebuild validation script

## Production Safety

✅ **No sensitive data exposed:**
- Tokens never logged
- Secrets automatically sanitized
- Error messages are user-friendly

✅ **Performance:**
- Client-side logs disabled in production
- Server logs are structured and efficient
- No impact on bundle size

✅ **Scalability:**
- Logs work in Vercel Functions
- Structured format for log aggregation
- Easy to integrate with monitoring services

## Next Steps

1. **Deploy to Vercel:**
   - Set environment variables in Vercel dashboard
   - Build will validate automatically
   - Check Functions logs for debugging

2. **Monitor in Production:**
   - Use Vercel's built-in logging
   - Consider integrating with Sentry or similar
   - Set up alerts for error rates

3. **Customize:**
   - Add more specific error handling as needed
   - Extend logger with custom methods
   - Add more environment variable checks

---

**The debugging system is production-ready and fully integrated!** 🚀