import Image from "next/image";
import { Button, SectionContainer } from "@/src/components/ui";
import { ContentWrapper } from "@/src/components/fallbacks";
import type { SanityPage } from "@/src/lib/sanity.types";
import { urlForImage } from "@/src/lib/sanity.api";

interface HeroSectionProps {
  hero?: SanityPage['hero'];
  loading?: boolean;
  error?: any;
  className?: string;
}

// Default hero content for fallback
const defaultHero = {
  heading: "Building Everything. Empowering Everyone.",
  subheading: "OmniStack Solutions designs and builds scalable websites, applications, AI systems, and cloud infrastructure for modern businesses.",
  backgroundImage: "/hero/hero-illustration.png",
  ctaButtons: [
    { text: "Get Started", link: "/contact", style: "primary" as const },
    { text: "View Our Work", link: "/projects", style: "secondary" as const },
  ],
};

export default function HeroSection({ 
  hero, 
  loading = false,
  error = null,
  className = ""
}: HeroSectionProps) {
  // Use CMS data or fallback
  const heroData = hero || defaultHero;
  const backgroundImageUrl = hero?.backgroundImage 
    ? urlForImage(hero.backgroundImage) 
    : defaultHero.backgroundImage;

  // Convert heading blocks to string (simplified for now)
  const headingText = hero?.heading 
    ? hero.heading.map(block => 
        block.children?.map(child => child.text).join('') || ''
      ).join('\n')
    : defaultHero.heading;

  return (
    <ContentWrapper
      loading={loading}
      error={error}
      loadingSkeleton="hero"
      className={className}
      minHeight="min-h-screen"
    >
      <section className="relative min-h-screen overflow-hidden bg-olive-950">
        {/* Background layer */}
        <div className="absolute inset-0">
          {backgroundImageUrl && (
            <Image
              src={backgroundImageUrl}
              alt="Hero background illustration"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          )}
          {/* Gradient overlays for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative min-h-screen flex items-center">
          <SectionContainer>
            <div className="max-w-2xl text-left">
              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl"
                style={{textShadow: "0 4px 20px rgba(0,0,0,0.35)"}}
              >
                {/* Split heading for gradient effect */}
                {headingText.includes('.') ? (
                  <>
                    {headingText.split('.')[0]}.
                    <br />
                    <span className="inline-block bg-gradient-to-r from-olive-300 via-olive-400 to-olive-500 bg-clip-text text-transparent">
                      {headingText.split('.')[1]}
                    </span>
                  </>
                ) : (
                  <span className="inline-block bg-gradient-to-r from-olive-300 via-olive-400 to-olive-500 bg-clip-text text-transparent">
                    {headingText}
                  </span>
                )}
              </h1>

              <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-xl drop-shadow-lg">
                {heroData.subheading}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                {heroData.ctaButtons?.map((button, index) => (
                  <Button
                    key={index}
                    href={button.link}
                    variant={button.style === 'primary' ? 'primary' : 'outline'}
                    size="lg"
                    className={button.style === 'primary' ? '' : 'border-white/50 hover:bg-white/10'}
                  >
                    {button.text}
                  </Button>
                ))}
              </div>
            </div>
          </SectionContainer>
        </div>
      </section>
    </ContentWrapper>
  );
}