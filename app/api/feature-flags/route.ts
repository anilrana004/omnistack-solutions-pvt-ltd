import { NextResponse } from 'next/server'
import { getFeatureFlags } from '@/src/lib/feature-flags'

export const runtime = 'nodejs'

// Get current feature flags
export async function GET() {
  try {
    const flags = await getFeatureFlags()
    
    return NextResponse.json(flags, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('Error fetching feature flags:', error)
    
    // Return default flags on error
    return NextResponse.json({
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
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=60',
      },
    })
  }
}