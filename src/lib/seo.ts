import type { Metadata } from 'next'
import type { SanityPage, SanityService, SanityCaseStudy, SanitySettings, SEO } from './sanity.types'
import { urlForImage } from './sanity.api'

// Default SEO values
const DEFAULT_TITLE = 'OmniStack Solutions - Building Everything. Empowering Everyone.'
const DEFAULT_DESCRIPTION = 'OmniStack Solutions designs and builds scalable websites, applications, AI systems, and cloud infrastructure for modern businesses. Full-stack development, mobile apps, AI automation, cloud services, and more.'
const DEFAULT_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://omnistack.co.in'

// SEO utilities
export class SEOManager {
  private settings: SanitySettings | null = null

  constructor(settings?: SanitySettings) {
    if (settings) {
      this.settings = settings
    }
  }

  private getBaseUrl(): string {
    return this.settings?.seo?.siteUrl || DEFAULT_SITE_URL
  }

  private getDefaultTitle(): string {
    return this.settings?.seo?.defaultMetaTitle || DEFAULT_TITLE
  }

  private getDefaultDescription(): string {
    return this.settings?.seo?.defaultMetaDescription || DEFAULT_DESCRIPTION
  }

  private getDefaultOgImage(): string | null {
    if (this.settings?.seo?.defaultOgImage) {
      return urlForImage(this.settings.seo.defaultOgImage)
    }
    return null
  }

  // Generate metadata for pages
  generatePageMetadata(page: SanityPage, pathname: string = ''): Metadata {
    const baseUrl = this.getBaseUrl()
    const url = `${baseUrl}${pathname}`
    
    const title = page.seo?.metaTitle || page.title || this.getDefaultTitle()
    const description = page.seo?.metaDescription || page.hero?.subheading || this.getDefaultDescription()
    const ogImage = page.seo?.ogImage ? urlForImage(page.seo.ogImage) : this.getDefaultOgImage()

    const metadata: Metadata = {
      title,
      description,
      keywords: page.seo?.keywords,
      openGraph: {
        title,
        description,
        url,
        siteName: this.settings?.title || 'OmniStack Solutions',
        type: 'website',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      alternates: {
        canonical: url,
      },
      robots: {
        index: page.status === 'published',
        follow: page.status === 'published',
      },
    }

    if (ogImage) {
      metadata.openGraph!.images = [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ]
      metadata.twitter!.images = [ogImage]
    }

    return metadata
  }

  // Generate metadata for services
  generateServiceMetadata(service: SanityService, pathname: string = ''): Metadata {
    const baseUrl = this.getBaseUrl()
    const url = `${baseUrl}${pathname}`
    
    const title = service.seo?.metaTitle || `${service.title} - ${this.getDefaultTitle()}`
    const description = service.seo?.metaDescription || service.shortDescription || this.getDefaultDescription()
    const ogImage = service.seo?.ogImage ? urlForImage(service.seo.ogImage) : 
                   service.icon ? urlForImage(service.icon) : this.getDefaultOgImage()

    const metadata: Metadata = {
      title,
      description,
      keywords: service.seo?.keywords || service.tools,
      openGraph: {
        title,
        description,
        url,
        siteName: this.settings?.title || 'OmniStack Solutions',
        type: 'article' as const,
        locale: 'en_US',
        ...(service.publishedAt && {
          article: {
            publishedTime: service.publishedAt,
            tags: service.tools,
          },
        }),
      } as any,
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      alternates: {
        canonical: url,
      },
      robots: {
        index: service.status === 'published',
        follow: service.status === 'published',
      },
    }

    if (ogImage) {
      metadata.openGraph!.images = [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ]
      metadata.twitter!.images = [ogImage]
    }

    return metadata
  }

  // Generate metadata for case studies
  generateCaseStudyMetadata(caseStudy: SanityCaseStudy, pathname: string = ''): Metadata {
    const baseUrl = this.getBaseUrl()
    const url = `${baseUrl}${pathname}`
    
    const title = caseStudy.seo?.metaTitle || `${caseStudy.title} - Case Study | ${this.getDefaultTitle()}`
    const description = caseStudy.seo?.metaDescription || caseStudy.summary || this.getDefaultDescription()
    const ogImage = caseStudy.seo?.ogImage ? urlForImage(caseStudy.seo.ogImage) :
                   caseStudy.heroImage ? urlForImage(caseStudy.heroImage) :
                   caseStudy.thumbnailImage ? urlForImage(caseStudy.thumbnailImage) :
                   this.getDefaultOgImage()

    // Create tech stack keywords
    const techKeywords = [
      ...(caseStudy.techStack?.frontend || []),
      ...(caseStudy.techStack?.backend || []),
      ...(caseStudy.techStack?.infrastructure || []),
      ...(caseStudy.techStack?.tools || []),
    ]

    const metadata: Metadata = {
      title,
      description,
      keywords: caseStudy.seo?.keywords || [...techKeywords, caseStudy.category],
      openGraph: {
        title,
        description,
        url,
        siteName: this.settings?.title || 'OmniStack Solutions',
        type: 'article' as const,
        locale: 'en_US',
        ...(caseStudy.publishedAt && {
          article: {
            publishedTime: caseStudy.publishedAt,
            tags: techKeywords,
            section: 'Portfolio',
          },
        }),
      } as any,
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      alternates: {
        canonical: url,
      },
      robots: (caseStudy.isUnderNDA 
        ? 'noindex, nofollow'
        : {
            index: caseStudy.status === 'published',
            follow: caseStudy.status === 'published',
          }) as any,
    }

    if (ogImage) {
      metadata.openGraph!.images = [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ]
      metadata.twitter!.images = [ogImage]
    }

    return metadata
  }

  // Generate metadata for blog posts
  generateBlogMetadata(
    blog: { title: string; excerpt?: string; coverImageUrl?: string | null; publishedAt: string },
    pathname: string = ''
  ): Metadata {
    const baseUrl = this.getBaseUrl()
    const url = `${baseUrl}${pathname}`
    
    const title = `${blog.title} | Blog - ${this.getDefaultTitle()}`
    const description = blog.excerpt || this.getDefaultDescription()
    const ogImage = blog.coverImageUrl || this.getDefaultOgImage()

    const metadata: Metadata = {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        siteName: this.settings?.title || 'OmniStack Solutions',
        type: 'article' as const,
        locale: 'en_US',
        ...(blog.publishedAt && {
          article: {
            publishedTime: blog.publishedAt,
            section: 'Blog',
          },
        }),
      } as any,
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      alternates: {
        canonical: url,
      },
      robots: {
        index: true,
        follow: true,
      },
    }

    if (ogImage) {
      metadata.openGraph!.images = [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ]
      metadata.twitter!.images = [ogImage]
    }

    return metadata
  }

