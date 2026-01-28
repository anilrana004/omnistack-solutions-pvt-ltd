import { services as fallbackServices } from '@/data/services'
import { caseStudies as fallbackCaseStudies } from '@/data/caseStudies'
import { faqs as fallbackFaqs } from '@/data/faqs'
import type {
  SanityService,
  SanityCaseStudy,
  SanityFAQ,
  SanityTestimonial,
  SanitySettings,
  ContentFallbacks,
} from './sanity.types'

// Error types
export enum ContentErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  PARSE_ERROR = 'PARSE_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  TIMEOUT = 'TIMEOUT',
  MAINTENANCE_MODE = 'MAINTENANCE_MODE',
}

export interface ContentError {
  type: ContentErrorType
  message: string
  details?: any
  timestamp: string
  retryable: boolean
}

// Error handling utilities
export class ContentErrorHandler {
  private static instance: ContentErrorHandler
  private errorLog: ContentError[] = []
  private maxLogSize = 100

  static getInstance(): ContentErrorHandler {
    if (!ContentErrorHandler.instance) {
      ContentErrorHandler.instance = new ContentErrorHandler()
    }
    return ContentErrorHandler.instance
  }

  logError(error: ContentError): void {
    this.errorLog.push(error)
    
    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Content Error:', error)
    }
  }

  createError(
    type: ContentErrorType,
    message: string,
    details?: any,
    retryable: boolean = false
  ): ContentError {
    const error: ContentError = {
      type,
      message,
      details,
      timestamp: new Date().toISOString(),
      retryable,
    }

    this.logError(error)
    return error
  }

  getRecentErrors(limit: number = 10): ContentError[] {
    return this.errorLog.slice(-limit)
  }

  clearErrorLog(): void {
    this.errorLog = []
  }

  isRetryable(error: ContentError): boolean {
    return error.retryable || [
      ContentErrorType.NETWORK_ERROR,
      ContentErrorType.TIMEOUT,
    ].includes(error.type)
  }
}

// Fallback content generators
export class FallbackContentGenerator {
  // Convert old service format to new Sanity format
  static convertLegacyServices(): SanityService[] {
    return fallbackServices.map((service, index) => ({
      _id: `fallback-service-${service.id}`,
      _type: 'service',
      title: service.title,
      slug: { current: service.id },
      shortDescription: service.shortDescription,
      fullDescription: service.fullDescription,
      processSteps: service.processSteps,
      tools: service.tools,
      deliverables: service.deliverables,
      ctaText: service.ctaText,
      featured: index < 3, // First 3 as featured
      order: index + 1,
      publishedAt: new Date().toISOString(),
      status: 'published' as const,
    }))
  }

  // Convert old case study format to new Sanity format
  static convertLegacyCaseStudies(): SanityCaseStudy[] {
    return Object.entries(fallbackCaseStudies).map(([slug, caseStudy], index) => ({
      _id: `fallback-casestudy-${slug}`,
      _type: 'caseStudy',
      title: slug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      slug: { current: slug },
      summary: caseStudy.summary,
      featured: index < 3,
      category: this.inferCategory(slug),
      overview: caseStudy.overview,
      problem: caseStudy.problem,
      solution: caseStudy.solution,
      techStack: caseStudy.techStack,
      highlights: caseStudy.highlights,
      outcome: caseStudy.outcome,
      isUnderNDA: slug.includes('nda') || slug.includes('client'),
      order: index + 1,
      publishedAt: new Date().toISOString(),
      status: 'published' as const,
    }))
  }

  private static inferCategory(slug: string): SanityCaseStudy['category'] {
    if (slug.includes('web') || slug.includes('full-stack')) return 'web'
    if (slug.includes('mobile') || slug.includes('app')) return 'mobile'
    if (slug.includes('ai') || slug.includes('chatbot')) return 'ai'
    if (slug.includes('cloud') || slug.includes('migration')) return 'cloud'
    if (slug.includes('ecommerce') || slug.includes('commerce')) return 'ecommerce'
    if (slug.includes('brand') || slug.includes('pr')) return 'branding'
    return 'concept'
  }

