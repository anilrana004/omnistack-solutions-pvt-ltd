import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://omnistack.co.in";

export const metadata: Metadata = {
  title: "Hire Node.js Developers | Backend & API Development Team India",
  description:
    "Hire Node.js and Express developers from OmniStack Solutions. Scalable APIs, microservices, and backend systems. Fixed-price or dedicated team. Free consultation.",
  keywords: ["hire Node.js developers", "Node.js developers India", "backend developers", "API development", "Express.js"],
  alternates: { canonical: `${SITE_URL}/hire-nodejs-developers` },
  openGraph: {
    url: `${SITE_URL}/hire-nodejs-developers`,
    title: "Hire Node.js Developers | OmniStack Solutions",
    description: "Expert Node.js & Express developers for APIs, microservices, and backend systems.",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Hire Node.js Developers | OmniStack Solutions" },
};

function ServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Hire Node.js Developers",
    description: "Hire dedicated Node.js and Express developers for scalable APIs, microservices, and backend systems.",
    provider: {
      "@type": "Organization",
      name: "OmniStack Solutions Pvt Ltd",
      url: `${SITE_URL}/`,
    },
    areaServed: "Worldwide",
    url: `${SITE_URL}/hire-nodejs-developers`,
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
      { "@type": "ListItem", position: 2, name: "Hire Node.js Developers", item: `${SITE_URL}/hire-nodejs-developers` },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

export default function HireNodejsDevelopersPage() {
  return (
    <>
      <ServiceSchema />
      <BreadcrumbSchema />
      <div className="pt-16">
        <section className="py-20 bg-gradient-to-br from-olive-900 to-olive-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Hire Node.js Developers</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Expert Node.js and Express developers for scalable APIs, microservices, and backend systems.
            </p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-olive-900 mb-6">Why Hire Our Node.js Developers?</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We build <strong>REST and GraphQL APIs</strong>, <strong>microservices</strong>, and real-time backends with <strong>Node.js</strong>, <strong>Express</strong>, and TypeScript. From MongoDB to PostgreSQL, we deliver scalable, secure backends.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              Explore our <Link href="/services" className="text-olive-600 hover:underline font-medium">services</Link> and <Link href="/projects" className="text-olive-600 hover:underline font-medium">projects</Link>, or <Link href="/blogs" className="text-olive-600 hover:underline font-medium">read our blog</Link> for backend best practices. Ready to start? <Link href="/contact" className="text-olive-600 hover:underline font-medium">Contact us</Link> for a free consultation.
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
