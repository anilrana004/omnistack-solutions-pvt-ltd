"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const WhatsAppButton = dynamic(() => import("@/components/WhatsAppButton"), {
  ssr: false,
  loading: () => null,
});

/**
 * Renders WhatsApp button after a short delay so it doesn't compete with LCP/critical path.
 * Improves initial load and TTI.
 */
export default function WhatsAppButtonDeferred() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 1800);
    return () => clearTimeout(id);
  }, []);

  return mounted ? <WhatsAppButton /> : null;
}
