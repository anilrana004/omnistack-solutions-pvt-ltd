import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://omnistack.co.in";

export const metadata: Metadata = {
  title: "Startup MVP Development | Fast, Scalable MVP from India",
  description:
    "Build your startup MVP with OmniStack Solutions. Fast, scalable MVPs for web and mobile. React, Next.js, Node.js. Fixed scope and timeline. Free discovery call.",
  keywords: ["startup MVP", "MVP development", "MVP development India", "minimum viable product", "startup development"],
  alternates: { canonical: `${SITE_URL}/startup-mvp-development` },
  openGraph: {
    url: `${SITE_URL}/startup-mvp-development`,
    title: "Startup MVP Development | OmniStack Solutions",
    description: "Fast, scalable MVP development for startups. Web and mobile. Fixed scope and timeline.",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Startup MVP Development | OmniStack Solutions" },
};

function ServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Startup MVP Development",
    description: "End-to-end MVP development for startups: web and mobile apps, scalable architecture, fixed scope and timeline.",
    provider: {
      "@type": "Organization",
      name: "OmniStack Solutions Pvt Ltd",
      url: `${SITE_URL}/`,
    },
    areaServed: "Worldwide",
    url: `${SITE_URL}/startup-mvp-development`,
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
      { "@type": "ListItem", position: 2, name: "Startup MVP Development", item: `${SITE_URL}/startup-mvp-development` },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

export default function StartupMvpDevelopmentPage() {
  return (
    <>
      <ServiceSchema />
      <BreadcrumbSchema />
      <div className="pt-16">
        <section className="py-20 bg-gradient-to-br from-olive-900 to-olive-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Startup MVP Development</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Fast, scalable MVPs for startups. Web and mobile. Fixed scope and timeline so you can launch and iterate.
            </p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-olive-900 mb-6">Why Build Your MVP With Us?</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We specialize in <strong>MVP development</strong> for startups: clear scope, fixed timelines, and scalable tech (React, Next.js, Node.js, React Native). From idea to first release, we help you validate quickly without overspending.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              Explore our <Link href="/services" className="text-olive-600 hover:underline font-medium">services</Link>, <Link href="/projects" className="text-olive-600 hover:underline font-medium">portfolio</Link>, and <Link href="/blogs" className="text-olive-600 hover:underline font-medium">blog</Link>. <Link href="/contact" className="text-olive-600 hover:underline font-medium">Contact us</Link> for a free discovery call.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-olive-600 text-white rounded-lg font-semibold hover:bg-olive-700 transition-colors"
            >
              Book a Discovery Call
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
