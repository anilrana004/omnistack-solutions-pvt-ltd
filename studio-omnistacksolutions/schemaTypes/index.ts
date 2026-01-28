import post from './post'
import seo from './seo'
import page from './page'
import section from './section'
import service from './service'
import caseStudy from './caseStudy'
import faq from './faq'
import testimonial from './testimonial'
import settings from './settings'

export const schemaTypes = [
  // Core content types
  post,
  page,
  section,
  
  // Business content
  service,
  caseStudy,
  faq,
  testimonial,
  
  // Site configuration
  settings,
  
  // Reusable objects
  seo,
]

