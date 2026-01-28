import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";

export const revalidate = 60;

// Lazy load below-the-fold sections
const TestimonialSection = dynamic(() => import("@/components/TestimonialSection"), {
  loading: () => <div className="min-h-[400px]" aria-hidden="true" />,
});
const InstagramFeed = dynamic(() => import("@/components/InstagramFeed"), {
  loading: () => <div className="min-h-[400px]" aria-hidden="true" />,
  ssr: false,
});
const PortfolioSection = dynamic(() => import("@/components/PortfolioSection"), {
  loading: () => <div className="min-h-[400px]" aria-hidden="true" />,
});
const ProjectsSection = dynamic(() => import("@/components/ProjectsSection"), {
  loading: () => <div className="min-h-[400px]" aria-hidden="true" />,
});
const BlogSection = dynamic(() => import("@/components/BlogSection"), {
  loading: () => <div className="min-h-[400px]" aria-hidden="true" />,
});
const EnterprisePositioning = dynamic(() => import("@/components/EnterprisePositioning"), {
  loading: () => <div className="min-h-[400px]" aria-hidden="true" />,
});
const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"), {
  loading: () => <div className="min-h-[400px]" aria-hidden="true" />,
});
const CTASection = dynamic(() => import("@/components/CTASection"), {
  loading: () => <div className="min-h-[400px]" aria-hidden="true" />,
});

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <TestimonialSection />
      <InstagramFeed
        title="Follow Our Journey"
        subtitle="Behind the scenes, project updates, and tech insights from our team"
      />
      <PortfolioSection />
      <ProjectsSection />
      <BlogSection />
      <EnterprisePositioning />
      {/* Removed Technology That Moves section */}
      <WhyChooseUs />
      <CTASection />
    </>
  );
}