  // Convert old FAQ format to new Sanity format
  static convertLegacyFAQs(): SanityFAQ[] {
    return fallbackFaqs.map((faq, index) => ({
      _id: `fallback-faq-${index}`,
      _type: 'faq',
      question: faq.question,
      answer: faq.answer,
      category: this.inferFAQCategory(faq.question),
      featured: index < 5,
      order: index + 1,
      isEnabled: true,
      publishedAt: new Date().toISOString(),
    }))
  }

  private static inferFAQCategory(question: string): SanityFAQ['category'] {
    const q = question.toLowerCase()
    if (q.includes('service') || q.includes('offer')) return 'services'
    if (q.includes('price') || q.includes('cost') || q.includes('payment')) return 'pricing'
    if (q.includes('process') || q.includes('work') || q.includes('timeline')) return 'process'
    if (q.includes('tech') || q.includes('code') || q.includes('quality')) return 'technical'
    if (q.includes('support') || q.includes('maintenance')) return 'support'
    return 'general'
  }

  // Generate fallback testimonials
  static generateFallbackTestimonials(): SanityTestimonial[] {
    const testimonials: Omit<SanityTestimonial, '_id' | '_type'>[] = [
      {
        clientName: 'John D.',
        clientTitle: 'CEO',
        companyName: 'Tech Startup Inc.',
        testimonial: 'Outstanding work on our web application. The team delivered exactly what we needed on time and within budget.',
        rating: 5,
        projectType: 'web',
        featured: true,
        order: 1,
        isVerified: false,
        isEnabled: true,
        receivedAt: new Date().toISOString(),
      },
      {
        clientName: 'Sarah M.',
        clientTitle: 'Marketing Director',
        companyName: 'Growth Co.',
        testimonial: 'Professional service and excellent results. Our mobile app exceeded our expectations.',
        rating: 5,
        projectType: 'mobile',
        featured: true,
        order: 2,
        isVerified: false,
        isEnabled: true,
        receivedAt: new Date().toISOString(),
      },
      {
        clientName: 'Mike R.',
        clientTitle: 'CTO',
        companyName: 'Enterprise Solutions',
        testimonial: 'Great expertise in cloud infrastructure. They helped us scale efficiently and securely.',
        rating: 5,
        projectType: 'cloud',
        featured: false,
        order: 3,
        isVerified: false,
        isEnabled: true,
        receivedAt: new Date().toISOString(),
      },
    ]

    return testimonials.map((testimonial, index) => ({
      _id: `fallback-testimonial-${index}`,
      _type: 'testimonial',
      ...testimonial,
    }))
  }

  // Generate fallback settings
  static generateFallbackSettings(): SanitySettings {
    return {
      _id: 'fallback-settings',
      _type: 'settings',
      title: 'OmniStack Solutions',
      description: 'Building Everything. Empowering Everyone. OmniStack Solutions designs and builds scalable websites, applications, AI systems, and cloud infrastructure for modern businesses.',
      contact: {
        email: 'admin@omnistack.co.in',
        phone: '+91 6396309659',
        address: '11-174 near fountain chowk, Rajeev Nagar, Nehru Colony, Dharampur, Dehradun, Uttarakhand 248001, India',
      },
      socialMedia: {
        facebook: 'https://www.facebook.com/profile.php?id=61586898450703',
        instagram: 'https://www.instagram.com/omnistack.dev/',
        linkedin: 'https://www.linkedin.com/company/111559343/admin/dashboard/',
        twitter: 'https://x.com/omnistack_01',
        youtube: 'https://www.youtube.com/channel/UCTCCDLqNNoppWoAHGqQye3A',
      },
      whatsapp: {
        phoneNumber: '916396309659',
        defaultMessage: 'Hello OmniStack Solutions',
        isEnabled: true,
      },
      seo: {
        defaultMetaTitle: 'OmniStack Solutions - Building Everything. Empowering Everyone.',
        defaultMetaDescription: 'OmniStack Solutions designs and builds scalable websites, applications, AI systems, and cloud infrastructure for modern businesses.',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://omnistack.co.in',
      },
      footerContent: {
        companyDescription: 'Building Everything. Empowering Everyone.',
        copyrightText: 'OmniStack Solutions. All rights reserved.',
      },
      maintenanceMode: {
        isEnabled: false,
        message: 'We are currently performing scheduled maintenance. Please check back soon.',
      },
    }
  }

