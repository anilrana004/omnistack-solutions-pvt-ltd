"use client";

import React, {useState} from "react";
import Image from "next/image";
import Link from "next/link";

const HERO_BG_SRC = "/hero/hero-illustration.png";
const HERO_BG_FALLBACK_SRC = "/assets/images/hero-general-tech.svg";

export default function Hero() {
  const [bgError, setBgError] = useState(false);
  const backgroundSrc = bgError ? HERO_BG_FALLBACK_SRC : HERO_BG_SRC;

  return (
    <section className="relative min-h-screen overflow-hidden bg-olive-950">
      {/* Background layer (swap this component later for 3D if needed) */}
      <div className="absolute inset-0">
        <Image
          src={backgroundSrc}
          alt="Hero background illustration"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          onError={() => setBgError(true)}
        />
        {/* Subtle overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-28 sm:py-32">
          <div className="max-w-2xl text-left">
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl"
              style={{textShadow: "0 4px 20px rgba(0,0,0,0.35)"}}
            >
              Building Everything.
              <br />
              <span className="inline-block bg-gradient-to-r from-olive-300 via-olive-400 to-olive-500 bg-clip-text text-transparent">
                Empowering Everyone.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-xl drop-shadow-lg">
              OmniStack Solutions designs and builds scalable websites, applications, AI
              systems, and cloud infrastructure for modern businesses.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-block px-8 py-4 bg-gradient-to-r from-olive-600 via-olive-700 to-olive-800 text-white font-semibold text-lg rounded-lg shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
              >
                Talk to Us
              </Link>
              <Link
                href="/services"
                className="inline-block px-8 py-4 bg-transparent border-2 border-white/40 text-white font-semibold text-lg rounded-lg hover:bg-white/10 hover:border-white/60 transition-all duration-300"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
