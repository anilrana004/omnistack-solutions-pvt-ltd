"use client";

import React, {
  Suspense,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import dynamic from "next/dynamic";

// Types for Three.js components
interface ThreeSceneProps {
  modelPath?: string;
  fallbackImage?: string;
  className?: string;
  title?: string;
  subtitle?: string;
}

// Lazy load the actual 3D canvas to prevent SSR issues
const ThreeCanvas = dynamic(
  () => import("./ThreeCanvas").catch(() => {
    // Fallback component if Three.js fails to load
    return {
      default: () => (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-olive-900 to-olive-950 rounded-2xl">
          <div className="text-center p-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-olive-600/30 to-olive-700/30 flex items-center justify-center">
              <svg className="w-12 h-12 text-olive-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
            </div>
            <p className="text-olive-300/60 text-sm">3D Experience</p>
          </div>
        </div>
      ),
    };
  }),
  {
    ssr: false,
    loading: () => <ThreeSceneLoader />,
  }
);

// Loading placeholder
function ThreeSceneLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-olive-900/50 to-olive-950/50 rounded-2xl">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-olive-400/30 border-t-olive-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-olive-300/60 text-sm">Loading 3D experience...</p>
      </div>
    </div>
  );
}

// Static fallback for mobile/low-end devices
function StaticFallback({
  fallbackImage,
  title,
}: {
  fallbackImage?: string;
  title?: string;
}) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-olive-900 to-olive-950 rounded-2xl overflow-hidden">
      {fallbackImage ? (
        <img
          src={fallbackImage}
          alt={title || "3D visualization"}
          className="w-full h-full object-cover opacity-80"
        />
      ) : (
        <div className="text-center p-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-olive-600/30 to-olive-700/30 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-olive-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
              />
            </svg>
          </div>
          <p className="text-olive-300/60 text-sm">
            Interactive 3D on desktop
          </p>
        </div>
      )}
    </div>
  );
}

export default function ThreeScene({
  modelPath = "/models/abstract-shape.glb",
  fallbackImage,
  className = "",
  title,
  subtitle,
}: ThreeSceneProps) {
  const [shouldRender3D, setShouldRender3D] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect if device can handle 3D
  useEffect(() => {
    const checkDevice = () => {
      // Check if mobile
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Check for WebGL support
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      const hasWebGL = !!gl;

      // Check device memory (if available)
      const deviceMemory = (navigator as any).deviceMemory;
      const hasLowMemory = deviceMemory && deviceMemory < 4;

      // Only render 3D on capable desktop devices
      const canRender3D =
        hasWebGL && !isMobile && !prefersReducedMotion && !hasLowMemory;

      setShouldRender3D(canRender3D);
    };

    checkDevice();
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`relative overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            {title && (
              <h2 className="text-4xl md:text-5xl font-bold text-olive-900 mb-6">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-gray-600 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* 3D Container */}
          <div
            ref={containerRef}
            className="order-1 lg:order-2 aspect-square max-w-lg mx-auto w-full"
          >
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-olive-200/20">
              {isVisible ? (
                shouldRender3D ? (
                  <Suspense fallback={<ThreeSceneLoader />}>
                    <ThreeCanvas modelPath={modelPath} />
                  </Suspense>
                ) : (
                  <StaticFallback fallbackImage={fallbackImage} title={title} />
                )
              ) : (
                <ThreeSceneLoader />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
