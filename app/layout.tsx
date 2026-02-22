import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { validateAndLog } from "@/src/lib/env-validation";

export const metadata: Metadata = {
  title: "AI & Software Development Company in India | Omnistack Solutions",
  description: "Omnistack Solutions provides AI automation, custom software, SaaS platforms, web and mobile app development services for scalable digital growth.",
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
  // This runs on every server render, but validation is fast
  if (typeof window === 'undefined') {
    // Only run on server
    try {
      validateAndLog();
    } catch (error) {
      // Log but don't crash - build-time validation will catch critical issues
      console.error('Environment validation error:', error);
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://omnistack.co.in";
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Omnistack Solutions",
    url: siteUrl,
    logo: `${siteUrl}/favicon.ico`,
    description: "Omnistack Solutions provides AI automation, custom software, SaaS platforms, web and mobile app development services for scalable digital growth.",
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
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
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


