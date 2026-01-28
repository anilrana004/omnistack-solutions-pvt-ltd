"use client";

import React, {useMemo, useState} from "react";
import {Brain, Cloud, Code, Megaphone, Smartphone, TrendingUp, Wrench} from "lucide-react";

import ServiceDetailModal from "@/components/ServiceDetailModal";
import {services as serviceDetails} from "@/data/services";
import type {ServiceDetail} from "@/data/services";

const iconMap: Record<string, React.ComponentType<{className?: string}>> = {
  "Full-Stack Web Development": Code,
  "Mobile App Development": Smartphone,
  "AI & Automation": Brain,
  "Cloud & DevOps": Cloud,
  "SEO & Digital Growth": TrendingUp,
  "Maintenance & Support": Wrench,
  "Personal Branding & PR": Megaphone,
};

type Props = {
  className?: string;
};

export default function WhatWeBuild({className = ""}: Props) {
  const [active, setActive] = useState<ServiceDetail | null>(null);
  const open = !!active;

  const items = useMemo(() => serviceDetails, []);

  return (
    <section
      className={[
        "omni-bg-overlay py-20",
        "bg-[url('/images/backgrounds/what-we-build-bg.jpg')] bg-cover bg-center bg-no-repeat",
        className,
      ].join(" ")}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
          What We Build
        </h2>
        <p className="text-center text-white/85 mb-12 max-w-2xl mx-auto">
          End-to-end technology solutions focused on scalability and maintainability.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((service, index) => {
            const Icon = iconMap[service.title] ?? Code;
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => setActive(service)}
                className="text-left group omni-glass-card p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-olive-500 focus-visible:ring-offset-2"
                style={{
                  animation: `fadeUp 0.6s ease-out ${index * 0.1}s both`,
                }}
                aria-label={`Open details for ${service.title}`}
              >
                <div className="mb-4">
                  <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-white/10 border border-white/15 mb-4">
                    <Icon className="w-8 h-8 text-green-300" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-50 mb-3">
                  {service.title}
                </h3>
                <p className="text-white/85 leading-relaxed">
                  {service.shortDescription}
                </p>
                <div className="mt-5 text-sm font-medium text-white/90">
                  View details →
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <ServiceDetailModal
        open={open}
        service={active}
        onClose={() => setActive(null)}
      />
    </section>
  );
}

