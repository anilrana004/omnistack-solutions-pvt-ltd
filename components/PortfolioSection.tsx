"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ArrowRight } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  category: string;
  image: string;
  alt?: string;
}

const featuredProjects: Project[] = [
  {
    id: "1",
    name: "SaaS Analytics Dashboard",
    description:
      "Real-time analytics platform with customizable dashboards, data visualization, and team collaboration features.",
    techStack: ["Next.js", "React", "Node.js", "PostgreSQL", "AWS"],
    category: "SaaS",
    image: "/dashboard/saas-analytics-dashboard.png.jpg",
    alt: "SaaS analytics dashboard showing real-time business metrics and performance insights",
  },
  {
    id: "2",
    name: "AI Automation System",
    description:
      "Intelligent workflow automation platform that reduces manual tasks by 80% using AI-powered decision making.",
    techStack: ["Python", "OpenAI", "FastAPI", "Docker", "Kubernetes"],
    category: "AI & Automation",
    image: "/dashboard/ai-workflow.png.png",
    alt: "AI automation workflow showing connected steps, triggers, and outcome cards",
  },
  {
    id: "3",
    name: "Mobile App Platform",
    description:
      "Cross-platform mobile application with native performance, offline capabilities, and seamless cloud sync.",
    techStack: ["React Native", "TypeScript", "Firebase", "AWS", "Stripe"],
    category: "Mobile",
    image: "/dashboard/mobile-app-hero.png.webp",
    alt: "Mobile app platform dashboard preview showing key screens and feature highlights",
  },
];

export default function PortfolioSection() {
  return (
    <section
      className={[
        "omni-bg-overlay py-20",
        "bg-[url('/images/backgrounds/featured-projects-bg.jpg.jpg')] bg-cover bg-no-repeat",
        // Mobile: bias slightly upward to avoid cropping key areas
        "bg-[position:50%_25%] md:bg-center",
      ].join(" ")}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Explore some of our recent work and client success stories
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => (
            <div
              key={project.id}
              className="group omni-glass-card overflow-hidden"
              style={{
                animation: `fadeUp 0.6s ease-out ${index * 0.15}s both`,
              }}
            >
              {/* Use a stable 16:9 dashboard box so images can fill perfectly */}
              <div className="relative w-full aspect-video bg-gradient-to-br from-olive-100 to-olive-200 overflow-hidden">
                {/**
                 * For dashboard-style images we want the whole screenshot visible,
                 * so use object-contain with a little padding instead of cropping.
                 */}
                {(() => {
                  const isDashboardImage = project.image.startsWith("/dashboard/");
                  return (
                    <Image
                      src={project.image}
                      alt={project.alt ?? `${project.name} preview image`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      // Dashboard images should fill the box edge-to-edge.
                      // For a perfect fit with no cropping, export the image in 16:9.
                      className={isDashboardImage ? "object-cover object-center" : "object-cover"}
                      priority={index === 0}
                    />
                  );
                })()}
                <div className="absolute inset-0 bg-gradient-to-t from-olive-900/50 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-olive-900">
                    {project.category}
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-olive-400/20 to-olive-500/20 blur-2xl md:group-hover:scale-150 transition-transform duration-500"></div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-50 mb-3">
                  {project.name}
                </h3>
                <p className="text-white/85 mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs rounded-lg bg-white/10 text-white/85 font-medium border border-white/15"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <Link
                  href="/projects"
                  className="inline-flex items-center space-x-2 text-white/90 font-semibold transition-colors group/link [@media(hover:hover)]:hover:text-white"
                >
                  <span>View Case Study</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
