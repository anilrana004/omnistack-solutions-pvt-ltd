"use client";

import Link from "next/link";
import { useState } from "react";
import { projects } from "@/components/ProjectsSection";
import ProjectThumbnail from "@/components/ProjectThumbnail";

type FilterType = "all" | "concept" | "internal" | "client-nda";

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const getProjectTypeBadge = (projectType?: string) => {
    if (!projectType) return null;
    const badges = {
      concept: { label: "Concept Project", class: "bg-gray-100 text-gray-600" },
      internal: { label: "Internal Build", class: "bg-blue-50 text-blue-700" },
      "client-nda": { label: "Client Project (NDA)", class: "bg-gray-100 text-gray-600" },
    };
    const badge = badges[projectType as keyof typeof badges];
    return (
      <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${badge.class}`}>
        {badge.label}
      </span>
    );
  };

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === "all") return true;
    return project.projectType === activeFilter;
  });

  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "concept", label: "Concept Projects" },
    { id: "internal", label: "Internal Builds" },
    { id: "client-nda", label: "Client Projects (NDA)" },
  ];

  const handleFilterChange = (filterId: FilterType) => {
    setActiveFilter(filterId);
  };

  const handleKeyDown = (event: React.KeyboardEvent, filterId: FilterType) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleFilterChange(filterId);
    }
  };

  return (
    <div className="pt-16">
      <section className="py-20 bg-gradient-to-br from-olive-900 to-olive-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Projects</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Technical demonstrations, internal builds, and capabilities across various
            industries and technologies
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters - Apple Style */}
          <div className="mb-12 flex flex-wrap gap-6 justify-center items-center">
            {filters.map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => handleFilterChange(filter.id)}
                  onKeyDown={(e) => handleKeyDown(e, filter.id)}
                  aria-selected={isActive}
                  role="tab"
                  className={`relative text-[13px] font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2 rounded-sm px-1 py-2 ${
                    isActive
                      ? "text-olive-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {filter.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-olive-900 transition-all duration-200"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Professional Note Section */}
          <div className="mb-12 p-6 bg-olive-50 border border-olive-100 rounded-xl">
            <div className="max-w-4xl mx-auto">
              <p className="text-gray-700 leading-relaxed mb-4 text-sm md:text-base">
                <span className="font-semibold text-olive-900">Note:</span> The projects showcased here are sample demonstrations created to illustrate our technical capabilities and design approach. These examples will be replaced with real client projects as we continue to deliver solutions.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6 text-sm md:text-base">
                If you're looking to build something impactful, we'd love the opportunity to work with you and bring your project to life.
              </p>
              <Link
                href="/contact"
                className="inline-block px-6 py-3 bg-olive-900 hover:bg-olive-800 text-white font-medium rounded-lg transition-colors text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2"
              >
                Start Your Project With Us
              </Link>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="card-clickable block rounded-xl"
                style={{ opacity: 1 }}
              >
                <ProjectThumbnail 
                  projectType={project.projectType}
                  projectName={project.name}
                  projectSlug={project.slug}
                />
                <div className="p-6">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-olive-100 text-olive-800">
                      {project.category}
                    </span>
                    <div className="flex-shrink-0">
                      {getProjectTypeBadge(project.projectType)}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-olive-900 mb-3">
                    {project.name}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-sm rounded-lg bg-olive-100 text-olive-800 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="px-3 py-1 text-sm rounded-lg bg-gray-100 text-gray-600 font-medium">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="inline-flex items-center text-sm font-medium text-olive-600">
                    View Case Study →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-sm text-gray-500">No projects available in this category.</p>
            </div>
          )}

          {/* Additional Project Placeholder */}
          {filteredProjects.length > 0 && (
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-4">
                More projects coming soon. Have a project in mind?
              </p>
              <Link
                href="/contact"
                className="inline-block btn-primary"
              >
                Start Your Project
              </Link>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
