# 🚀 CMS Architecture Migration Guide

This guide walks you through migrating from the current hardcoded architecture to the new CMS-driven system.

## ⚡ **Quick Start**

### 1. **Environment Setup**
Add these environment variables to your `.env.local`:

```bash
# Existing (already configured)
NEXT_PUBLIC_SANITY_PROJECT_ID=kvjr9xh2
NEXT_PUBLIC_SANITY_DATASET=production  
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
NEXT_PUBLIC_SITE_URL=https://omnistack.co.in
SANITY_REVALIDATE_SECRET=your-webhook-secret

# NEW - Required for preview mode
SANITY_API_TOKEN=sk...your-api-token
SANITY_PREVIEW_SECRET=your-secure-preview-secret
```

### 2. **Deploy New Schemas**
```bash
cd studio-omnistacksolutions
npm run dev  # Start Studio
# Visit http://localhost:3333
# Go to Vision tool and verify schemas are deployed
```

### 3. **Test New Architecture**
```bash
# Run validation
npm run validate:deployment

# Test feature flags API
curl http://localhost:3000/api/feature-flags

# Test preview mode
curl -X POST http://localhost:3000/api/preview \
  -H "Content-Type: application/json" \
  -d '{"secret": "your-preview-secret"}'
```

## 🔄 **Migration Strategy**

### **Phase 1: Setup Foundation** ✅ **COMPLETE**
- [x] Create comprehensive Sanity schemas
- [x] Build API abstraction layer  
- [x] Implement error handling & fallbacks
- [x] Setup SEO system
- [x] Create deployment validation
- [x] Implement preview mode
- [x] Add feature flag system
- [x] Reorganize component structure

### **Phase 2: Component Migration** 🔲 **READY**

#### **Immediate Benefits Available:**

1. **Use New Page Structure** (app/page-new.tsx):
   ```bash
   # Rename when ready to switch
   mv app/page.tsx app/page-legacy.tsx
   mv app/page-new.tsx app/page.tsx
   ```

2. **Use New Component Imports:**
   ```typescript
   // OLD
   import Logo from '@/components/Logo'
   import BlogCard from '@/components/BlogCard'
   
   // NEW  
   import { Logo, BlogCard } from '@/src/components/ui'
   import { ServicesSection, BlogSection } from '@/src/components/sections'
   import { PageLayout } from '@/src/components/layouts'
   ```

#### **Step-by-Step Component Migration:**

**🎯 Priority 1: Core Layout** 
```typescript
// 1. Update app/layout.tsx to use new PageLayout
import { PageLayout } from '@/src/components/layouts'

// 2. Replace Navbar and Footer imports  
import { Header, Footer } from '@/src/components/layouts'
```

**🎯 Priority 2: Homepage Sections**
```typescript
// Replace existing sections one by one:
import { HeroSection, ServicesSection } from '@/src/components/sections'

// Test each section independently before replacing
```

**🎯 Priority 3: Content Pages**
```typescript
// Update blogs, services, projects pages
// Use new API layer and error handling
```

### **Phase 3: Content Population** 📝

