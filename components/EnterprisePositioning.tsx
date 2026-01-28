import React from "react";
import { Shield, Layers, Cloud, Clock } from "lucide-react";

const points = [
  {
    icon: Layers,
    title: "Clean Architecture",
    description: "Well-structured, maintainable systems designed for long-term growth.",
  },
  {
    icon: Cloud,
    title: "Scalable Systems",
    description: "Cloud-native infrastructure that grows with your business needs.",
  },
  {
    icon: Shield,
    title: "Security-First",
    description: "Built with security best practices and compliance in mind from day one.",
  },
  {
    icon: Clock,
    title: "Long-Term Mindset",
    description: "Systems designed for maintainability and future evolution.",
  },
];

export default function EnterprisePositioning() {
  return (
    <section
      className={[
        "omni-bg-overlay py-24",
        // Background only (no overlay/effects)
        "bg-[url('/images/backgrounds/scale-security-bg.jpg.jpg')] bg-cover bg-center bg-no-repeat",
      ].join(" ")}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Glass container on top of background overlay */}
        <div className="omni-glass px-6 py-10 sm:px-10 sm:py-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-50 mb-6">
              Built for Scale, Security, and Long-Term Growth
            </h2>
            <p className="text-xl text-white/85 max-w-3xl mx-auto leading-relaxed">
              We prioritize transparency, long-term partnerships, and systems built to scale responsibly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {points.map((point, index) => {
              const Icon = point.icon;
              return (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-green-300" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-50 mb-2">
                      {point.title}
                    </h3>
                    <p className="text-white/85 leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

