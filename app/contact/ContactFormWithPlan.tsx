"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import ContactForm from "@/components/ContactForm";

export default function ContactFormWithPlan() {
  const searchParams = useSearchParams();

  const selectedPlan = useMemo(() => {
    const plan = searchParams?.get("plan");
    if (!plan) return undefined;
    if (plan === "Starter" || plan === "Growth" || plan === "Premium") return plan;
    return undefined;
  }, [searchParams]);

  const selectedProjectType = useMemo(() => {
    const raw = searchParams?.get("project") || searchParams?.get("service");
    if (!raw) return undefined;

    const value = String(raw).trim();

    // Support both slug-style and title-style
    const slugMap: Record<string, string> = {
      "full-stack-web": "Full-Stack Web Development",
      "full-stack-web-development": "Full-Stack Web Development",
      "mobile-app": "Mobile App Development",
      "mobile-app-development": "Mobile App Development",
      "ai-automation": "AI & Automation",
      "ai-and-automation": "AI & Automation",
      "cloud-devops": "Cloud & DevOps",
      "cloud-and-devops": "Cloud & DevOps",
      "seo-growth": "SEO & Digital Growth",
      "seo-and-digital-growth": "SEO & Digital Growth",
      "maintenance-support": "Maintenance & Support",
      "maintenance-and-support": "Maintenance & Support",
      "personal-branding-pr": "Personal Branding & PR",
      "personal-branding-and-pr": "Personal Branding & PR",
      consultation: "Not Sure / Consultation",
      "not-sure": "Not Sure / Consultation",
    };

    if (slugMap[value]) return slugMap[value];

    const allowedTitles = new Set([
      "Full-Stack Web Development",
      "Mobile App Development",
      "AI & Automation",
      "Cloud & DevOps",
      "SEO & Digital Growth",
      "Maintenance & Support",
      "Not Sure / Consultation",
    ]);
    if (allowedTitles.has(value)) return value;

    return undefined;
  }, [searchParams]);

  return <ContactForm selectedPlan={selectedPlan} selectedProjectType={selectedProjectType} />;
}

