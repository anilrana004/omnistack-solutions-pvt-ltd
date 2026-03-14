import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://omnistack.co.in";

export const metadata: Metadata = {
  title: "AI & Automation Services | Chatbots, Workflows & ML Solutions",
  description:
    "OmniStack Solutions offers AI integration, workflow automation, chatbots, and ML solutions. Reduce manual work and scale operations. Free strategy call.",
  keywords: ["AI automation", "workflow automation", "AI chatbots", "machine learning", "AI integration India"],
  alternates: { canonical: `${SITE_URL}/ai-automation-services` },
  openGraph: {
    url: `${SITE_URL}/ai-automation-services`,
    title: "AI & Automation Services | OmniStack Solutions",
    description: "AI integration, chatbots, workflow automation, and ML solutions for businesses.",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "AI & Automation Services | OmniStack Solutions" },
};

function ServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI & Automation Services",
    description: "AI integration, workflow automation, chatbots, and machine learning solutions to streamline operations and reduce manual work.",
    provider: {
      "@type": "Organization",
      name: "OmniStack Solutions Pvt Ltd",
      url: `${SITE_URL}/`,
    },
    areaServed: "Worldwide",
    url: `${SITE_URL}/ai-automation-services`,
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

function BreadcrumbSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
      { "@type": "ListItem", position: 3, name: "AI & Automation Services", item: `${SITE_URL}/ai-automation-services` },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

export default function AiAutomationServicesPage() {
  return (
    <>
      <ServiceSchema />
      <BreadcrumbSchema />
      <div className="pt-16">
        <section className="py-20 bg-gradient-to-br from-olive-900 to-olive-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">AI & Automation Services</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              AI-powered systems and workflow automation to streamline operations and scale your business.
            </p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-olive-900 mb-6">What We Offer</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We implement <strong>AI chatbots</strong>, <strong>workflow automation</strong>, and <strong>ML-powered tools</strong> using modern APIs and frameworks. From document processing to customer support automation, we help you reduce manual work and improve decision-making.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              See our <Link href="/services" className="text-olive-600 hover:underline font-medium">full services</Link>, <Link href="/projects" className="text-olive-600 hover:underline font-medium">projects</Link>, and <Link href="/blogs" className="text-olive-600 hover:underline font-medium">blog</Link> for AI and automation insights. <Link href="/contact" className="text-olive-600 hover:underline font-medium">Contact us</Link> for a free strategy call.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-olive-600 text-white rounded-lg font-semibold hover:bg-olive-700 transition-colors"
            >
              Schedule a Call
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
