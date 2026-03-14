import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://omnistack.co.in";

export const metadata: Metadata = {
  title: "Hire React Developers | Expert React & Next.js Team India",
  description:
    "Hire dedicated React and Next.js developers from OmniStack Solutions. Build scalable SPAs, dashboards, and modern web apps. Fixed-price or dedicated team. Free consultation.",
  keywords: ["hire React developers", "React developers India", "Next.js developers", "frontend development", "React outsourcing"],
  alternates: { canonical: `${SITE_URL}/hire-react-developers` },
  openGraph: {
    url: `${SITE_URL}/hire-react-developers`,
    title: "Hire React Developers | OmniStack Solutions",
    description: "Expert React & Next.js developers. Scalable web apps, SPAs, and dashboards. India-based team.",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Hire React Developers | OmniStack Solutions" },
};

function ServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Hire React Developers",
    description: "Hire dedicated React and Next.js developers from OmniStack Solutions for scalable web applications, SPAs, and dashboards.",
    provider: {
      "@type": "Organization",
      name: "OmniStack Solutions Pvt Ltd",
      url: `${SITE_URL}/`,
    },
    areaServed: "Worldwide",
    url: `${SITE_URL}/hire-react-developers`,
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
      { "@type": "ListItem", position: 2, name: "Hire React Developers", item: `${SITE_URL}/hire-react-developers` },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

export default function HireReactDevelopersPage() {
  return (
    <>
      <ServiceSchema />
      <BreadcrumbSchema />
      <div className="pt-16">
        <section className="py-20 bg-gradient-to-br from-olive-900 to-olive-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Hire React Developers</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Expert React and Next.js developers to build scalable web applications, SPAs, and dashboards for your business.
            </p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-olive-900 mb-6">Why Hire Our React Developers?</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our team specializes in <strong>React</strong>, <strong>Next.js</strong>, and TypeScript. We deliver production-ready SPAs, admin dashboards, and headless frontends with clean architecture and performance in mind.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              Whether you need a dedicated React developer or a full team for a fixed-scope project, we offer flexible engagement models. Explore our <Link href="/services" className="text-olive-600 hover:underline font-medium">services</Link> and <Link href="/projects" className="text-olive-600 hover:underline font-medium">projects</Link>, or read our <Link href="/blogs" className="text-olive-600 hover:underline font-medium">blog</Link> for technical insights.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-olive-600 text-white rounded-lg font-semibold hover:bg-olive-700 transition-colors"
            >
              Get a Free Quote
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
