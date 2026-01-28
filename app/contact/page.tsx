import ContactForm from "@/components/ContactForm";
import FAQSection from "@/components/FAQSection";
import { faqs } from "@/data/faqs";
import { Suspense } from "react";
import ContactFormWithPlan from "./ContactFormWithPlan";

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






