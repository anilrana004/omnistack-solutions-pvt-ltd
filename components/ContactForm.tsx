"use client";

import { useEffect, useMemo, useRef, useState, FormEvent } from "react";
import type { ContactFormData } from "@/types";

type ContactFormProps = {
  selectedPlan?: string;
  selectedProjectType?: string;
};

const PROJECT_OPTIONS = [
  "Full-Stack Web Development",
  "Mobile App Development",
  "AI & Automation",
  "Cloud & DevOps",
  "SEO & Digital Growth",
  "Maintenance & Support",
  "Not Sure / Consultation",
] as const;

export default function ContactForm({ selectedPlan, selectedProjectType }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: selectedProjectType || "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPrefillHint, setShowPrefillHint] = useState(false);
  const projectRef = useRef<HTMLSelectElement>(null);

  const isProjectPrefilled = useMemo(
    () => Boolean(selectedProjectType && selectedProjectType.trim().length > 0),
    [selectedProjectType]
  );

  useEffect(() => {
    if (!selectedProjectType) return;
    setFormData((prev) => {
      // Only auto-set if user hasn't picked something yet
      if (prev.projectType) return prev;
      return { ...prev, projectType: selectedProjectType };
    });

    setShowPrefillHint(true);
    const el = projectRef.current;
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
    el?.focus();

    const t1 = window.setTimeout(() => setShowPrefillHint(false), 3500);
    return () => window.clearTimeout(t1);
  }, [selectedProjectType]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  const validatePhone = (phone: string) => {
    const re = /^[\d+\s-]+$/;
    return re.test(phone);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(false);

    // Validation
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.projectType.trim()) {
      newErrors.projectType = "Please select a project type";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    // Submit form to API
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: selectedPlan,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          projectType: formData.projectType,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Show success message
        setSubmitSuccess(true);
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          projectType: selectedProjectType || "",
          message: "",
        });

        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        setSubmitError(data.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitError("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {selectedPlan ? (
        <div className="mb-6 rounded-xl border border-olive-200 bg-olive-50 px-4 py-3 text-olive-900">
          <p className="text-sm">
            Selected plan: <span className="font-semibold">{selectedPlan}</span>
          </p>
        </div>
      ) : null}
      <form onSubmit={handleSubmit} className="space-y-6">
        <input type="hidden" name="plan" value={selectedPlan || ""} />
        <input type="hidden" name="projectType" value={formData.projectType || ""} />

        {/* Project Type */}
        <div>
          <label
            htmlFor="projectType"
            className="block text-sm font-medium text-olive-900 mb-2"
          >
            Project Type <span className="text-red-500">*</span>
          </label>
          {isProjectPrefilled && showPrefillHint ? (
            <p className="text-xs text-olive-700 mb-2">
              We’ve pre-selected this based on your interest.
            </p>
          ) : null}
          <select
            ref={projectRef}
            id="projectType"
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.projectType ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-olive-500 focus:border-olive-500 outline-none transition-all ${
              isProjectPrefilled && showPrefillHint ? "ring-2 ring-olive-400" : ""
            }`}
          >
            <option value="" disabled>
              Select a project type
            </option>
            {PROJECT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.projectType && (
            <p className="mt-1 text-sm text-red-500">{errors.projectType}</p>
          )}
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-olive-900 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-olive-500 focus:border-olive-500 outline-none transition-all`}
            placeholder="Sarah Johnson"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-olive-900 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-olive-500 focus:border-olive-500 outline-none transition-all`}
            placeholder="sarah.johnson@company.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-olive-900 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-olive-500 focus:border-olive-500 outline-none transition-all`}
            placeholder="+91 98765 43210"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* Company */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-olive-900 mb-2">
            Company / Project Name <span className="text-gray-500">(Optional)</span>
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-olive-500 focus:border-olive-500 outline-none transition-all"
            placeholder="Tech Solutions Inc."
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-olive-900 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.message ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-olive-500 focus:border-olive-500 outline-none transition-all resize-none`}
            placeholder="Tell us about your project..."
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-500">{errors.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Send Message"}
        </button>

        {/* Success Message */}
        {submitSuccess && (
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <p className="font-semibold">Thanks! We'll get back to you soon.</p>
          </div>
        )}
        {submitError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <p className="font-semibold">{submitError}</p>
          </div>
        )}
      </form>

      {/* Contact Info */}
      <div className="mt-12 p-6 bg-olive-50 rounded-lg border border-transparent hover:shadow-xl hover:-translate-y-1 hover:ring-1 hover:ring-olive-500 transition-all duration-300">
        <h3 className="text-lg font-semibold text-olive-900 mb-4">Get in Touch</h3>
        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-medium">Business Email:</span>{" "}
            <a
              href="mailto:admin@omnistack.co.in"
              className="text-olive-600 hover:text-olive-700"
            >
              admin@omnistack.co.in
            </a>
          </p>
          <p>
            <span className="font-medium">Phone:</span>{" "}
            <a
              href="tel:+916396309659"
              className="text-olive-600 hover:text-olive-700"
            >
              +91 6396309659
            </a>
          </p>
          <p>
            <span className="font-medium">Location:</span> 11-174 near fountain chowk, Rajeev Nagar, Nehru Colony, Dharampur, Dehradun, Uttarakhand 248001, India
          </p>
        </div>
      </div>
    </div>
  );
}