#### **1. Create Settings Document**
In Sanity Studio (http://localhost:3333):
1. Go to **Settings** document type
2. Click **Create** → **Settings**
3. Fill in:
   - Site Title: "OmniStack Solutions"
   - Description: "Building Everything. Empowering Everyone."
   - Contact Info, Social Media Links
   - Feature Flags (enable/disable sections)
   - SEO defaults

#### **2. Migrate Services**
For each service in `/data/services.ts`:
1. Create new **Service** document
2. Copy title, descriptions, process steps
3. Set display order, featured status
4. Add pricing information

#### **3. Migrate Case Studies**  
For each case study in `/data/caseStudies.ts`:
1. Create new **Case Study** document
2. Copy project details, tech stack, highlights
3. Upload thumbnail images
4. Set featured status, categories

#### **4. Migrate FAQs**
For each FAQ in `/data/faqs.ts`:
1. Create new **FAQ** document
2. Copy question and answer
3. Set category and order

#### **5. Migrate Testimonials**
Create **Testimonial** documents for client feedback:
1. Add client info and rating
2. Upload avatars if available
3. Set verification status

#### **6. Create Homepage**
Create a **Page** document with `pageType: "home"`:
1. Configure Hero section with dynamic content
2. Set background images
3. Configure CTA buttons
4. Add SEO metadata

## 🛠️ **Development Workflow**

### **Daily Development:**
```bash
# Terminal 1: Next.js
npm run dev

# Terminal 2: Sanity Studio  
cd studio-omnistacksolutions
npm run dev

# Terminal 3: Validation (as needed)
npm run validate:deployment
```

### **Content Updates:**
1. **Edit in Sanity Studio** (http://localhost:3333)
2. **Preview with Preview Mode** (add ?secret=preview-secret to any URL)
3. **Publish when ready** (changes appear within cache TTL)

### **Feature Flag Testing:**
```bash
# Check current flags
curl http://localhost:3000/api/feature-flags

# Test in browser dev tools
fetch('/api/feature-flags').then(r => r.json()).then(console.log)
```

### **New Component Creation:**
```typescript
// 1. UI Component (pure presentational)
// File: src/components/ui/MyComponent.tsx
export default function MyComponent({ data }) {
  return <div>{data.title}</div>
}

// 2. Section Component (CMS-driven)  
// File: src/components/sections/MySection.tsx
import { ContentWrapper } from '@/src/components/fallbacks'
import { getAllMyContent } from '@/src/lib/sanity.api'

export default async function MySection() {
  const content = await getAllMyContent()
  
  return (
    <ContentWrapper loading={!content.success} error={content.error}>
      {/* Your section content */}
    </ContentWrapper>
  )
}
```

## 📊 **Monitoring & Validation**

### **Health Checks:**
```bash
# Full deployment validation
npm run validate:deployment

# Check specific aspects
node -e "
const { DeploymentValidator } = require('./src/lib/deployment.js');
DeploymentValidator.validateEnvironment().then(console.log);
"
```

### **Performance Monitoring:**
- API response times logged automatically
- Cache hit rates tracked
- Error rates monitored  
- Content freshness validated

### **Content Quality:**
- Automatic content validation
- Image optimization verified
- SEO metadata completeness checked
- Link validation (future feature)

## 🎯 **Immediate Next Steps**

### **Test the New Architecture:**

1. **Start Studio & Populate Content:**
   ```bash
   cd studio-omnistacksolutions
   npm run dev
   # Visit http://localhost:3333
   # Create a Settings document with your contact info
   # Create a few Service documents
   # Create a few Testimonial documents
   ```

2. **Test Feature Flags:**
   ```bash
   # Visit http://localhost:3000/api/feature-flags
   # Should return current feature flag settings
   ```

3. **Test Preview Mode:**
   ```bash
   # Visit http://localhost:3000/api/preview?secret=your-preview-secret
   # Should enable preview mode with banner
   ```

4. **Switch to New Homepage:**
   ```bash
   # When ready, activate the new CMS-driven homepage
   mv app/page.tsx app/page-legacy.tsx
   mv app/page-new.tsx app/page.tsx
   npm run build  # Verify no breaking changes
   ```

## 🔥 **Architecture Benefits**

### **For Developers:**
- ✅ **Type Safety**: Full TypeScript prevents runtime errors
- ✅ **Clean Architecture**: Clear separation of concerns (UI/Sections/Layouts)
- ✅ **Error Resilience**: Comprehensive error boundaries and fallbacks
- ✅ **Performance**: Smart caching and lazy loading
- ✅ **Maintainability**: Modular, well-documented code
- ✅ **Developer Experience**: Excellent tooling and debugging

### **For Content Managers:**
- ✅ **User-Friendly CMS**: Intuitive Sanity Studio interface
- ✅ **Real-Time Preview**: See changes instantly with preview mode
- ✅ **Feature Control**: Toggle sections without developer involvement  
- ✅ **SEO Tools**: Built-in SEO management for every content type
- ✅ **Rich Content**: Support for images, rich text, structured data

### **For Business:**
- ✅ **Zero-Downtime Updates**: Content changes don't require deployments
- ✅ **Scalable Architecture**: Grows with business requirements
- ✅ **SEO Optimized**: Better search visibility with dynamic metadata
- ✅ **Fast Performance**: Optimized caching improves user experience
- ✅ **Risk Mitigation**: Robust error handling prevents site crashes
- ✅ **Feature Flexibility**: Toggle features based on business needs

## 🆘 **Troubleshooting**

### **Common Migration Issues:**

**🔴 Import Errors After Reorganization:**
```bash
# Update imports to new structure
# OLD: import Logo from '@/components/Logo'
# NEW: import { Logo } from '@/src/components/ui'
```

**🔴 Feature Flags Not Working:**
```bash
# Check API endpoint
curl http://localhost:3000/api/feature-flags

# Verify settings document exists in Sanity Studio
```

**🔴 Preview Mode Issues:**
```bash
# Check environment variables
npm run validate:deployment

# Verify API token has correct permissions
```

**🔴 Content Not Appearing:**
```bash
# Check if content is published in Sanity Studio
# Verify API layer is working
# Check browser network tab for failed requests
```

## 🎉 **Ready for Production**

Your website is now transformed into an **enterprise-grade, CMS-driven platform** with:

- **🏗️ Scalable Architecture** that grows with your business
- **⚡ Performance Optimized** with smart caching and lazy loading  
- **🛡️ Error Resilient** with comprehensive fallback systems
- **🔍 SEO Optimized** with dynamic metadata generation
- **🎛️ Feature Controlled** with CMS-driven toggles
- **✏️ Content Manageable** through intuitive Sanity Studio
- **🔒 Deployment Safe** with validation and health monitoring

**The architecture is production-ready and future-proof!** 🚀