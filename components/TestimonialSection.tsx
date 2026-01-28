"use client";

import React, { useState, useEffect } from "react";
import { Star, Quote, X } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  isOwner?: boolean;
}

interface FeedbackFormData {
  name: string;
  role: string;
  company: string;
  rating: number;
  message: string;
}

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: "",
    role: "",
    company: "",
    rating: 0,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FeedbackFormData, string>>>({});
  const [thankYouMessage, setThankYouMessage] = useState(false);

  // Fetch testimonials
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/feedback");
      const data = await response.json();
      if (data.testimonials) {
        // Map API data to component format
        const mapped = data.testimonials.map((t: any) => ({
          id: t.id,
          name: t.name,
          role: t.role,
          company: t.company,
          content: t.message,
          rating: t.rating,
          // Read-only: no edit/delete functionality
          isOwner: false,
        }));
        setTestimonials(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
      // Fallback to empty array
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FeedbackFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FeedbackFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
    }
    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
    }
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "Please select a rating";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Feedback message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success && data.feedback) {
        // Immediately add the new testimonial to the top of the list
        const newTestimonial: Testimonial = {
          id: data.feedback.id,
          name: data.feedback.name,
          role: data.feedback.role,
          company: data.feedback.company,
          content: data.feedback.message,
          rating: data.feedback.rating,
          // Read-only: no edit/delete functionality
          isOwner: false,
        };

        // Prepend to testimonials list (appears at top)
        setTestimonials((prev) => {
          const updated = [newTestimonial, ...prev];
          // Keep only latest 6 testimonials
          return updated.slice(0, 6);
        });

        // Reset form
        setFormData({
          name: "",
          role: "",
          company: "",
          rating: 0,
          message: "",
        });

        // Show thank you message and close modal
        setSubmitSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitSuccess(false);
          // Show subtle thank you message below testimonials
          setThankYouMessage(true);
          setTimeout(() => {
            setThankYouMessage(false);
          }, 3000);
        }, 500);
      } else {
        setErrors({ message: data.error || "Failed to submit feedback" } as any);
      }
    } catch (error) {
      setErrors({ message: "Failed to submit feedback. Please try again." } as any);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
      setFormData({
        name: "",
        role: "",
        company: "",
        rating: 0,
        message: "",
      });
      setErrors({});
      setSubmitSuccess(false);
    }
  };


  // Show loading state
  if (loading) {
    return (
      <section
        className={[
          "omni-bg-overlay py-20",
          "bg-[url('/images/backgrounds/testimonials-bg.jpg')] bg-cover bg-center bg-no-repeat",
        ].join(" ")}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Trusted by businesses worldwide to deliver exceptional results
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-xl p-6 h-64 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        className={[
          "omni-bg-overlay py-20",
          "bg-[url('/images/backgrounds/testimonials-bg.jpg')] bg-cover bg-center bg-no-repeat",
        ].join(" ")}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Trusted by businesses worldwide to deliver exceptional results
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="group relative omni-glass-card p-6"
                style={{
                  animation: `fadeUp 0.6s ease-out ${index * 0.15}s both`,
                }}
              >
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="w-12 h-12 text-white" />
                </div>


                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => {
                    const filled = i < testimonial.rating;
                    return (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          filled
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-transparent text-gray-200"
                        }`}
                      />
                    );
                  })}
                </div>
                <p className="text-white/85 mb-6 leading-relaxed relative z-10">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-50">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-white/75">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Subtle feedback link */}
          <div className="text-center mt-12">
            {thankYouMessage ? (
              <p
                className="text-sm text-white/85"
                style={{
                  fontFamily: 'system-ui, -apple-system, "Inter", sans-serif',
                  fontWeight: 400,
                  letterSpacing: '0.01em',
                }}
              >
                Thank you for your feedback!
              </p>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-sm text-white/80 hover:text-white transition-colors inline-flex items-center gap-1"
                style={{
                  fontFamily: 'system-ui, -apple-system, "Inter", sans-serif',
                  fontWeight: 400,
                  letterSpacing: '0.01em',
                }}
              >
                Are you a client? Share your experience{" "}
                <span className="text-white/85">→</span>
              </button>
            )}
          </div>
        </div>
      </section>


      {/* Feedback Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3
                className="text-lg font-medium text-olive-900"
                style={{
                  fontFamily: 'system-ui, -apple-system, "Inter", sans-serif',
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                }}
              >
                Share Your Experience
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm text-gray-700 mb-1.5"
                  style={{
                    fontFamily: 'system-ui, -apple-system, "Inter", sans-serif',
                    fontWeight: 400,
                  }}
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                    errors.name
                      ? "border-red-300"
                      : "border-gray-200 focus:border-olive-500"
                  } focus:outline-none focus:ring-1 focus:ring-olive-500 transition-colors`}
                  style={{
                    fontFamily: 'system-ui, -apple-system, "Inter", sans-serif',
                    fontWeight: 400,
                  }}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Role & Company */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm text-gray-700 mb-1.5"
                    style={{
                      fontFamily: 'system-ui, -apple-system, "Inter", sans-serif',
                      fontWeight: 400,
                    }}
                  >
                    Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                      errors.role
                        ? "border-red-300"
                        : "border-gray-200 focus:border-olive-500"
                    } focus:outline-none focus:ring-1 focus:ring-olive-500 transition-colors`}
                    style={{
                      fontFamily: 'system-ui, -apple-system, "Inter", sans-serif',
                      fontWeight: 400,
                    }}
                    placeholder="Your role"
                  />
                  {errors.role && (
                    <p className="mt-1 text-xs text-red-500">{errors.role}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm text-gray-700 mb-1.5"
                    style={{
                      fontFamily: 'system-ui, -apple-system, "Inter", sans-serif',
                      fontWeight: 400,
                    }}
                  >
                    Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                      errors.company
                        ? "border-red-300"
                        : "border-gray-200 focus:border-olive-500"
                    } focus:outline-none focus:ring-1 focus:ring-olive-500 transition-colors`}
                    style={{
                      fontFamily: 'system-ui, -apple-system, "Inter", sans-serif',
                      fontWeight: 400,
                    }}
                    placeholder="Company name"
                  />
                  {errors.company && (
                    <p className="mt-1 text-xs text-red-500">{errors.company}</p>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label
                  htmlFor="rating"
                  className="block text-sm text-gray-700 mb-1.5"
                  style={{
                    fontFamily: 'system-ui, -apple-system, "Inter", sans-serif',
                    fontWeight: 400,
                  }}
                >
                  Rating <span className="text-red-500">*</span>
                </label>
                <select
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm ${
                    errors.rating
                      ? "border-red-300"
                      : "border-gray-200 focus:border-olive-500"
                  } focus:outline-none focus:ring-1 focus:ring-olive-500 transition-colors bg-white`}
                  style={{
                    fontFamily: 'system-ui, -apple-system, "Inter", sans-serif',
                    fontWeight: 400,
                  }}
                >
                  <option value="0">Select rating</option>
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
                {errors.rating && (
                  <p className="mt-1 text-xs text-red-500">{errors.rating}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm text-gray-700 mb-1.5"
                  style={{
                    fontFamily: 'system-ui, -apple-system, "Inter", sans-serif',
                    fontWeight: 400,
                  }}
                >
                  Feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-2.5 rounded-lg border text-sm resize-none ${
                    errors.message
                      ? "border-red-300"
                      : "border-gray-200 focus:border-olive-500"
                  } focus:outline-none focus:ring-1 focus:ring-olive-500 transition-colors`}
                  style={{
                    fontFamily: 'system-ui, -apple-system, "Inter", sans-serif',
                    fontWeight: 400,
                  }}
                  placeholder="Share your experience with us..."
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                )}
              </div>

              {/* Success Message */}
              {submitSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p
                    className="text-sm text-green-700"
                    style={{
                      fontFamily: 'system-ui, -apple-system, "Inter", sans-serif',
                      fontWeight: 400,
                    }}
                  >
                    Thank you for your feedback!
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-white bg-gradient-to-r from-olive-600 via-olive-700 to-olive-800 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: 'system-ui, -apple-system, "Inter", sans-serif',
                    fontWeight: 500,
                    letterSpacing: '0.01em',
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
