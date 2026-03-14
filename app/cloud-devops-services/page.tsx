import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://omnistack.co.in";

export const metadata: Metadata = {
  title: "Cloud & DevOps Services | AWS, CI/CD & Infrastructure",
  description:
    "Cloud infrastructure, DevOps, CI/CD pipelines, and containerization from OmniStack Solutions. AWS, Docker, Kubernetes. Scalable and secure deployments.",
  keywords: ["cloud DevOps", "AWS", "CI/CD", "Docker Kubernetes", "infrastructure as code", "cloud migration"],
  alternates: { canonical: `${SITE_URL}/cloud-devops-services` },
  openGraph: {
    url: `${SITE_URL}/cloud-devops-services`,
    title: "Cloud & DevOps Services | OmniStack Solutions",
    description: "Cloud infrastructure, CI/CD, Docker, Kubernetes, and scalable deployments.",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Cloud & DevOps Services | OmniStack Solutions" },
};

function ServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Cloud & DevOps Services",
    description: "Cloud infrastructure design, CI/CD pipelines, containerization with Docker and Kubernetes, and scalable cloud deployments.",
    provider: {
      "@type": "Organization",
      name: "OmniStack Solutions Pvt Ltd",
      url: `${SITE_URL}/`,
    },
    areaServed: "Worldwide",
    url: `${SITE_URL}/cloud-devops-services`,
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
      { "@type": "ListItem", position: 3, name: "Cloud & DevOps Services", item: `${SITE_URL}/cloud-devops-services` },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

export default function CloudDevopsServicesPage() {
  return (
    <>
      <ServiceSchema />
      <BreadcrumbSchema />
      <div className="pt-16">
        <section className="py-20 bg-gradient-to-br from-olive-900 to-olive-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Cloud & DevOps Services</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Scalable cloud infrastructure, CI/CD pipelines, and containerization for reliable deployments.
            </p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-olive-900 mb-6">What We Offer</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We design and manage <strong>cloud infrastructure</strong> (AWS, GCP, Azure), <strong>CI/CD pipelines</strong>, and <strong>Docker & Kubernetes</strong> deployments. From infrastructure as code to monitoring and scaling, we keep your systems secure and available.
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              Explore our <Link href="/services" className="text-olive-600 hover:underline font-medium">services</Link>, <Link href="/projects" className="text-olive-600 hover:underline font-medium">projects</Link>, and <Link href="/blogs" className="text-olive-600 hover:underline font-medium">blog</Link>. <Link href="/contact" className="text-olive-600 hover:underline font-medium">Contact us</Link> for a free consultation.
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
