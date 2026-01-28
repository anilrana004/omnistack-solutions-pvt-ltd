import React from "react";
import Link from "next/link";
import {
  Megaphone,
  Target,
  FileText,
  Share2,
  Newspaper,
  TrendingUp,
  Shield,
  CheckCircle2,
  ArrowRight, 
} from "lucide-react";

const prServices = [
  {
    title: "Personal Brand Strategy",
    description:
      "Define your brand identity, niche, storytelling, and digital authority.",
    icon: Target,
  },
  {
    title: "Content Strategy & Creation",
    description:
      "Weekly content ideas, captions, scripts, and visuals.",
    icon: FileText,
  },
  {
    title: "Social Media Management",
    description:
      "We fully manage your accounts: posting, engagement, analytics.",
    icon: Share2,
  },
  {
    title: "Public Relations (PR)",
    description:
      "Media reach-out, articles, digital publications, and authority building.",
    icon: Newspaper,
  },
  {
    title: "Growth & Performance Optimization",
    description:
      "Organic growth, algorithm optimization, hashtag research.",
    icon: TrendingUp,
  },
  {
    title: "Reputation Management",
    description:
      "Monitor online reputation, remove negative signals, strengthen brand trust.",
    icon: Shield,
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "₹4,999",
    period: "/mo",
    features: [
      "PR strategy",
      "8 posts/month",
      "Captions",
      "Basic analytics",
    ],
  },
  {
    name: "Growth",
    price: "₹9,999",
    period: "/mo",
    features: [
      "15 posts/month",
      "Story templates",
      "Hashtag research",
      "Full social media management",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "₹19,999",
    period: "/mo",
    features: [
      "20–25 posts/month",
      "Media outreach",
      "LinkedIn + Instagram optimization",
      "Monthly growth report",
      "One 1-on-1 consultation",
    ],
  },
];

export default function PRServicePage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-olive-900 to-olive-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-olive-500/20 rounded-full">
              <Megaphone className="w-12 h-12 text-olive-400" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Personal Branding & Social Media PR
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Build your influence, authority, and online presence with complete PR
            and branding management.
          </p>
          <Link
            href="/contact"
            className="inline-block btn-primary text-lg px-8 py-4"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-olive-900 mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive personal branding and PR services to elevate your
              digital presence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {prServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="card border border-gray-200 hover:border-olive-500 transition-all"
                >
                  <div className="mb-4">
                    <Icon className="w-12 h-12 text-olive-600 mb-4" />
                  </div>
                  <h3 className="text-xl font-bold text-olive-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-olive-900 mb-4">
              Pricing Plans
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your personal branding goals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`card border-2 ${
                  plan.popular
                    ? "border-olive-500 shadow-xl scale-105 relative"
                    : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-olive-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-olive-900 mb-4">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-olive-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start space-x-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-olive-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/contact?plan=${encodeURIComponent(plan.name)}`}
                  className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "btn-primary"
                      : "bg-olive-900 text-white hover:bg-olive-800"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-olive-600 via-olive-700 to-olive-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to build your personal brand?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Let's work together to establish your authority and grow your digital
            presence.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-olive-900 rounded-lg font-semibold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            <span>Contact Us</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
