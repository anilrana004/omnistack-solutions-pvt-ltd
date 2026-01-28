"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { getProjectImageAsset } from "@/data/imageAssets";

interface VisualPreviewProps {
  projectType?: "concept" | "internal" | "client-nda";
  label?: string;
  projectName?: string;
  projectSlug?: string;
  variant?: "full" | "thumbnail";
}

export default function VisualPreview({ 
  projectType = "concept",
  label,
  projectName = "",
  projectSlug,
  variant = "full"
}: VisualPreviewProps) {
  const [isVisible, setIsVisible] = useState(variant === "full" ? false : true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only lazy load full variant (case study pages)
    if (variant === "full") {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { rootMargin: "100px" }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }
  }, [variant]);

  const getLabel = () => {
    if (label) return label;
    if (projectType === "concept") return "Concept UI Preview";
    if (projectType === "internal") return "Internal Build Preview";
    if (projectType === "client-nda") return "Product Screenshot";
    return "Preview";
  };

  const getAltText = () => {
    const typeLabel = getLabel().toLowerCase();
    return `${typeLabel}${projectName ? ` of ${projectName}` : ""}`;
  };

  const isThumbnail = variant === "thumbnail";
  const containerClasses = isThumbnail ? "w-full h-full" : "w-full";
  
  const previewHeight = isThumbnail ? "min-h-[200px]" : "min-h-[400px]";
  const padding = isThumbnail ? "p-4" : "p-8";
  const imageAsset = useMemo(
    () => (projectSlug ? getProjectImageAsset(projectSlug, projectType) : null),
    [projectSlug, projectType]
  );
  const isDashboardAsset = !!imageAsset?.src?.startsWith("/dashboard/");

  return (
    <div ref={ref} className={containerClasses}>
      {!isVisible && variant === "full" ? (
        <div className="w-full bg-gray-50 rounded-lg" style={{ minHeight: previewHeight }} aria-hidden="true" />
      ) : (
        isThumbnail && imageAsset && isDashboardAsset ? (
          // Dashboard thumbnails: show the screenshot cleanly, full-bleed (no browser frame/padding)
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={imageAsset.src}
              alt={imageAsset.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover object-center"
            />
          </div>
        ) : (
          <>
          {/* Browser Frame */}
          <div className="bg-gray-100 rounded-t-lg border border-gray-200 p-2.5">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
              </div>
              {!isThumbnail && (
                <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-500 text-center max-w-md mx-auto">
                  app.example.com
                </div>
              )}
            </div>
          </div>
          
          {/* Content Preview */}
          <div className={`bg-white border-x border-b border-gray-200 rounded-b-lg ${padding} ${previewHeight}`}>
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-olive-50 to-gray-100">
              {imageAsset ? (
                (() => {
                  const isDashboardAsset = imageAsset.src.startsWith("/dashboard/");
                  return (
                <Image
                  src={imageAsset.src}
                  alt={imageAsset.alt}
                  fill
                  sizes={
                    isThumbnail
                      ? "(max-width: 1024px) 100vw, 33vw"
                      : "(max-width: 1024px) 100vw, 900px"
                  }
                  // Thumbnails are 16:9; export dashboard images in 16:9 for a perfect fit.
                  className={isDashboardAsset ? "object-cover object-center" : "object-cover"}
                  priority={!isThumbnail}
                />
                  );
                })()
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10" />
            </div>
          </div>
          
          {/* Label */}
          {!isThumbnail && (
            <p className="text-xs text-gray-500 text-center mt-3" role="text">
              {getLabel()}
            </p>
          )}
          
          {/* Hidden alt text for accessibility (fallback if image isn't available) */}
          {!imageAsset ? <span className="sr-only">{getAltText()}</span> : null}
          </>
        )
      )}
    </div>
  );
}
