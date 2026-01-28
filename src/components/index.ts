// New CMS-Driven Component Architecture
// This is the main entry point for all components

// UI Components (Pure, no business logic)
export * from './ui';

// Layout Components (Reusable structure)
export * from './layouts';

// Section Components (CMS-driven content)
export * from './sections';

// Fallback Components (Error handling, loading states)
export * from './fallbacks';

// Feature Flag Components
export { FeatureFlag, FeatureGate, useFeatureFlags, useFeatureFlag } from './FeatureFlag';

// Preview Components
export { default as PreviewBanner } from './PreviewBanner';

// Legacy components (to be gradually migrated)
// These imports will be removed as components are migrated to the new structure
export { default as ContactForm } from '@/components/ContactForm';
export { default as FAQSection } from '@/components/FAQSection';
export { default as LegacyServicesSection } from '@/components/ServicesSection';
export { default as LegacyTestimonialSection } from '@/components/TestimonialSection';

/* 
MIGRATION STATUS:

✅ COMPLETED:
- UI Components (Logo, Button, Card, Badge, Container, Modal, BlogCard, WhatsAppButton)
- Layout Components (Header, Footer, PageLayout)  
- Section Components (HeroSection, ServicesSection, BlogSection, TestimonialSection)
- Error Handling & Fallbacks (ContentWrapper, ContentError, ContentSkeleton)
- Feature Flags (FeatureFlag, FeatureGate, useFeatureFlags)
- Preview Mode (PreviewBanner, preview utilities)
- API Layer (sanity.api.ts, sanity.queries.ts, sanity.types.ts)
- SEO System (seo.ts, dynamic metadata generation)
- Deployment Safety (deployment.ts, validation scripts)

🚧 TO BE MIGRATED:
- ContactForm → Create form UI components + CMS-driven form configuration
- FAQSection → Migrate to new sections/FAQSection.tsx
- PortfolioSection → Migrate to sections/PortfolioSection.tsx  
- ProjectsSection → Migrate to sections/ProjectsSection.tsx
- EnterprisePositioning → Migrate to sections/EnterprisePositioning.tsx
- WhyChooseUs → Migrate to sections/WhyChooseUsSection.tsx
- CTASection → Migrate to sections/CTASection.tsx
- InstagramFeed → Migrate to sections/InstagramSection.tsx
- ServiceDetailModal → Migrate to ui/ServiceModal.tsx
- ProjectThumbnail → Migrate to ui/ProjectCard.tsx
- VisualPreview → Migrate to ui/ProjectPreview.tsx

📋 COMPONENT MAPPING:

UI COMPONENTS (No business logic):
✅ Logo → src/components/ui/Logo.tsx
✅ Button → src/components/ui/Button.tsx  
✅ Card → src/components/ui/Card.tsx
✅ Badge → src/components/ui/Badge.tsx
✅ Container → src/components/ui/Container.tsx
✅ Modal → src/components/ui/Modal.tsx
✅ BlogCard → src/components/ui/BlogCard.tsx
✅ WhatsAppButton → src/components/ui/WhatsAppButton.tsx
🔲 ProjectCard (from ProjectThumbnail)
🔲 ServiceCard (from ServiceDetailModal)
🔲 FormField (from ContactForm parts)
🔲 ProjectPreview (from VisualPreview)

LAYOUT COMPONENTS (Reusable structure):  
✅ Header → src/components/layouts/Header.tsx
✅ Footer → src/components/layouts/Footer.tsx
✅ PageLayout → src/components/layouts/PageLayout.tsx

SECTION COMPONENTS (CMS-driven):
✅ HeroSection → src/components/sections/HeroSection.tsx
✅ ServicesSection → src/components/sections/ServicesSection.tsx  
✅ BlogSection → src/components/sections/BlogSection.tsx
✅ TestimonialSection → src/components/sections/TestimonialSection.tsx
🔲 PortfolioSection → src/components/sections/PortfolioSection.tsx
🔲 FAQSection → src/components/sections/FAQSection.tsx
🔲 CTASection → src/components/sections/CTASection.tsx
🔲 InstagramSection → src/components/sections/InstagramSection.tsx
🔲 WhyChooseUsSection → src/components/sections/WhyChooseUsSection.tsx
🔲 ProjectsSection → src/components/sections/ProjectsSection.tsx
🔲 EnterprisePositioningSection → src/components/sections/EnterprisePositioningSection.tsx

MIGRATION BENEFITS:
✅ Type Safety: Full TypeScript coverage
✅ CMS-Driven: All content from Sanity
✅ Feature Flags: Toggle features without deployment  
✅ Error Resilience: Graceful fallbacks for all content
✅ SEO Optimized: Dynamic metadata generation
✅ Preview Mode: Safe content preview for editors
✅ Performance: Smart caching and lazy loading
✅ Maintainability: Clean separation of concerns
✅ Scalability: Modular architecture that grows with needs
✅ Deployment Safety: Validation and health checks
*/