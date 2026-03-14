import type { Metadata } from "next";
import ServicesSection from "@/components/ServicesSection";
import Link from "next/link";
import { services } from "@/data/services";
import { faqs } from "@/data/faqs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://omnistack.co.in";

export const metadata: Metadata = {
  title: "Services | Full Stack, AI, Mobile & Cloud Development",
  description:
    "Comprehensive technology solutions: full stack web development, mobile apps, AI automation, cloud & DevOps, SEO. Scalable solutions for growing businesses.",
  keywords: ["web development services", "mobile app development", "AI automation", "cloud DevOps", "full stack development India"],
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    url: `${SITE_URL}/services`,
    title: "Services | OmniStack Solutions",
    description: "Full stack, mobile, AI, cloud & DevOps services. Power your business growth with scalable technology.",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Services | OmniStack Solutions" },
};

const techStack = [
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "TypeScript",
  "MongoDB",
  "PostgreSQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "Python",
  "TensorFlow",
  "OpenAI API",
];

function BreadcrumbSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

const SERVICE_FAQS = faqs.slice(0, 6);

function ServiceFAQSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SERVICE_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

const TOPIC_CLUSTERS = [
  { href: "/hire-react-developers", label: "Web Development", description: "React & Next.js development" },
  { href: "/hire-nodejs-developers", label: "Backend Development", description: "Node.js & API development" },
  { href: "/ai-automation-services", label: "AI & Automation", description: "AI integration and workflow automation" },
  { href: "/cloud-devops-services", label: "Cloud & DevOps", description: "Cloud infrastructure and CI/CD" },
  { href: "/startup-mvp-development", label: "Startup MVP", description: "MVP development for startups" },
] as const;

export default function ServicesPage() {
  return (
    <div className="pt-16">
      <BreadcrumbSchema />
      <ServiceFAQSchema />
      <header>
        <section className="py-20 bg-gradient-to-br from-olive-900 to-olive-950 text-white" aria-label="Services overview">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Services</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive technology solutions to power your business growth
            </p>
          </div>
        </section>
      </header>

      <ServicesSection showAll={true} />

      {/* Topic cluster: pillar and supporting pages */}
      <section className="py-16 bg-gray-50" aria-labelledby="topic-cluster-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="topic-cluster-heading" className="text-3xl font-bold text-center mb-8 text-olive-900">
            Explore by topic
          </h2>
          <nav className="flex flex-wrap justify-center gap-4" aria-label="Service topic clusters">
            {TOPIC_CLUSTERS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-5 py-3 rounded-lg bg-white border border-olive-200 text-olive-800 font-medium hover:border-olive-500 hover:bg-olive-50 transition-colors"
              >
                <span className="block font-semibold">{item.label}</span>
                <span className="block text-sm text-gray-600 font-normal">{item.description}</span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* Detailed Service Descriptions */}
      <section className="py-20 bg-white" aria-labelledby="service-details-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="service-details-heading" className="text-4xl font-bold text-center mb-12 text-olive-900">
            Service Details
          </h2>
          <div className="space-y-14">
            {services.map((service, index) => (
              <article
                key={service.id}
                aria-labelledby={`service-${service.id}-title`}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } gap-10 items-start`}
              >
                <div className="flex-1">
                  <h3 id={`service-${service.id}-title`} className="text-3xl font-bold text-olive-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-5">
                    {service.fullDescription}
                  </p>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-semibold text-olive-900 uppercase tracking-wide mb-3">
                        How we work
                      </h4>
                      <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                        {service.processSteps.map((step) => (
                          <li key={step} className="leading-relaxed">
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-olive-900 uppercase tracking-wide mb-3">
                        What you get
                      </h4>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        {service.deliverables.map((item) => (
                          <li key={item} className="leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {service.tools.length > 0 ? (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-olive-900 uppercase tracking-wide mb-3">
                        Tools & technologies
                      </h4>
                      <ul className="flex flex-wrap gap-2">
                        {service.tools.map((tool) => (
                          <li
                            key={tool}
                            className="px-3 py-1.5 text-sm rounded-lg bg-olive-100 text-olive-800 font-medium"
                          >
                            {tool}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <Link
                      href={`/contact?project=${encodeURIComponent(service.id)}`}
                      className="btn-primary"
                    >
                      {service.ctaText}
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-olive-900 bg-white border-2 border-olive-900 hover:bg-olive-900 hover:text-white transition-all duration-300"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ section with rich snippet markup */}
      <section className="py-20 bg-white" aria-labelledby="services-faq-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="services-faq-heading" className="text-4xl font-bold text-center mb-12 text-olive-900">
            Frequently asked questions
          </h2>
          <dl className="space-y-6">
            {SERVICE_FAQS.map((faq, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-6 last:border-0">
                <dt className="text-lg font-semibold text-olive-900 mb-2">{faq.question}</dt>
                <dd className="text-gray-600 leading-relaxed">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-gray-50" aria-labelledby="tech-stack-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="tech-stack-heading" className="text-4xl font-bold text-center mb-4 text-olive-900">
            Tech Stack We Use
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We work with the latest technologies and tools to build modern,
            scalable solutions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-6 py-3 rounded-lg bg-white border-2 border-olive-200 text-olive-800 font-semibold hover:border-olive-500 hover:text-olive-600 transition-all duration-300 cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Content freshness signal */}
      <p className="text-center text-sm text-gray-500 py-6" aria-label="Content freshness">
        Content last updated: {new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
      </p>
    </div>
  );
}






