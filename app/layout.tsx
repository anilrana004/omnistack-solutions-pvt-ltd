import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { validateAndLog } from "@/src/lib/env-validation";

export const metadata: Metadata = {
  title: "OmniStack Solutions - Building Everything. Empowering Everyone.",
  description: "OmniStack Solutions is a full-stack technology company delivering websites, apps, AI, cloud, and automation for modern businesses.",
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

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
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


