import React from "react";
import WhatWeBuild from "@/components/WhatWeBuild";
import { services as serviceDetails } from "@/data/services";

interface ServicesSectionProps {
  showAll?: boolean;
}

export default function ServicesSection({ showAll = false }: ServicesSectionProps) {
  return <WhatWeBuild />;
}

// Backwards-compatible export used by the services page.
export const services = serviceDetails.map((s, idx) => ({
  id: String(idx + 1),
  title: s.title,
  description: s.shortDescription,
  icon: "Code",
}));


