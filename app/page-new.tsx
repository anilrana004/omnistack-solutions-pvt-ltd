import { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

// New CMS-driven components
import PageLayout from "@/src/components/layouts/PageLayout";
import { HeroSection, ServicesSection, BlogSection, TestimonialSection } from "@/src/components/sections";

// API layer
import {
  getPageBySlug,
  getAllServices,
  getAllBlogs,
  getAllTestimonials,
  getSiteSettings,
} from "@/src/lib/sanity.api";
import { getFeatureFlags } from "@/src/lib/feature-flags";
import { createSEOManager } from "@/src/lib/seo";
import { isPreviewMode } from "@/src/lib/preview-utils";

// Legacy components (to be gradually migrated)
const PortfolioSection = dynamic(() => import("@/components/PortfolioSection"), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-white/5 rounded-xl" />,
});
const ProjectsSection = dynamic(() => import("@/components/ProjectsSection"), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-white/5 rounded-xl" />,
});
const EnterprisePositioning = dynamic(() => import("@/components/EnterprisePositioning"), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-white/5 rounded-xl" />,
});
const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-white/5 rounded-xl" />,
});
const CTASection = dynamic(() => import("@/components/CTASection"), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-white/5 rounded-xl" />,
});
const InstagramFeed = dynamic(() => import("@/components/InstagramFeed"), {
  loading: () => <div className="min-h-[400px] animate-pulse bg-white/5 rounded-xl" />,
  ssr: false,
});

export const revalidate = 60;

// Generate metadata using the new SEO system
export async function generateMetadata(): Promise<Metadata> {
  const preview = isPreviewMode();
  
  // Get page data and site settings
  const [pageResult, settingsResult] = await Promise.all([
    getPageBySlug('home', preview),
    getSiteSettings(),
  ]);

  const page = pageResult.data;
  const settings = settingsResult.data;

  // Generate SEO metadata
  const seoManager = createSEOManager(settings || undefined);
  
  if (page) {
    return seoManager.generatePageMetadata(page, '/');
  }
  
  // Fallback metadata
  return seoManager.generateDefaultMetadata(
    settings?.title || 'OmniStack Solutions',
    settings?.description || 'Building Everything. Empowering Everyone.',
    '/'
  );
}

async function HomePageContent() {
  const preview = isPreviewMode();

  // Fetch all content in parallel with feature flags
  const [
    pageResult,
    servicesResult, 
    blogsResult,
    testimonialsResult,
    featureFlags,
  ] = await Promise.all([
    getPageBySlug('home', preview),
    getAllServices(preview),
    getAllBlogs(preview),
    getAllTestimonials(),
    getFeatureFlags(),
  ]);

  // Extract data
  const page = pageResult.data;
  const services = servicesResult.data || [];
  const blogs = blogsResult.data || [];
  const testimonials = testimonialsResult.data || [];

  return (
    <>
      {/* Hero Section - CMS Driven */}
      <HeroSection
        hero={page?.hero}
        loading={pageResult.success === false}
        error={pageResult.error}
      />

      {/* Services Section - CMS Driven */}
      <ServicesSection
        services={services.filter(s => s.status === 'published')}
        loading={servicesResult.success === false}
        error={servicesResult.error}
      />

      {/* Legacy Components (to be migrated) */}
      <PortfolioSection />
      <ProjectsSection />

      {/* Testimonials Section - CMS Driven with Feature Flag */}
      {featureFlags.showTestimonials && (
        <TestimonialSection
          testimonials={testimonials.filter(t => t.isEnabled)}
          loading={testimonialsResult.success === false}
          error={testimonialsResult.error}
        />
      )}

      {/* Instagram Feed - Feature Flagged */}
      {featureFlags.enableInstagramFeed && (
        <Suspense fallback={<div className="min-h-[400px] animate-pulse bg-white/5 rounded-xl" />}>
          <InstagramFeed />
        </Suspense>
      )}

      {/* Blog Section - CMS Driven with Feature Flag */}
      {featureFlags.showBlogs && (
        <BlogSection
          blogs={blogs}
          loading={blogsResult.success === false}
          error={blogsResult.error}
          maxPosts={3}
          showViewAll={true}
        />
      )}

      {/* Legacy Components (to be migrated) */}
      <EnterprisePositioning />
      <WhyChooseUs />
      <CTASection />
    </>
  );
}

export default async function HomePage() {
  return (
    <PageLayout
      documentType="page"
      documentId="home"
    >
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-600" />
        </div>
      }>
        <HomePageContent />
      </Suspense>
    </PageLayout>
  );
}