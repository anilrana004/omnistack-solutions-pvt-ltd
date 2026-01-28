import Link from "next/link";
import { BlogCard, Button, SectionContainer } from "@/src/components/ui";
import { BlogWrapper } from "@/src/components/fallbacks";
import type { SanityBlogListItem } from "@/src/lib/sanity.types";

interface BlogSectionProps {
  blogs: SanityBlogListItem[];
  loading?: boolean;
  error?: any;
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  maxPosts?: number;
  backgroundImage?: string;
  className?: string;
}

// Default content for fallback
const defaultContent = {
  title: "Latest Insights & News",
  subtitle: "Stay updated with the latest trends, tutorials, and insights from our team",
};

export default function BlogSection({ 
  blogs = [],
  loading = false,
  error = null,
  title = defaultContent.title,
  subtitle = defaultContent.subtitle,
  showViewAll = true,
  maxPosts = 3,
  backgroundImage = "/images/backgrounds/blogs-news-bg.jpg.jpg",
  className = "",
}: BlogSectionProps) {
  const sectionStyle = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  } : {};

  // Limit posts for homepage display
  const displayPosts = blogs.slice(0, maxPosts);
  const hasMorePosts = blogs.length > maxPosts;

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

        <BlogWrapper
          loading={loading}
          error={error}
          empty={!displayPosts.length}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {displayPosts.map((post) => (
              <BlogCard
                key={post._id}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt || ""}
                publishedAt={post.publishedAt || ""}
                imageUrl={post.coverImageUrl}
                variant="glass"
              />
            ))}
          </div>

          {/* View All Button */}
          {showViewAll && (hasMorePosts || displayPosts.length > 0) && (
            <div className="text-center">
              <Button
                href="/blogs"
                variant="outline"
                size="lg"
                className="border-white/50 hover:bg-white/10"
              >
                View All Posts
              </Button>
            </div>
          )}
        </BlogWrapper>

        {/* Call to Action for Content Contributors */}
        {!loading && !error && displayPosts.length === 0 && (
          <div className="text-center">
            <p className="text-white/70 mb-6">
              Are you a client? Share your experience →
            </p>
            <Button
              href="/contact"
              variant="outline"
              className="border-white/50 hover:bg-white/10"
            >
              Share Your Story
            </Button>
          </div>
        )}
      </SectionContainer>
    </section>
  );
}