# OmniStack Solutions - CMS Architecture Guide

This document outlines the comprehensive CMS-driven architecture implemented for scalable, maintainable content management.

## 🎯 Architecture Overview

### Core Principles
- **CMS-First**: All content is managed through Sanity CMS
- **Type Safety**: Full TypeScript coverage with generated types  
- **Error Resilience**: Robust error handling with graceful fallbacks
- **SEO Optimized**: Dynamic metadata generation and structured data
- **Performance**: Smart caching and lazy loading
- **Scalability**: Modular architecture that grows with your needs

### Technology Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **CMS**: Sanity Studio v3
- **Deployment**: Vercel (recommended)
- **CDN**: Sanity CDN for images

## 📁 Project Structure

```
src/
├── lib/
│   ├── sanity.client.ts      # Sanity client configuration
│   ├── sanity.types.ts       # TypeScript type definitions
│   ├── sanity.queries.ts     # GROQ queries
│   ├── sanity.api.ts         # API abstraction layer
│   ├── seo.ts                # SEO utilities and metadata generation
│   ├── error-handling.ts     # Error handling and fallback utilities
│   └── deployment.ts         # Deployment validation and health checks
├── components/
│   └── fallbacks/            # Error states, loading skeletons, wrappers
└── data/                     # Legacy data (will be migrated)

studio-omnistacksolutions/
├── schemaTypes/
│   ├── page.ts              # Page content management
│   ├── service.ts           # Service definitions
│   ├── caseStudy.ts         # Portfolio/case studies
│   ├── faq.ts               # Frequently asked questions
│   ├── testimonial.ts       # Client testimonials
│   ├── settings.ts          # Site-wide settings
│   ├── seo.ts               # SEO metadata objects
│   └── post.ts              # Blog posts (existing)
└── sanity.config.ts         # Studio configuration
```

## 🏗️ Content Types & Schemas

### 1. Page Management (`page.ts`)
Complete page content management with:
- Hero sections with dynamic content
- Flexible section ordering
- SEO metadata per page
- Publication workflow

### 2. Services (`service.ts`) 
Service offerings with:
- Detailed descriptions and process steps
- Tool/technology lists
- Pricing information
- Featured service flagging

### 3. Case Studies (`caseStudy.ts`)
Portfolio showcase with:
- Project categorization
- Technical stack details
- Before/after highlights
- NDA protection options

### 4. Testimonials (`testimonial.ts`)
Client feedback system with:
- Star ratings
- Client verification status
- Project type association
- Featured testimonial selection

### 5. FAQ Management (`faq.ts`)
Knowledge base with:
- Category organization
- Priority/featured flagging
- Enable/disable controls

### 6. Site Settings (`settings.ts`)
Global configuration including:
- Contact information
- Social media links
- SEO defaults
- Maintenance mode
- Analytics settings

## 🔌 API Abstraction Layer

### Centralized Data Fetching
All content fetching goes through `sanity.api.ts` for:
- Consistent error handling
- Smart caching (5-30 minutes based on content type)
- Type safety
- Fallback content
- Performance monitoring

### Key Functions
```typescript
// Services
getAllServices() -> SanityListResponse<SanityService>
getServiceBySlug(slug) -> SanityApiResponse<SanityService>
getFeaturedServices() -> SanityListResponse<SanityService>

// Case Studies  
getAllCaseStudies() -> SanityListResponse<SanityCaseStudy>
getCaseStudyBySlug(slug) -> SanityApiResponse<SanityCaseStudy>
getFeaturedCaseStudies() -> SanityListResponse<SanityCaseStudy>

// Testimonials
getAllTestimonials() -> SanityListResponse<SanityTestimonial>
getFeaturedTestimonials() -> SanityListResponse<SanityTestimonial>

// Site Configuration
getSiteSettings() -> SanityApiResponse<SanitySettings>
```

## 🎨 SEO & Metadata Management

### Dynamic SEO Generation
The `SEOManager` class automatically generates:
- Page titles and descriptions
- Open Graph images
- Twitter Card metadata
- Structured data (JSON-LD)
- Canonical URLs
- Robot directives

### Usage Example
```typescript
import { createSEOManager } from '@/src/lib/seo'

export async function generateMetadata({ params }) {
  const settings = await getSiteSettings()
  const service = await getServiceBySlug(params.slug)
  
  const seoManager = createSEOManager(settings.data)
  return seoManager.generateServiceMetadata(service.data, `/services/${params.slug}`)
}
```

## 🛡️ Error Handling & Resilience

### Multi-Layer Error Protection
1. **API Layer**: Graceful API failures with fallback content
2. **Component Layer**: Error boundaries and loading states  
3. **Content Layer**: Validation and sanitization
4. **Deployment Layer**: Health checks and validation

### Error Components
```typescript
<ContentWrapper
  loading={loading}
  error={error}
  empty={!data?.length}
  onRetry={refetch}
  loadingSkeleton="grid"
>
  {/* Your content */}
</ContentWrapper>
```

### Fallback Content
Automatic fallbacks prevent blank pages:
- Services → Legacy data conversion
- Case Studies → Static showcase
- Testimonials → Sample testimonials
- Settings → Environment-based defaults

## 🚀 Deployment & Validation

### Pre-Deployment Checks
Run validation before every deployment:

```bash
npm run validate:deployment
```

Checks include:
- ✅ Environment variables
- ✅ Sanity connection
- ✅ Content structure  
- ✅ Critical paths
- ✅ External services

