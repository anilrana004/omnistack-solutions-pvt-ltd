"use client";

import {useEffect, useId, useMemo, useRef, useState} from "react";
import Link from "next/link";
import {X} from "lucide-react";

import type {ServiceDetail} from "@/data/services";

type Props = {
  open: boolean;
  service: ServiceDetail | null;
  onClose: () => void;
};

function getProjectParam(service: ServiceDetail | null) {
  if (!service) return "consultation";
  switch (service.id) {
    case "full-stack-web-development":
      return "full-stack-web";
    case "mobile-app-development":
      return "mobile-app";
    case "ai-and-automation":
      return "ai-automation";
    case "cloud-and-devops":
      return "cloud-devops";
    case "seo-and-digital-growth":
      return "seo-growth";
    case "maintenance-and-support":
      return "maintenance-support";
    case "personal-branding-and-pr":
      return "personal-branding-pr";
    default:
      return service.id;
  }
}

export default function ServiceDetailModal({open, service, onClose}: Props) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  const isShown = open && !!service;

  useEffect(() => {
    if (!isShown) return;
    setMounted(true);
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isShown, onClose]);

  // Allow a short exit animation before unmounting
  useEffect(() => {
    if (isShown) return;
    if (!mounted) return;
    const t = window.setTimeout(() => setMounted(false), 180);
    return () => window.clearTimeout(t);
  }, [isShown, mounted]);

  const tools = useMemo(() => service?.tools ?? [], [service]);
  const hasTools = tools.length > 0;

  if (!mounted && !isShown) return null;

  return (
    <div
      className={[
        "fixed inset-0 z-[60]",
        "flex items-center justify-center",
        "p-4 sm:p-6",
      ].join(" ")}
      aria-hidden={!isShown}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal"
        className={[
          "absolute inset-0 cursor-default",
          "bg-black/60",
          "transition-opacity duration-200",
          isShown ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={[
          "relative w-full sm:max-w-3xl",
          "omni-glass text-gray-50",
          "max-h-[85vh] overflow-hidden",
          "transition-all duration-200",
          isShown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3",
        ].join(" ")}
      >
        {/* Header (sticky, non-scroll) */}
        <div className="sticky top-0 z-10 bg-white/10 backdrop-blur flex items-start justify-between gap-4 px-6 py-5 border-b border-white/15">
          <div>
            <h2 id={titleId} className="text-2xl font-bold text-gray-50">
              {service?.title}
            </h2>
            <p className="mt-2 text-white/85 leading-relaxed">
              {service?.fullDescription}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/20 bg-white/10 transition-colors [@media(hover:hover)]:hover:bg-white/15"
          >
            <X className="w-5 h-5 text-white/90" />
          </button>
        </div>

        {/* Scrollable content (only this area scrolls)
            Add bottom padding so sticky footer never overlaps the last items. */}
        <div className="px-6 py-6 pb-28 sm:pb-24 overflow-y-auto scroll-smooth pr-2 max-h-[60vh] md:max-h-[65vh] [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.25)_transparent]">
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-semibold text-gray-50 mb-3">
                How we work
              </h3>
              <ol className="space-y-2 list-decimal pl-5 text-white/85">
                {service?.processSteps.map((step) => (
                  <li key={step} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </section>

            {hasTools ? (
              <section>
                <h3 className="text-lg font-semibold text-gray-50 mb-3">
                  Tools & technologies
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {tools.map((tool) => (
                    <li
                      key={tool}
                      className="px-3 py-1.5 text-sm rounded-lg bg-white/10 border border-white/15 text-white/85 font-medium"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section>
              <h3 className="text-lg font-semibold text-gray-50 mb-3">
                What you get
              </h3>
              <ul className="space-y-2 list-disc pl-5 text-white/85">
                {service?.deliverables.map((item) => (
                  <li key={item} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* Footer / CTA (sticky, non-scroll) */}
        <div className="sticky bottom-0 z-10 px-6 py-5 border-t border-white/15 bg-white/10 backdrop-blur">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <p className="text-sm text-white/75">
              Share your goals — we’ll propose a clear plan, timeline, and next steps.
            </p>
            <div className="flex gap-3">
              <Link
                href={`/contact?project=${encodeURIComponent(getProjectParam(service))}`}
                className="btn-primary"
              >
                {service?.ctaText || "Start Project"}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white/90 bg-white/10 border border-white/25 transition-colors [@media(hover:hover)]:hover:bg-white/15"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

