import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { projects } from "@/components/ProjectsSection";
import { caseStudies } from "@/data/caseStudies";
import { getProjectImageAsset } from "@/data/imageAssets";

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);
  
  if (!project) {
    notFound();
  }

  const caseStudy = caseStudies[params.slug];
  if (!caseStudy) {
    notFound();
  }

  const heroImage = getProjectImageAsset(params.slug, project.projectType);

  const getProjectTypeBadge = () => {
    if (!project.projectType) return null;
    const badges = {
      concept: { label: "Concept Project", class: "bg-gray-100 text-gray-600" },
      internal: { label: "Internal Build", class: "bg-blue-50 text-blue-700" },
      "client-nda": { label: "Client Project (NDA)", class: "bg-gray-100 text-gray-600" },
    };
    const badge = badges[project.projectType];
    return (
      <span className={`inline-block px-3 py-1.5 text-xs font-medium rounded-full ${badge.class}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/projects"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors"
          >
            ← Back to Projects
          </Link>
          
          <div className="mb-6">
            {getProjectTypeBadge()}
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-olive-900 mb-6 leading-tight">
            {project.name}
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl">
            {caseStudy.summary}
          </p>

          {/* Hero image */}
          <div className="relative w-full aspect-[16/9] mt-10 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-olive-900 mb-8">Overview</h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div>
              <h3 className="text-lg font-semibold text-olive-900 mb-2">What</h3>
              <p>{caseStudy.overview.what}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-olive-900 mb-2">Why</h3>
              <p>{caseStudy.overview.why}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-olive-900 mb-8">Key Features</h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            {caseStudy.highlights.performance && (
              <div className="p-6 bg-olive-50 rounded-lg border border-olive-100">
                <h3 className="text-lg font-semibold text-olive-900 mb-2">Performance</h3>
                <p>{caseStudy.highlights.performance}</p>
              </div>
            )}
            {caseStudy.highlights.scalability && (
              <div className="p-6 bg-olive-50 rounded-lg border border-olive-100">
                <h3 className="text-lg font-semibold text-olive-900 mb-2">Scalability</h3>
                <p>{caseStudy.highlights.scalability}</p>
              </div>
            )}
            {caseStudy.highlights.security && (
              <div className="p-6 bg-olive-50 rounded-lg border border-olive-100">
                <h3 className="text-lg font-semibold text-olive-900 mb-2">Security</h3>
                <p>{caseStudy.highlights.security}</p>
              </div>
            )}
            {caseStudy.highlights.ux && (
              <div className="p-6 bg-olive-50 rounded-lg border border-olive-100">
                <h3 className="text-lg font-semibold text-olive-900 mb-2">User Experience</h3>
                <p>{caseStudy.highlights.ux}</p>
              </div>
            )}
            {!caseStudy.highlights.performance && 
             !caseStudy.highlights.scalability && 
             !caseStudy.highlights.security && 
             !caseStudy.highlights.ux && (
              <div className="p-6 bg-olive-50 rounded-lg border border-olive-100">
                <p className="text-gray-700">
                  This project demonstrates our technical capabilities and approach to building scalable, 
                  maintainable solutions. The architecture prioritizes performance, security, and user experience 
                  while maintaining code quality and best practices.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-olive-900 mb-6">Problem Statement</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            {caseStudy.problem}
          </p>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-olive-900 mb-6">Solution</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            {caseStudy.solution}
          </p>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-olive-900 mb-8">Tech Stack</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {caseStudy.techStack.frontend.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-olive-900 mb-4">Frontend</h3>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.techStack.frontend.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 text-sm rounded-lg bg-olive-100 text-olive-800 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {caseStudy.techStack.backend.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-olive-900 mb-4">Backend</h3>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.techStack.backend.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 text-sm rounded-lg bg-olive-100 text-olive-800 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {caseStudy.techStack.infrastructure.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-olive-900 mb-4">Infrastructure</h3>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.techStack.infrastructure.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 text-sm rounded-lg bg-olive-100 text-olive-800 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {caseStudy.techStack.tools.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-olive-900 mb-4">Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {caseStudy.techStack.tools.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 text-sm rounded-lg bg-olive-100 text-olive-800 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Outcome */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-olive-900 mb-6">Outcome</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            {caseStudy.outcome}
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      {project.projectType !== "client-nda" && (
        <section className="py-16 bg-gray-50 border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-gray-500 leading-relaxed">
              {project.projectType === "concept" 
                ? "This project is a concept demonstration created to showcase our technical capabilities."
                : "This project is an internal build created to demonstrate our technical capabilities and serve as a reference for client work."}
            </p>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-olive-900 mb-4">
            Have a similar project in mind?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Let's discuss how we can help bring your vision to life.
          </p>
          <Link
            href="/contact"
            className="inline-block btn-primary text-lg px-8 py-4"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
