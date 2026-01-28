import Image from "next/image";
import { Quote, Star, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Card, SectionContainer, Badge, Button } from "@/src/components/ui";
import { TestimonialWrapper } from "@/src/components/fallbacks";
import type { SanityTestimonial } from "@/src/lib/sanity.types";
import { urlForImage } from "@/src/lib/sanity.api";

interface TestimonialSectionProps {
  testimonials: SanityTestimonial[];
  loading?: boolean;
  error?: any;
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  showMenu?: boolean;
  onEdit?: (testimonial: SanityTestimonial) => void;
  onDelete?: (testimonial: SanityTestimonial) => void;
  className?: string;
}

// Default content
const defaultContent = {
  title: "What Our Clients Say",
  subtitle: "Real feedback from businesses we've helped grow",
};

export default function TestimonialSection({ 
  testimonials = [],
  loading = false,
  error = null,
  title = defaultContent.title,
  subtitle = defaultContent.subtitle,
  backgroundImage = "/images/backgrounds/testimonials-bg.jpg",
  showMenu = false,
  onEdit,
  onDelete,
  className = "",
}: TestimonialSectionProps) {
  const sectionStyle = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  } : {};

  return (
    <section 
      className={`omni-bg-overlay ${className}`}
      style={sectionStyle}
    >
      <SectionContainer>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-50 mb-6">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-white/85 max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <TestimonialWrapper
          loading={loading}
          error={error}
          empty={!testimonials.length}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial._id}
                testimonial={testimonial}
                showMenu={showMenu}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12">
            <p className="text-white/85 mb-6">
              Are you a client? Share your experience →
            </p>
            <Button
              href="/contact"
              variant="outline"
              size="lg"
              className="border-white/50 hover:bg-white/10"
            >
              Share Your Feedback
            </Button>
          </div>
        </TestimonialWrapper>
      </SectionContainer>
    </section>
  );
}

// Testimonial Card Sub-component
interface TestimonialCardProps {
  testimonial: SanityTestimonial;
  showMenu?: boolean;
  onEdit?: (testimonial: SanityTestimonial) => void;
  onDelete?: (testimonial: SanityTestimonial) => void;
}

function TestimonialCard({ testimonial, showMenu = false, onEdit, onDelete }: TestimonialCardProps) {
  const avatarUrl = testimonial.avatar ? urlForImage(testimonial.avatar) : null;
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  return (
    <Card variant="glass" className="p-6 relative group">
      {/* Quote Icon */}
      <Quote className="w-12 h-12 text-white/20 mb-4" />

      {/* Three-dot menu */}
      {showMenu && (onEdit || onDelete) && (
        <div className="absolute top-4 right-4">
          <div className="relative">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4 text-white/70" />
            </button>
            
            {/* Dropdown menu (would need state management in real implementation) */}
            <div className="absolute right-0 top-full mt-1 w-40 bg-black/40 backdrop-blur rounded-lg border border-white/20 shadow-lg overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  onClick={() => onEdit(testimonial)}
                  className="w-full px-4 py-2 text-left text-sm text-white/85 hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <Edit className="w-3 h-3" />
                  Edit Feedback
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(testimonial)}
                  className="w-full px-4 py-2 text-left text-sm text-red-300 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Testimonial Content */}
      <p className="text-white/85 mb-6 leading-relaxed relative z-10">
        "{testimonial.testimonial}"
      </p>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {renderStars(testimonial.rating)}
      </div>

      {/* Client Info */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-white/15 border border-white/20 flex items-center justify-center overflow-hidden">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={`${testimonial.clientName} avatar`}
              width={48}
              height={48}
              className="object-cover"
            />
          ) : (
            <span className="text-white font-bold text-lg">
              {testimonial.clientName.charAt(0)}
            </span>
          )}
        </div>

        {/* Client Details */}
        <div>
          <p className="font-semibold text-gray-50 flex items-center gap-2">
            {testimonial.clientName}
            {testimonial.isVerified && (
              <Badge variant="success" size="sm">
                ✓ Verified
              </Badge>
            )}
          </p>
          <p className="text-sm text-white/75">
            {testimonial.clientTitle && testimonial.companyName
              ? `${testimonial.clientTitle}, ${testimonial.companyName}`
              : testimonial.clientTitle || testimonial.companyName || 'Client'
            }
          </p>
          {testimonial.projectType && (
            <p className="text-xs text-white/60 mt-1">
              {testimonial.projectType} Project
            </p>
          )}
          <p className="text-xs text-white/60">
            {formatDate(testimonial.receivedAt)}
          </p>
        </div>
      </div>
    </Card>
  );
}