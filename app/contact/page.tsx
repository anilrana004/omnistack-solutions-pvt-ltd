import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import FAQSection from "@/components/FAQSection";
import { faqs } from "@/data/faqs";
import { Suspense } from "react";
import ContactFormWithPlan from "./ContactFormWithPlan";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://omnistack.co.in";

export const metadata: Metadata = {
  title: "Contact Us | Get a Free Strategy Call",
  description:
    "Discuss your project with OmniStack Solutions. Full stack development, AI automation, mobile apps, and cloud services. Free consultation for businesses in India and globally.",
  keywords: ["contact OmniStack", "hire developers India", "free consultation", "web development quote"],
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    url: `${SITE_URL}/contact`,
    title: "Contact Us | OmniStack Solutions",
    description: "Get a free strategy call. Discuss your project with our full stack development team.",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Contact Us | OmniStack Solutions" },
};

export default function ContactPage() {
  // FAQPage JSON-LD Structured Data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="pt-16">
      <section className="py-20 bg-gradient-to-br from-olive-900 to-olive-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Let's discuss how we can help bring your project to life
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={<ContactForm />}>
            <ContactFormWithPlan />
          </Suspense>
        </div>
      </section>

      <FAQSection />
      </div>
    </>
  );
}






