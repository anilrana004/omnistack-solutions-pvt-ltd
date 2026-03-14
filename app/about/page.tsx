import type { Metadata } from "next";
import { CheckCircle2, Lightbulb, Rocket, Headphones } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://omnistack.co.in";

export const metadata: Metadata = {
  title: "About Us | Full Stack Development Company India",
  description:
    "OmniStack Solutions is a full-stack technology company in India. We build websites, mobile apps, AI tools, and cloud infrastructure. Learn about our process and values.",
  keywords: ["about OmniStack", "full stack company India", "web development team", "software development process"],
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    url: `${SITE_URL}/about`,
    title: "About Us | OmniStack Solutions",
    description: "Full-stack technology company building websites, apps, AI, and cloud solutions. Discovery, design, development, and support.",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "About Us | OmniStack Solutions", description: "Full-stack technology company building websites, apps, AI, and cloud solutions." },
};

function BreadcrumbSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

const processSteps = [
  {
    step: "1",
    title: "Discovery",
    description:
      "We start by understanding your business goals, target audience, and technical requirements through detailed consultations.",
    icon: Lightbulb,
  },
  {
    step: "2",
    title: "Design & Architecture",
    description:
      "Our team designs the system architecture, user experience, and technical specifications to ensure scalability and maintainability.",
    icon: CheckCircle2,
  },
  {
    step: "3",
    title: "Development",
    description:
      "We build your solution using agile methodologies, with regular updates and iterations based on your feedback.",
    icon: Rocket,
  },
  {
    step: "4",
    title: "Launch & Support",
    description:
      "We deploy your solution and provide ongoing support, maintenance, and optimization to ensure long-term success.",
    icon: Headphones,
  },
];

const coreValues = [
  "Quality First: We never compromise on code quality and best practices",
  "Client Partnership: Your success is our success",
  "Transparency: Clear communication and regular updates throughout",
  "Innovation: We stay ahead with the latest technologies and trends",
];

export default function AboutPage() {
  return (
    <div className="pt-16">
      <BreadcrumbSchema />
      {/* Hero Section */}
      <header>
        <section className="py-20 bg-gradient-to-br from-olive-900 to-olive-950 text-white" aria-label="About us overview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About OmniStack Solutions
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Building full-stack solutions that drive business growth
          </p>
        </div>
      </section>
      </header>

      {/* About Content */}
      <section className="py-20 bg-white" aria-labelledby="about-content-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="about-content-heading" className="sr-only">About OmniStack Solutions</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              OmniStack Solutions is a full-stack technology company specializing
              in delivering comprehensive digital solutions for modern businesses.
              We build websites, mobile applications, AI-powered tools, cloud
              infrastructure, and automation systems that help companies grow and
              scale efficiently.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Our approach focuses on clean, scalable code, exceptional
              performance, and long-term partnership with our clients. We believe
              in creating solutions that not only solve immediate problems but
              also adapt and evolve with your business needs.
            </p>
            <p className="text-gray-700 leading-relaxed">
              With expertise spanning the entire technology stack—from frontend
              user interfaces to backend APIs, databases, cloud infrastructure,
              and AI integration—we provide end-to-end ownership of your digital
              products. This means you get a cohesive, well-architected solution
              built by a single team that understands every layer of your
              application.
            </p>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20 bg-gray-50" aria-labelledby="our-process-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="our-process-heading" className="text-4xl font-bold text-center mb-4 text-olive-900">
            Our Process
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            A structured approach to delivering successful projects
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-olive-600 text-white text-2xl font-bold mb-4">
                    {step.step}
                  </div>
                  <Icon className="w-8 h-8 mx-auto mb-4 text-olive-600" />
                  <h3 className="text-xl font-bold text-olive-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white" aria-labelledby="core-values-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="core-values-heading" className="text-4xl font-bold text-center mb-12 text-olive-900">
            Core Values
          </h2>
          <ul className="space-y-4">
            {coreValues.map((value, index) => (
              <li
                key={index}
                className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <CheckCircle2 className="w-6 h-6 text-olive-600 flex-shrink-0 mt-1" />
                <span className="text-gray-700 text-lg">{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
