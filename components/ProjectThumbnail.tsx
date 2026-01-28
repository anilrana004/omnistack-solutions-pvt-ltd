"use client";

import React, { useEffect, useRef, useState } from "react";
import VisualPreview from "./VisualPreview";

interface ProjectThumbnailProps {
  projectType?: "concept" | "internal" | "client-nda";
  projectName?: string;
  projectSlug?: string;
}

export default function ProjectThumbnail({ 
  projectType = "concept",
  projectName = "",
  projectSlug
}: ProjectThumbnailProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "50px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div 
      ref={ref}
      className="w-full mb-4 rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm"
      style={{ aspectRatio: "16/9" }}
    >
      {isVisible ? (
        <VisualPreview 
          projectType={projectType}
          projectName={projectName}
          projectSlug={projectSlug}
          variant="thumbnail"
        />
      ) : (
        <div className="w-full h-full bg-gray-50" aria-hidden="true" />
      )}
    </div>
  );
}

