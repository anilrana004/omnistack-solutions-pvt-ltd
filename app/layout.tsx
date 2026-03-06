import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { validateAndLog } from "@/src/lib/env-validation";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://omnistack.co.in";
const DEFAULT_DESCRIPTION =
  "OmniStack Solutions Pvt Ltd is a full stack development company offering custom software, web and mobile apps, AI solutions, and cloud services for businesses in India and globally.";

const DEFAULT_KEYWORDS = [
  "full stack development company India",
  "web development India",
  "AI automation",
  "mobile app development",
  "cloud services",
  "OmniStack Solutions",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "OmniStack Solutions | Full Stack Development Company India",
    template: "%s | OmniStack Solutions Pvt Ltd",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  manifest: "/site.webmanifest",
  alternates: { canonical: SITE_URL + "/" },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    url: SITE_URL + "/",
    title: "OmniStack Solutions | Full Stack Development Company India",
    description: DEFAULT_DESCRIPTION,
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "OmniStack Solutions Pvt Ltd" }],
    siteName: "OmniStack Solutions Pvt Ltd",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "OmniStack Solutions | Full Stack Development Company India",
    description: DEFAULT_DESCRIPTION,
    images: ["/logo.png"],
  },
};

/**
 * Root Layout Component
 * 
 * Validates environment variables on server startup.
 * Logs warnings for missing optional vars, but doesn't crash for them.
 * Only crashes if critical required vars are missing (handled at build time).
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Validate environment variables on server startup
  if (typeof window === "undefined") {
    try {
      validateAndLog();
    } catch {
      // Build-time validation will catch critical issues; no production console logs
    }
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "OmniStack Solutions Pvt Ltd",
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/logo.png`,
    description: DEFAULT_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dehradun",
      addressRegion: "Uttarakhand",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "admin@omnistack.co.in",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: "English",
    },
    sameAs: [
      "https://www.linkedin.com/company/omnistack-solutions",
      "https://twitter.com/omnistacksolutions",
      "https://www.facebook.com/omnistacksolutions",
      "https://www.instagram.com/omnistacksolutions",
    ],
    serviceArea: { "@type": "AdministrativeArea", name: "India" },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "OmniStack Solutions",
    url: `${SITE_URL}/`,
    description: DEFAULT_DESCRIPTION,
    publisher: { "@type": "Organization", name: "OmniStack Solutions Pvt Ltd", url: `${SITE_URL}/` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}


