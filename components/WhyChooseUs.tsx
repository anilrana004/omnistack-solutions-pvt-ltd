import React from "react";
import { CheckCircle2, Code2, Clock, Headphones } from "lucide-react";

const features = [
  {
    title: "End-to-End Ownership",
    description:
      "We handle everything from concept to deployment and long-term maintenance.",
    icon: CheckCircle2,
  },
  {
    title: "Clean, Maintainable Code",
    description:
      "Well-structured codebases designed for long-term growth and evolution.",
    icon: Code2,
  },
  {
    title: "Scalable Architecture",
    description:
      "Systems designed to grow with your business needs and scale responsibly.",
    icon: Clock,
  },
  {
    title: "Transparent Communication",
    description:
      "Clear, honest communication throughout the development process.",
    icon: Headphones,
  },
];

export default function WhyChooseUs() {
  return (
    <section
      className={[
        "omni-bg-overlay py-20 text-white",
        // Background image (file exists at /public/images/backgrounds/why-choose-us-bg.jpg.jpg)
        "bg-[url('/images/backgrounds/why-choose-us-bg.jpg.jpg')] bg-cover bg-no-repeat",
        // Mobile: bias slightly upward
        "bg-[position:center_top] md:bg-center",
      ].join(" ")}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Why Choose Us
        </h2>
        <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
          We build systems with long-term support and maintainability in mind.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="omni-glass-card p-6"
              >
                <Icon className="w-12 h-12 text-green-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-50 mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/85 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