  // Generate default metadata
  generateDefaultMetadata(
    title?: string,
    description?: string,
    pathname: string = ''
  ): Metadata {
    const baseUrl = this.getBaseUrl()
    const url = `${baseUrl}${pathname}`
    
    const metaTitle = title || this.getDefaultTitle()
    const metaDescription = description || this.getDefaultDescription()
    const ogImage = this.getDefaultOgImage()

    const metadata: Metadata = {
      title: metaTitle,
      description: metaDescription,
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        url,
        siteName: this.settings?.title || 'OmniStack Solutions',
        type: 'website',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
      },
      alternates: {
        canonical: url,
      },
      robots: {
        index: true,
        follow: true,
      },
    }

    if (ogImage) {
      metadata.openGraph!.images = [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ]
      metadata.twitter!.images = [ogImage]
    }

    return metadata
  }

  // Generate structured data (JSON-LD)
  generateOrganizationSchema(): object {
    const baseUrl = this.getBaseUrl()
    const logo = this.settings?.logo ? urlForImage(this.settings.logo) : null

    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.settings?.title || 'OmniStack Solutions',
      url: baseUrl,
      logo: logo,
      description: this.getDefaultDescription(),
      email: this.settings?.contact?.email,
      telephone: this.settings?.contact?.phone,
      address: this.settings?.contact?.address ? {
        '@type': 'PostalAddress',
        addressLocality: this.settings.contact.address,
      } : undefined,
      sameAs: [
        this.settings?.socialMedia?.facebook,
        this.settings?.socialMedia?.instagram,
        this.settings?.socialMedia?.linkedin,
        this.settings?.socialMedia?.twitter,
        this.settings?.socialMedia?.youtube,
      ].filter(Boolean),
      foundingDate: '2023',
      areaServed: 'Worldwide',
      serviceType: [
        'Web Development',
        'Mobile App Development',
        'AI & Automation',
        'Cloud & DevOps',
        'SEO & Digital Marketing',
      ],
    }
  }

  generateServiceSchema(service: SanityService): object {
    const baseUrl = this.getBaseUrl()

    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.title,
      description: service.fullDescription,
      provider: {
        '@type': 'Organization',
        name: this.settings?.title || 'OmniStack Solutions',
        url: baseUrl,
      },
      areaServed: 'Worldwide',
      serviceType: service.title,
      offers: service.pricing?.priceRange ? {
        '@type': 'Offer',
        price: service.pricing.priceRange,
        priceCurrency: 'USD',
      } : undefined,
    }
  }

  generateArticleSchema(
    article: { title: string; summary: string; publishedAt: string; category?: string },
    url: string
  ): object {
    const baseUrl = this.getBaseUrl()

    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.summary,
      datePublished: article.publishedAt,
      dateModified: article.publishedAt,
      author: {
        '@type': 'Organization',
        name: this.settings?.title || 'OmniStack Solutions',
        url: baseUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: this.settings?.title || 'OmniStack Solutions',
        url: baseUrl,
        logo: this.settings?.logo ? {
          '@type': 'ImageObject',
          url: urlForImage(this.settings.logo),
        } : undefined,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
      articleSection: article.category || 'Technology',
    }
  }
}

// Utility functions
export function createSEOManager(settings?: SanitySettings): SEOManager {
  return new SEOManager(settings)
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}