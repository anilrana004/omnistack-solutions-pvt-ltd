"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { blogFallbackCover } from "@/data/imageAssets";

export default function LazyBlogImage() {
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
      className="w-full bg-gradient-to-br from-olive-50 to-gray-100 rounded-t-xl mb-4"
      style={{ aspectRatio: "16/9", minHeight: "192px" }}
      aria-hidden={!isVisible}
    >
      {isVisible ? (
        <div className="relative w-full h-full rounded-t-xl overflow-hidden">
          <Image
            src={blogFallbackCover.src}
            alt={blogFallbackCover.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
      ) : null}
    </div>
  );
}

