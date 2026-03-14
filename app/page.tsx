import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";

export const revalidate = 60;

// Lazy load Services and all below-the-fold sections for faster FCP/LCP
const ServicesSection = dynamic(() => import("@/components/ServicesSection"), {
  loading: () => <div className="min-h-[280px]" aria-hidden="true" />,
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://omnistack.co.in";

export const metadata: Metadata = {
  title: "OmniStack Solutions | Full Stack Development Company India",
  description:
    "Full stack web development, AI automation, and mobile apps from a senior team in India. Launch faster and grow smarter—book a free strategy call today.",
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    url: `${SITE_URL}/`,
    title: "OmniStack Solutions | Full Stack Development Company India",
    description:
      "Full stack web development, AI automation, and mobile apps from a senior team in India. Launch faster and grow smarter—book a free strategy call today.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OmniStack Solutions | Full Stack Development Company India",
    description:
      "Full stack web development, AI automation, and mobile apps from a senior team in India. Launch faster and grow smarter—book a free strategy call today.",
  },
};

const TestimonialSection = dynamic(() => import("@/components/TestimonialSection"), {
  loading: () => <div className="min-h-[280px]" aria-hidden="true" />,
});
const InstagramFeed = dynamic(() => import("@/components/InstagramFeed"), {
  loading: () => <div className="min-h-[200px]" aria-hidden="true" />,
  ssr: false,
});
const PortfolioSection = dynamic(() => import("@/components/PortfolioSection"), {
  loading: () => <div className="min-h-[280px]" aria-hidden="true" />,
});
const ProjectsSection = dynamic(() => import("@/components/ProjectsSection"), {
  loading: () => <div className="min-h-[280px]" aria-hidden="true" />,
});
const BlogSection = dynamic(() => import("@/components/BlogSection"), {
  loading: () => <div className="min-h-[280px]" aria-hidden="true" />,
});
const EnterprisePositioning = dynamic(() => import("@/components/EnterprisePositioning"), {
  loading: () => <div className="min-h-[200px]" aria-hidden="true" />,
});
const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"), {
  loading: () => <div className="min-h-[280px]" aria-hidden="true" />,
});
const CTASection = dynamic(() => import("@/components/CTASection"), {
  loading: () => <div className="min-h-[200px]" aria-hidden="true" />,
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
