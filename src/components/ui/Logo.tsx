"use client";

import { useState } from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: number;
  src?: string; // Allow custom logo source from CMS
  alt?: string; // Allow custom alt text from CMS
}

export default function Logo({ 
  className = "", 
  size = 120,
  src = "/logo/omnistack-logo.svg.png",
  alt = "OmniStack Solutions Logo"
}: LogoProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {!imageError ? (
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="object-contain"
          onError={() => setImageError(true)}
          priority={size > 50}
          loading={size > 50 ? "eager" : "lazy"}
        />
      ) : (
        // Fallback when image fails to load
        <div 
          className="flex items-center justify-center bg-olive-100 text-olive-600 rounded-lg text-xs font-bold"
          style={{ width: size, height: size }}
        >
          OS
        </div>
      )}
    </div>
  );
}