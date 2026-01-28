"use client";

import React, { useState, useEffect } from "react";
import { Star, Quote, X, MoreVertical, Pencil, Trash2 } from "lucide-react";

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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editRating, setEditRating] = useState<number>(0);
  const [editContent, setEditContent] = useState<string>("");
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
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

  // Close menus on outside click / escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenuId(null);
        setEditingTestimonial(null);
        setDeleteTarget(null);
      }
    };
    const onPointerDown = () => setOpenMenuId(null);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
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
          // Basic permission flag for now (replace with real auth later)
          isOwner: true,
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
          isOwner: true,
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

  const handleOpenEdit = (t: Testimonial) => {
    setOpenMenuId(null);
    setEditingTestimonial(t);
    setEditRating(t.rating);
    setEditContent(t.content);
  };

  const handleSaveEdit = () => {
    if (!editingTestimonial) return;
    const nextRating = Math.min(5, Math.max(1, editRating));
    const nextContent = editContent.trim();
    if (!nextContent) return;

    setTestimonials((prev) =>
      prev.map((t) =>
        t.id === editingTestimonial.id
          ? { ...t, rating: nextRating, content: nextContent }
          : t
      )
    );
    setEditingTestimonial(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    setTestimonials((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    setDeleteTarget(null);
    setOpenMenuId(null);
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

                {/* Owner actions */}
                {testimonial.isOwner ? (
                  <div
                    className="absolute top-4 right-4 z-10"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      aria-label="Open testimonial menu"
                      onClick={() =>
                        setOpenMenuId((prev) =>
                          prev === testimonial.id ? null : testimonial.id
                        )
                      }
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/15 backdrop-blur border border-white/25 transition-colors [@media(hover:hover)]:hover:bg-white/20"
                    >
                      <MoreVertical className="w-5 h-5 text-white/90" />
                    </button>

                    <div
                      className={[
                        // Open upward so it doesn't overlap feedback text
                        "absolute right-0 bottom-full mb-2 w-44",
                        "rounded-xl border border-white/20 bg-black/40 backdrop-blur shadow-lg overflow-hidden",
                        "transition-all duration-150 origin-bottom-right",
                        openMenuId === testimonial.id
                          ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 scale-95 -translate-y-1 pointer-events-none",
                      ].join(" ")}
                      role="menu"
                      aria-label="Testimonial actions"
                    >
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => handleOpenEdit(testimonial)}
                        className="w-full px-4 py-2.5 text-left text-sm text-white/90 transition-colors inline-flex items-center gap-2 [@media(hover:hover)]:hover:bg-white/10"
                      >
                        <Pencil className="w-4 h-4 text-green-300" />
                        Edit Feedback
                      </button>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setOpenMenuId(null);
                          setDeleteTarget(testimonial);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-red-200 transition-colors inline-flex items-center gap-2 [@media(hover:hover)]:hover:bg-white/10"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Feedback
                      </button>
                    </div>
                  </div>
                ) : null}

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

      {/* Edit Feedback Modal */}
      {editingTestimonial ? (
        <div
          className="fixed inset-0 z-[2100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
          onClick={() => setEditingTestimonial(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-medium text-olive-900">Edit Feedback</h3>
              <button
                type="button"
                onClick={() => setEditingTestimonial(null)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh] md:max-h-[65vh] pr-2">
              <div className="space-y-5">
                <div>
                  <p className="text-sm font-medium text-olive-900 mb-2">
                    Rating
                  </p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => {
                      const value = i + 1;
                      const filled = value <= editRating;
                      return (
                        <button
                          key={value}
                          type="button"
                          aria-label={`Set rating to ${value}`}
                          onClick={() => setEditRating(value)}
                          className="p-1"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              filled
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-transparent text-gray-200"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-olive-900 mb-2">
                    Feedback
                  </label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-olive-500 focus:border-olive-500 outline-none transition-all resize-none"
                  />
                  {!editContent.trim() ? (
                    <p className="mt-1 text-xs text-red-500">
                      Feedback text is required.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 z-10 bg-white/95 backdrop-blur p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setEditingTestimonial(null)}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={!editContent.trim() || editRating < 1}
                className="px-5 py-2.5 rounded-lg font-semibold text-white bg-gradient-to-r from-olive-600 via-olive-700 to-olive-800 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Delete confirmation */}
      {deleteTarget ? (
        <div
          className="fixed inset-0 z-[2200] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-olive-900">
                Delete Feedback
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Are you sure you want to delete this feedback?
              </p>
            </div>
            <div className="p-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}

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
