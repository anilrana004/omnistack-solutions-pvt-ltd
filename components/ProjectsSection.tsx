import React from "react";
import Link from "next/link";
import type { Project } from "@/types";
import ProjectThumbnail from "./ProjectThumbnail";

const projects: Project[] = [
  {
    id: "1",
    name: "SaaS Analytics Dashboard",
    slug: "saas-analytics-dashboard",
    description:
      "Concept demonstration of a real-time analytics platform showcasing customizable dashboards, data visualization, and team collaboration capabilities.",
    techStack: ["React", "Next.js", "Node.js", "PostgreSQL", "AWS"],
    category: "SaaS",
    projectType: "concept",
  },
  {
    id: "2",
    name: "E-Commerce Platform",
    slug: "ecommerce-platform",
    description:
      "Internal build demonstrating modern e-commerce architecture with payment integration, inventory management, and admin dashboard functionality.",
    techStack: ["Next.js", "TypeScript", "MongoDB", "Stripe", "Tailwind CSS"],
    category: "E-Commerce",
    projectType: "internal",
  },
  {
    id: "3",
    name: "AI Business Chatbot",
    slug: "ai-business-chatbot",
    description:
      "Concept project illustrating intelligent customer support capabilities with natural language processing and CRM integration patterns.",
    techStack: ["Python", "OpenAI API", "React", "FastAPI", "Docker"],
    category: "AI & Automation",
    projectType: "concept",
  },
  {
    id: "4",
    name: "Cloud Migration Platform",
    slug: "cloud-migration-platform",
    description:
      "Internal tool built to demonstrate enterprise cloud migration workflows and AWS automation strategies for client reference.",
    techStack: ["React", "Node.js", "AWS SDK", "Docker", "Terraform"],
    category: "Cloud & DevOps",
    projectType: "internal",
  },
  {
    id: "5",
    name: "Tech Founder Personal Branding",
    slug: "tech-founder-personal-branding",
    description:
      "Client project under NDA. Personal branding strategy including LinkedIn positioning, thought leadership content, and media relations.",
    techStack: ["LinkedIn", "Content Strategy", "Media Relations", "PR Outreach", "Analytics"],
    category: "PR & Personal Branding",
    projectType: "client-nda",
  },
  {
    id: "6",
    name: "E-Commerce Brand Social Media Growth",
    slug: "ecommerce-brand-social-media-growth",
    description:
      "Client project under NDA. Multi-platform social media management and PR campaign focusing on brand visibility and publication features.",
    techStack: ["Instagram", "Facebook", "Content Creation", "Influencer PR", "Growth Strategy"],
    category: "PR & Personal Branding",
    projectType: "client-nda",
  },
  {
    id: "7",
    name: "Full-Stack Customer Experience Platform",
    slug: "full-stack-customer-experience-platform",
    description:
      "Concept demonstration of an end-to-end platform architecture combining Next.js frontend, Node.js APIs, and PostgreSQL for customer portals and analytics.",
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Tailwind CSS", "REST APIs"],
    category: "Full-Stack",
    projectType: "concept",
  },
];

interface ProjectsSectionProps {
  showAll?: boolean;
}

export default function ProjectsSection({ showAll = false }: ProjectsSectionProps) {
  // Show all projects on projects page, first 3 on home page
  const displayProjects = showAll ? projects : projects.slice(0, 3);

  return (
    <section
      className={[
        "omni-bg-overlay py-20",
        // Background only (no overlay/effects)
        // NOTE: filename contains a space; URL-encode it.
        "bg-[url('/images/backgrounds/projects-use-cases-bg.jpg%20(2).jpg')] bg-cover bg-center bg-no-repeat",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
          Projects & Use Cases
        </h2>
        <p className="text-center text-white/80 mb-12 max-w-2xl mx-auto">
          Technical demonstrations and project capabilities showcasing our expertise.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project) => {
            const getProjectTypeBadge = () => {
              if (!project.projectType) return null;
              const badges = {
                concept: { label: "Concept Project", class: "bg-white/10 text-white/80 border border-white/15" },
                internal: { label: "Internal Build", class: "bg-white/10 text-white/80 border border-white/15" },
                "client-nda": { label: "Client Project (NDA)", class: "bg-white/10 text-white/80 border border-white/15" },
              };
              const badge = badges[project.projectType];
              return (
                <span
                  className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${badge.class} mr-2`}
                >
                  {badge.label}
                </span>
              );
            };

            return (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="card-clickable omni-glass-card block rounded-xl"
              >
                <ProjectThumbnail 
                  projectType={project.projectType}
                  projectName={project.name}
                  projectSlug={project.slug}
                />
                <div className="p-6">
                  <div className="mb-3 flex items-center gap-2 flex-wrap">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-white/10 text-white/85 border border-white/15">
                      {project.category}
                    </span>
                    {getProjectTypeBadge()}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-50 mb-3">
                    {project.name}
                  </h3>
                  <p className="text-white/85 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-sm rounded-lg bg-white/10 text-white/85 font-medium border border-white/15"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="px-3 py-1 text-sm rounded-lg bg-white/10 text-white/75 font-medium border border-white/15">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="inline-flex items-center text-sm font-medium text-white/90">
                    View Case Study →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Disclaimer for Homepage */}
        {!showAll && (
          <div className="mt-16 pt-8 border-t border-white/20">
            <p className="text-sm text-white/75 text-center max-w-3xl mx-auto">
              Some projects shown are internal builds or concept demonstrations created to showcase our technical capabilities. Client projects under NDA are not publicly displayed.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export { projects };


