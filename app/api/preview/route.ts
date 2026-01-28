import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Sanity Preview Mode API Route
 * 
 * This route enables/disables preview mode for viewing draft content.
 * 
 * Security:
 * - Uses SANITY_PREVIEW_SECRET (from .env.local) to validate requests
 * - Sets httpOnly cookie to prevent client-side access
 * - Token is server-only, never exposed to client
 * 
 * Usage:
 * - Enable: POST /api/preview?secret=YOUR_SECRET&slug=/blogs/my-post
 * - Disable: DELETE /api/preview
 * - Status: GET /api/preview
 */

// Load preview secret from environment (server-only, never exposed to client)
const PREVIEW_SECRET = process.env.SANITY_PREVIEW_SECRET

// Enable preview mode
export async function POST(req: NextRequest) {
  try {
    // Get secret from request body or query params
    const { secret, slug } = await req.json().catch(() => ({}))
    const url = new URL(req.url)
    const querySecret = url.searchParams.get('secret')
    const querySlug = url.searchParams.get('slug')
    
    // Use secret from body or query params
    const providedSecret = secret || querySecret
    const redirectSlug = slug || querySlug || '/'

    // Validate secret exists in environment
    if (!PREVIEW_SECRET) {
      console.error('SANITY_PREVIEW_SECRET not configured')
      return NextResponse.json(
        { error: 'Preview mode not configured' },
        { status: 500 }
      )
    }

    // Verify the provided secret matches environment secret
    if (providedSecret !== PREVIEW_SECRET) {
      return NextResponse.json(
        { error: 'Invalid preview secret' },
        { status: 401 }
      )
    }

    // Create response (will redirect if slug provided, otherwise JSON)
    const response = redirectSlug && redirectSlug !== '/'
      ? NextResponse.redirect(new URL(redirectSlug, req.url))
      : NextResponse.json({ success: true, preview: true })

    // Set preview cookie (httpOnly prevents client-side access)
    // This cookie is checked server-side to enable draft content fetching
    response.cookies.set('__sanity_preview', 'true', {
      httpOnly: true, // Prevents JavaScript access (security)
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax', // CSRF protection
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Preview enable error:', error)
    return NextResponse.json(
      { error: 'Failed to enable preview mode' },
      { status: 500 }
    )
  }
}

// Disable preview mode
export async function DELETE(req: NextRequest) {
  try {
    const response = NextResponse.json({ success: true, preview: false })

    // Clear preview cookie to disable draft content access
    response.cookies.delete('__sanity_preview')

    return response
  } catch (error) {
    console.error('Preview disable error:', error)
    return NextResponse.json(
      { error: 'Failed to disable preview mode' },
      { status: 500 }
    )
  }
}

// Get preview status (does not require authentication)
export async function GET(req: NextRequest) {
  const isPreview = req.cookies.get('__sanity_preview')?.value === 'true'
  
  return NextResponse.json({
    preview: isPreview,
    message: isPreview ? 'Preview mode is enabled' : 'Preview mode is disabled',
  })
}