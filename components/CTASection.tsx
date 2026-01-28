import React from "react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section
      className={[
        "omni-bg-overlay py-20",
        // Min heights (mobile / desktop)
        "min-h-[40vh] md:min-h-[60vh]",
        // Background image (file exists at /public/images/backgrounds/have-an-idea-bg.jpg.jpg)
        "bg-[url('/images/backgrounds/have-an-idea-bg.jpg.jpg')] bg-cover bg-center bg-no-repeat",
      ].join(" ")}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="omni-glass p-8 md:p-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Have an idea? Let's build it with OmniStack.
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Ready to turn your vision into reality? Get in touch with our team
            today.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-5 bg-white text-olive-900 rounded-lg font-semibold text-lg shadow-2xl md:hover:scale-105 md:hover:shadow-3xl transition-all duration-300 transform"
          >
            Schedule a Call
          </Link>
        </div>
      </div>
    </section>
  );
}


