import Image from "next/image";
import { Button, Card, SectionContainer, Badge } from "@/src/components/ui";
import { ServiceWrapper } from "@/src/components/fallbacks";
import type { SanityService } from "@/src/lib/sanity.types";
import { urlForImage } from "@/src/lib/sanity.api";

interface ServicesSectionProps {
  services: SanityService[];
  loading?: boolean;
  error?: any;
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  className?: string;
  onServiceClick?: (service: SanityService) => void;
}

// Default content for fallback
const defaultContent = {
  title: "What We Build",
  subtitle: "Comprehensive solutions designed for scale, security, and long-term growth",
};

export default function ServicesSection({ 
  services = [],
  loading = false,
  error = null,
  title = defaultContent.title,
  subtitle = defaultContent.subtitle,
  backgroundImage = "/images/backgrounds/what-we-build-bg.jpg",
  className = "",
  onServiceClick,
}: ServicesSectionProps) {
  const sectionStyle = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  } : {};

  const handleServiceClick = (service: SanityService) => {
    if (onServiceClick) {
      onServiceClick(service);
    }
  };

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

        <ServiceWrapper
          loading={loading}
          error={error}
          empty={!services.length}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onClick={() => handleServiceClick(service)}
              />
            ))}
          </div>
        </ServiceWrapper>
      </SectionContainer>
    </section>
  );
}

// Service Card Sub-component
interface ServiceCardProps {
  service: SanityService;
  onClick: () => void;
}

function ServiceCard({ service, onClick }: ServiceCardProps) {
  const iconUrl = service.icon ? urlForImage(service.icon) : null;

  return (
    <Card
      variant="glass"
      clickable
      onClick={onClick}
      className="p-6 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-olive-500 focus-visible:ring-offset-2"
    >
      {/* Icon */}
      <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-white/10 border border-white/15 mb-4">
        {iconUrl ? (
          <Image
            src={iconUrl}
            alt={`${service.title} icon`}
            width={32}
            height={32}
            className="object-contain"
          />
        ) : (
          // Fallback icon
          <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        )}
      </div>

      {/* Content */}
      <div>
        <h3 className="text-xl font-bold text-gray-50 mb-3">
          {service.title}
        </h3>
        <p className="text-white/85 leading-relaxed mb-4">
          {service.shortDescription}
        </p>
        
        {/* Featured badge */}
        {service.featured && (
          <Badge variant="glass" className="mb-4">
            Featured
          </Badge>
        )}

        <div className="mt-5 text-sm font-medium text-white/90">
          {service.ctaText || 'View details'} →
        </div>
      </div>
    </Card>
  );
}