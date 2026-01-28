import ServicesSection from "@/components/ServicesSection";
import Link from "next/link";
import { services } from "@/data/services";

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

export default function ServicesPage() {
  return (
    <div className="pt-16">
      <section className="py-20 bg-gradient-to-br from-olive-900 to-olive-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Services</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive technology solutions to power your business growth
          </p>
        </div>
      </section>

      <ServicesSection showAll={true} />

      {/* Detailed Service Descriptions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-olive-900">
            Service Details
          </h2>
          <div className="space-y-14">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } gap-10 items-start`}
              >
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-olive-900 mb-3">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4 text-olive-900">
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
    </div>
  );
}






