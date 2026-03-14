import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://omnistack.co.in";

function BreadcrumbSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${SITE_URL}/projects` },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}

export const metadata: Metadata = {
  title: "Projects & Portfolio | Web, Mobile & AI Solutions",
  description:
    "Explore OmniStack Solutions' portfolio: full stack web apps, mobile applications, AI chatbots, e-commerce, and cloud solutions. Case studies and project highlights.",
  keywords: ["portfolio", "case studies", "web development projects", "mobile app projects", "AI solutions India"],
  alternates: { canonical: `${SITE_URL}/projects` },
  openGraph: {
    url: `${SITE_URL}/projects`,
    title: "Projects | OmniStack Solutions",
    description: "Portfolio of full stack, mobile, and AI projects. Case studies and solutions we've built.",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Projects | OmniStack Solutions" },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbSchema />
      {children}
    </>
  );
}
