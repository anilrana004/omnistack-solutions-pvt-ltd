// Fallback components for content loading, errors, and empty states
export { default as ContentErrorComponent } from './ContentError'
export { default as ContentSkeleton, HeroSkeleton, CardSkeleton, ListSkeleton, TextSkeleton, ImageSkeleton, GridSkeleton } from './ContentSkeleton'
export { default as ContentWrapper, ServiceWrapper, CaseStudyWrapper, BlogWrapper, FAQWrapper, TestimonialWrapper } from './ContentWrapper'

// Re-export error handling utilities
export {
  ContentErrorHandler,
  FallbackContentGenerator,
  ContentValidator,
  ContentSanitizer,
  RetryManager,
  errorHandler,
  ContentErrorType,
  type ContentError,
} from '@/src/lib/error-handling'