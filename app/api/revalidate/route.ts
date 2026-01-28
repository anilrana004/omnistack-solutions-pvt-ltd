import {NextResponse} from 'next/server'
import {revalidatePath} from 'next/cache'
import { logger } from '@/src/lib/logger'

export const runtime = 'nodejs'

function isAuthorized(req: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) return false

  const url = new URL(req.url)
  const querySecret = url.searchParams.get('secret')
  const headerSecret = req.headers.get('x-revalidate-secret')
  return querySecret === secret || headerSecret === secret
}

export async function POST(req: Request) {
  try {
    if (!isAuthorized(req)) {
      logger.warn('Unauthorized revalidate attempt', {
        hasSecret: !!process.env.SANITY_REVALIDATE_SECRET,
      });
      return NextResponse.json({ok: false, error: 'unauthorized'}, {status: 401})
    }

    let slug: string | null = null
    try {
      const body = (await req.json()) as {slug?: unknown}
      slug = typeof body?.slug === 'string' ? body.slug : null
    } catch (error) {
      logger.warn('Invalid JSON in revalidate request', { error: String(error) })
    }

    // Revalidate listing + individual post when possible
    revalidatePath('/blogs')
    if (slug) revalidatePath(`/blogs/${slug}`)

    logger.info('Cache revalidated', { slug })
    return NextResponse.json({ok: true, revalidated: true, slug})
  } catch (error) {
    logger.apiError('/api/revalidate', error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      {ok: false, error: 'Internal server error'},
      {status: 500}
    )
  }
}

