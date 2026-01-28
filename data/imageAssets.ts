export type ImageAsset = {
  /** Public path under /public */
  src: string
  /** Human-friendly alt text (no text in the image itself) */
  alt: string
  /** High-level context tag for consistency */
  context:
    | 'saas'
    | 'ai'
    | 'automation'
    | 'mobile'
    | 'cloud'
    | 'analytics'
    | 'ecommerce'
    | 'marketing'
    | 'blog'
    | 'general-tech'
    | 'nda'
}

export const heroBackground: ImageAsset = {
  src: '/assets/images/hero-general-tech.svg',
  alt: 'Modern tech UI collage background with glassmorphism cards',
  context: 'general-tech',
}

export const blogFallbackCover: ImageAsset = {
  src: '/assets/images/blog-tech.svg',
  alt: 'Tech blog cover visual with abstract UI cards and charts',
  context: 'blog',
}

export function getProjectImageAsset(slug: string, projectType?: string): ImageAsset {
  const bySlug: Record<string, ImageAsset> = {
    'saas-analytics-dashboard': {
      src: '/dashboard/analytics.png',
      alt: 'SaaS analytics dashboard showing real-time business metrics and performance insights',
      context: 'saas',
    },
    'ecommerce-platform': {
      src: '/dashboard/ecommerce-overview.png',
      alt: 'E-commerce analytics dashboard showing orders, revenue, and product performance panels',
      context: 'ecommerce',
    },
    'ai-business-chatbot': {
      src: '/dashboard/ai-chatbot.png',
      alt: 'AI business chatbot dashboard showing conversation flow and assistant insights panels',
      context: 'ai',
    },
    'cloud-migration-platform': {
      src: '/dashboard/cloud-migration-platform.png.jpg',
      alt: 'Cloud migration platform dashboard showing migration status, resource monitoring, and infrastructure management',
      context: 'cloud',
    },
    'full-stack-customer-experience-platform': {
      src: '/dashboard/full-stack-customer-experience-platform.png.jpg',
      alt: 'Full-stack customer experience platform dashboard showing customer journey analytics, engagement metrics, and unified experience management',
      context: 'general-tech',
    },
    'tech-founder-personal-branding': {
      src: '/dashboard/tech-founder-personal-branding.png.jpg',
      alt: 'Personal branding dashboard showing content performance, audience growth, and publishing workflow insights',
      context: 'marketing',
    },
    'ecommerce-brand-social-media-growth': {
      src: '/dashboard/ecommerce-brand-social-media-growth.png.jpg',
      alt: 'E-commerce brand growth dashboard showing social performance metrics, campaign insights, and audience engagement trends',
      context: 'marketing',
    },
  }

  if (bySlug[slug]) return bySlug[slug]
  if (projectType === 'client-nda') {
    return {
      src: '/assets/images/nda-generic.svg',
      alt: 'Generic enterprise UI preview (NDA-safe) with abstract charts and cards',
      context: 'nda',
    }
  }
  return heroBackground
}

