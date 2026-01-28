"use client";

import { useState } from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "", size = 120 }: LogoProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {!imageError ? (
        <Image
          src="/logo/omnistack-logo.svg.png"
          alt="OmniStack Solutions Logo"
          width={size}
          height={size}
          className="object-contain"
          onError={() => setImageError(true)}
          priority={size > 50}
          loading={size > 50 ? "eager" : "lazy"}
        />
      ) : null}
    </div>
  );
}





