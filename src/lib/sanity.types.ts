// Sanity CMS Type Definitions

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
  alt?: string
}

export interface SanityReference {
  _type: 'reference'
  _ref: string
}

export interface SanityBlock {
  _type: 'block'
  _key: string
  style?: string
  children: Array<{
    _type: 'span'
    _key: string
    text: string
    marks?: string[]
  }>
}

export interface SEO {
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImage
  keywords?: string[]
}

// Page Types
export interface SanityPage {
  _id: string
  _type: 'page'
  title: string
  slug: {current: string}
  pageType: 'home' | 'about' | 'services' | 'projects' | 'contact' | 'custom'
  hero?: {
    heading?: SanityBlock[]
    subheading?: string
    backgroundImage?: SanityImage
    ctaButtons?: Array<{
      text: string
      link: string
      style: 'primary' | 'secondary' | 'ghost'
    }>
  }
  sections?: SanityReference[]
  seo?: SEO
  publishedAt: string
  status: 'draft' | 'published' | 'archived'
}

// Section Types
export interface SanitySection {
  _id: string
  _type: 'section'
  title: string
  identifier: string
  heading?: string
  subheading?: string
  content?: SanityBlock[]
  backgroundImage?: SanityImage
  backgroundColor: string
  isEnabled: boolean
  order: number
}

// Service Types
export interface SanityService {
  _id: string
  _type: 'service'
  title: string
  slug: {current: string}
  shortDescription: string
  fullDescription: string
  icon?: SanityImage
  processSteps: string[]
  tools: string[]
  deliverables: string[]
  ctaText: string
  pricing?: {
    startingPrice?: number
    priceRange?: string
    pricingModel?: 'fixed' | 'hourly' | 'retainer' | 'custom'
  }
  featured: boolean
  order: number
  seo?: SEO
  publishedAt: string
  status: 'draft' | 'published' | 'archived'
}

// Case Study Types
export interface SanityCaseStudy {
  _id: string
  _type: 'caseStudy'
  title: string
  slug: {current: string}
  summary: string
  featured: boolean
  category: 'web' | 'mobile' | 'ai' | 'cloud' | 'ecommerce' | 'branding' | 'concept'
  heroImage?: SanityImage
  thumbnailImage?: SanityImage
  overview?: {
    what: string
    why: string
  }
  problem: string
  solution: string
  techStack?: {
    frontend?: string[]
    backend?: string[]
    infrastructure?: string[]
    tools?: string[]
  }
  highlights?: {
    performance?: string
    scalability?: string
    security?: string
    ux?: string
  }
  outcome: string
  isUnderNDA: boolean
  liveUrl?: string
  githubUrl?: string
  order: number
  seo?: SEO
  publishedAt: string
  status: 'draft' | 'published' | 'archived'
}

// FAQ Types
export interface SanityFAQ {
  _id: string
  _type: 'faq'
  question: string
  answer: string
  category: 'general' | 'services' | 'pricing' | 'process' | 'technical' | 'support'
  featured: boolean
  order: number
  isEnabled: boolean
  publishedAt: string
}

// Testimonial Types
export interface SanityTestimonial {
  _id: string
  _type: 'testimonial'
  clientName: string
  clientTitle?: string
  companyName?: string
  avatar?: SanityImage
  testimonial: string
  rating: number
  projectType?: 'web' | 'mobile' | 'ai' | 'cloud' | 'ecommerce' | 'branding' | 'consultation' | 'general'
  featured: boolean
  linkedinUrl?: string
  websiteUrl?: string
  order: number
  isVerified: boolean
  isEnabled: boolean
  receivedAt: string
}

// Settings Types
export interface SanitySettings {
  _id: string
  _type: 'settings'
  title: string
  description: string
  logo?: SanityImage
  favicon?: SanityImage
  contact: {
    email: string
    phone: string
    address?: string
  }
  socialMedia?: {
    facebook?: string
    instagram?: string
    linkedin?: string
    twitter?: string
    youtube?: string
    github?: string
  }
  whatsapp?: {
    phoneNumber?: string
    defaultMessage?: string
    isEnabled: boolean
  }
  seo?: {
    defaultMetaTitle?: string
    defaultMetaDescription?: string
    defaultOgImage?: SanityImage
    siteUrl?: string
  }
  analytics?: {
    googleAnalyticsId?: string
    googleTagManagerId?: string
  }
  footerContent?: {
    companyDescription?: string
    copyrightText?: string
  }
  featureFlags?: {
    showBlogs: boolean
    showCareers: boolean
    showTestimonials: boolean
    showPortfolio: boolean
    enableChatbot: boolean
    enableNewsletter: boolean
    enableWhatsApp: boolean
    enableInstagramFeed: boolean
    showPricing: boolean
    enableContactForm: boolean
  }
  maintenanceMode?: {
    isEnabled: boolean
    message?: string
  }
}

// Blog Types (existing)
export interface SanityBlogListItem {
  _id: string
  title: string
  slug: string
  excerpt?: string
  coverImageUrl?: string | null
  publishedAt: string
}

export interface SanityBlogDetail {
  _id: string
  title: string
  slug: string
  coverImageUrl?: string | null
  publishedAt: string
  content?: SanityBlock[]
}

// API Response Types
export interface SanityApiResponse<T> {
  success: boolean
  data: T | null
  error?: string
  cached?: boolean
  timestamp: string
}

export interface SanityListResponse<T> extends SanityApiResponse<T[]> {
  total?: number
  hasMore?: boolean
}

// Content fallback types
export interface ContentFallbacks {
  hero: {
    heading: string
    subheading: string
    ctaButtons: Array<{
      text: string
      link: string
      style: 'primary' | 'secondary' | 'ghost'
    }>
  }
  services: SanityService[]
  caseStudies: SanityCaseStudy[]
  faqs: SanityFAQ[]
  testimonials: SanityTestimonial[]
}