  // Get all fallback content
  static getAllFallbackContent(): ContentFallbacks {
    return {
      hero: {
        heading: 'Building Everything. Empowering Everyone.',
        subheading: 'OmniStack Solutions designs and builds scalable websites, applications, AI systems, and cloud infrastructure for modern businesses.',
        ctaButtons: [
          { text: 'Get Started', link: '/contact', style: 'primary' },
          { text: 'View Our Work', link: '/projects', style: 'secondary' },
        ],
      },
      services: this.convertLegacyServices(),
      caseStudies: this.convertLegacyCaseStudies(),
      faqs: this.convertLegacyFAQs(),
      testimonials: this.generateFallbackTestimonials(),
    }
  }
}

// Content validation utilities
export class ContentValidator {
  static validateService(service: any): service is SanityService {
    return (
      service &&
      typeof service.title === 'string' &&
      typeof service.shortDescription === 'string' &&
      Array.isArray(service.processSteps) &&
      Array.isArray(service.deliverables)
    )
  }

  static validateCaseStudy(caseStudy: any): caseStudy is SanityCaseStudy {
    return (
      caseStudy &&
      typeof caseStudy.title === 'string' &&
      typeof caseStudy.summary === 'string' &&
      typeof caseStudy.category === 'string'
    )
  }

  static validateFAQ(faq: any): faq is SanityFAQ {
    return (
      faq &&
      typeof faq.question === 'string' &&
      typeof faq.answer === 'string'
    )
  }

  static validateTestimonial(testimonial: any): testimonial is SanityTestimonial {
    return (
      testimonial &&
      typeof testimonial.clientName === 'string' &&
      typeof testimonial.testimonial === 'string' &&
      typeof testimonial.rating === 'number' &&
      testimonial.rating >= 1 &&
      testimonial.rating <= 5
    )
  }

  static validateSettings(settings: any): settings is SanitySettings {
    return (
      settings &&
      typeof settings.title === 'string' &&
      typeof settings.description === 'string' &&
      settings.contact &&
      typeof settings.contact.email === 'string' &&
      typeof settings.contact.phone === 'string'
    )
  }
}

// Content sanitization utilities
export class ContentSanitizer {
  static sanitizeHTML(html: string): string {
    // Basic HTML sanitization - remove script tags and dangerous attributes
    return html
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/g, '')
      .replace(/javascript:/gi, '')
      .trim()
  }

  static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength - 3) + '...'
  }

  static sanitizeService(service: SanityService): SanityService {
    return {
      ...service,
      title: this.sanitizeHTML(service.title),
      shortDescription: this.sanitizeHTML(service.shortDescription),
      fullDescription: this.sanitizeHTML(service.fullDescription),
      processSteps: service.processSteps.map(step => this.sanitizeHTML(step)),
      deliverables: service.deliverables.map(item => this.sanitizeHTML(item)),
      tools: service.tools.map(tool => this.sanitizeHTML(tool)),
    }
  }

  static sanitizeTestimonial(testimonial: SanityTestimonial): SanityTestimonial {
    return {
      ...testimonial,
      clientName: this.sanitizeHTML(testimonial.clientName),
      testimonial: this.sanitizeHTML(testimonial.testimonial),
      companyName: testimonial.companyName ? this.sanitizeHTML(testimonial.companyName) : undefined,
      clientTitle: testimonial.clientTitle ? this.sanitizeHTML(testimonial.clientTitle) : undefined,
    }
  }
}

// Retry utilities
export class RetryManager {
  static async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error as Error
        
        if (i === maxRetries) break
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
      }
    }

    throw lastError!
  }

  static async withTimeout<T>(
    fn: () => Promise<T>,
    timeoutMs: number = 10000
  ): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
      ),
    ])
  }
}

// Export singleton instance
export const errorHandler = ContentErrorHandler.getInstance()