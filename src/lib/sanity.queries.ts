import type {
  SanityPage,
  SanitySection,
  SanityService,
  SanityCaseStudy,
  SanityFAQ,
  SanityTestimonial,
  SanitySettings,
  SanityBlogListItem,
  SanityBlogDetail,
} from './sanity.types'

// Helper fragments
const imageFragment = `{
  asset,
  hotspot,
  crop,
  alt
}`

const seoFragment = `{
  metaTitle,
  metaDescription,
  ogImage ${imageFragment},
  keywords
}`

// Page Queries
export const pageBySlugQuery = /* groq */ `*[_type == "page" && slug.current == $slug && status == "published"][0]{
  _id,
  title,
  "slug": slug.current,
  pageType,
  hero {
    heading,
    subheading,
    backgroundImage ${imageFragment},
    ctaButtons[] {
      text,
      link,
      style
    }
  },
  sections[]-> {
    _id,
    title,
    identifier,
    heading,
    subheading,
    content,
    backgroundImage ${imageFragment},
    backgroundColor,
    isEnabled,
    order
  } [isEnabled == true] | order(order asc),
  seo ${seoFragment},
  publishedAt,
  status
}`

export const allPagesQuery = /* groq */ `*[_type == "page" && status == "published"] | order(pageType asc) {
  _id,
  title,
  "slug": slug.current,
  pageType,
  publishedAt,
  status
}`

// Section Queries
export const sectionByIdentifierQuery = /* groq */ `*[_type == "section" && identifier == $identifier && isEnabled == true][0]{
  _id,
  title,
  identifier,
  heading,
  subheading,
  content,
  backgroundImage ${imageFragment},
  backgroundColor,
  isEnabled,
  order
}`

export const allSectionsQuery = /* groq */ `*[_type == "section" && isEnabled == true] | order(order asc) {
  _id,
  title,
  identifier,
  heading,
  subheading,
  backgroundImage ${imageFragment},
  backgroundColor,
  order
}`

// Service Queries
export const allServicesQuery = /* groq */ `*[_type == "service" && status == "published"] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  fullDescription,
  icon ${imageFragment},
  processSteps,
  tools,
  deliverables,
  ctaText,
  pricing,
  featured,
  order,
  publishedAt,
  status
}`

export const serviceBySlugQuery = /* groq */ `*[_type == "service" && slug.current == $slug && status == "published"][0]{
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  fullDescription,
  icon ${imageFragment},
  processSteps,
  tools,
  deliverables,
  ctaText,
  pricing,
  featured,
  order,
  seo ${seoFragment},
  publishedAt,
  status
}`

export const featuredServicesQuery = /* groq */ `*[_type == "service" && status == "published" && featured == true] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  shortDescription,
  icon ${imageFragment},
  ctaText,
  featured,
  order
}`

// Case Study Queries
export const allCaseStudiesQuery = /* groq */ `*[_type == "caseStudy" && status == "published"] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  summary,
  featured,
  category,
  thumbnailImage ${imageFragment},
  isUnderNDA,
  order,
  publishedAt,
  status
}`

export const caseStudyBySlugQuery = /* groq */ `*[_type == "caseStudy" && slug.current == $slug && status == "published"][0]{
  _id,
  title,
  "slug": slug.current,
  summary,
  featured,
  category,
  heroImage ${imageFragment},
  thumbnailImage ${imageFragment},
  overview,
  problem,
  solution,
  techStack,
  highlights,
  outcome,
  isUnderNDA,
  liveUrl,
  githubUrl,
  order,
  seo ${seoFragment},
  publishedAt,
  status
}`

export const featuredCaseStudiesQuery = /* groq */ `*[_type == "caseStudy" && status == "published" && featured == true] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  summary,
  category,
  thumbnailImage ${imageFragment},
  isUnderNDA,
  order
}`

// FAQ Queries
export const allFAQsQuery = /* groq */ `*[_type == "faq" && isEnabled == true] | order(order asc) {
  _id,
  question,
  answer,
  category,
  featured,
  order,
  publishedAt
}`

export const faqsByCategoryQuery = /* groq */ `*[_type == "faq" && category == $category && isEnabled == true] | order(order asc) {
  _id,
  question,
  answer,
  category,
  featured,
  order
}`

export const featuredFAQsQuery = /* groq */ `*[_type == "faq" && featured == true && isEnabled == true] | order(order asc) {
  _id,
  question,
  answer,
  category,
  order
}`

// Testimonial Queries
export const allTestimonialsQuery = /* groq */ `*[_type == "testimonial" && isEnabled == true] | order(order asc) {
  _id,
  clientName,
  clientTitle,
  companyName,
  avatar ${imageFragment},
  testimonial,
  rating,
  projectType,
  featured,
  isVerified,
  order,
  receivedAt
}`

export const featuredTestimonialsQuery = /* groq */ `*[_type == "testimonial" && featured == true && isEnabled == true] | order(order asc) {
  _id,
  clientName,
  clientTitle,
  companyName,
  avatar ${imageFragment},
  testimonial,
  rating,
  projectType,
  isVerified,
  order
}`

// Settings Queries
export const siteSettingsQuery = /* groq */ `*[_type == "settings"][0]{
  _id,
  title,
  description,
  logo ${imageFragment},
  favicon ${imageFragment},
  contact,
  socialMedia,
  whatsapp,
  seo {
    defaultMetaTitle,
    defaultMetaDescription,
    defaultOgImage ${imageFragment},
    siteUrl
  },
  analytics,
  footerContent,
  featureFlags,
  maintenanceMode
}`

// Blog Queries (existing, updated)
// Removed duplicate type definitions - using imported types from sanity.types

export const allBlogsQuery = /* groq */ `*[_type == "post" && defined(slug.current)] | order(coalesce(publishedAt, _createdAt) desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "coverImageUrl": coalesce(coverImage, mainImage).asset->url,
  "publishedAt": coalesce(publishedAt, _createdAt)
}`

export const blogBySlugQuery = /* groq */ `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  "coverImageUrl": coalesce(coverImage, mainImage).asset->url,
  "publishedAt": coalesce(publishedAt, _createdAt),
  content
}`