### Environment Configuration
```bash
# Required
NEXT_PUBLIC_SANITY_PROJECT_ID=kvjr9xh2
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

# Recommended  
NEXT_PUBLIC_SITE_URL=https://omnistack.co.in
SANITY_REVALIDATE_SECRET=your-webhook-secret

# Preview Mode (for content editors)
SANITY_API_TOKEN=sk...your-sanity-api-token
SANITY_PREVIEW_SECRET=your-preview-secret

# Optional
IG_ACCESS_TOKEN=your-instagram-token
IG_USER_ID=your-instagram-user-id
```

## 📝 Content Management Workflow

### 1. Adding New Content
1. Open Sanity Studio: `http://localhost:3333`
2. Create/edit content using the intuitive interface
3. Preview changes with live preview
4. Publish when ready

### 2. Content Updates
- Changes appear within cache TTL (5-30 minutes)
- Use webhooks for instant updates
- ISR (Incremental Static Regeneration) for optimal performance

### 3. SEO Management
- Each content type has dedicated SEO fields
- Automatic fallbacks to site defaults
- Real-time SEO preview in Studio

## 🔧 Development Workflow

### 1. Local Development
```bash
# Start Next.js
npm run dev

# Start Sanity Studio (separate terminal)
cd studio-omnistacksolutions
npm run dev
```

### 2. Preview Mode 🔍
Enable content editors to preview draft content safely:

**Enable Preview:**
```bash
# Visit your site with preview secret
https://yoursite.com/api/preview?secret=your-preview-secret
```

**Features:**
- ✅ Preview draft content before publishing
- ✅ Visual banner with edit links
- ✅ No caching - always fresh content  
- ✅ Safe - no impact on published site
- ✅ Auto-expire after 24 hours

**Implementation:**
```typescript
// In page components
const preview = isPreviewMode()
const data = await getContent(slug, preview)

// Preview banner
{preview && (
  <PreviewBanner
    isPreview={preview}
    documentType="post"
    documentId={data._id}
  />
)}
```

### 2. Content Development
1. Make schema changes in `studio-omnistacksolutions/schemaTypes/`
2. Update TypeScript types in `src/lib/sanity.types.ts`
3. Add/update queries in `src/lib/sanity.queries.ts`  
4. Update API functions in `src/lib/sanity.api.ts`
5. Test with fallback components

### 3. Component Refactoring
When converting hardcoded components:
1. Identify static content
2. Create/update Sanity schema
3. Add content to Studio
4. Update component to use API layer
5. Add error handling with ContentWrapper
6. Test all states (loading, error, empty, success)

## 🎯 Migration Strategy

### Phase 1: Infrastructure ✅
- [x] Sanity schemas created
- [x] API abstraction layer built
- [x] Error handling implemented
- [x] SEO system established

### Phase 2: Component Migration 🚧
- [ ] Hero section → Page management
- [ ] Services section → Service schema
- [ ] Portfolio → Case study schema  
- [ ] Testimonials → Testimonial schema
- [ ] FAQ → FAQ schema
- [ ] Footer → Settings schema

### Phase 3: Enhancement 📋
- [ ] Advanced preview modes
- [ ] Content scheduling
- [ ] A/B testing framework
- [ ] Analytics integration
- [ ] Performance monitoring

## 🔍 Monitoring & Maintenance

### Health Monitoring
The system includes built-in health checks:
- API response times
- Error rates
- Content freshness
- Cache hit rates

### Content Validation
Automatic validation ensures:
- Required fields are populated
- Image assets are accessible
- Links are valid
- Content meets quality standards

### Performance Metrics
- Page load times
- API response times  
- Cache efficiency
- Core Web Vitals

## 🆘 Troubleshooting

### Common Issues

**🔴 Sanity Connection Failed**
```bash
# Check environment variables
npm run validate:deployment

# Test Sanity connection
npx sanity exec --with-user-token scripts/test-connection.js
```

**🔴 Content Not Updating**
- Check cache TTL settings
- Verify webhook configuration
- Clear cache manually: `clearCache()`

**🔴 Missing Fallback Content**
- Ensure `FallbackContentGenerator` is populated
- Check error handling implementation
- Verify component error boundaries

**🔴 SEO Issues**
- Check `siteSettingsQuery` response
- Verify image URL generation
- Test structured data with Google tools

### Getting Help

1. Check deployment validation output
2. Review error logs in development
3. Test API endpoints individually
4. Use Sanity Vision for query debugging
5. Check network tab for failed requests

## 📚 Additional Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript Best Practices](https://typescript-eslint.io/)
- [SEO Best Practices](https://developers.google.com/search/docs)

---

## 🎉 Benefits Achieved

### For Developers
- **Type Safety**: Full TypeScript coverage prevents runtime errors
- **Maintainability**: Modular architecture with clear separation of concerns
- **Performance**: Smart caching and lazy loading
- **DX**: Excellent developer experience with tooling

### For Content Managers
- **User-Friendly**: Intuitive Sanity Studio interface
- **Flexible**: Rich content modeling capabilities
- **Real-Time**: Live preview and instant publishing
- **SEO Tools**: Built-in SEO management

### For Business
- **Scalability**: Architecture grows with business needs
- **Reliability**: Robust error handling prevents downtime
- **Performance**: Fast loading times improve user experience
- **SEO**: Better search engine visibility

This architecture transforms your website from a static codebase into a dynamic, scalable, content-driven platform that empowers both developers and content creators.