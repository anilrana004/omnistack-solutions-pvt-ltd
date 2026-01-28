import Link from "next/link";

import BlogCard from "@/components/BlogCard";
import { blogPosts } from "@/data/blogPosts";
import { sanityClient } from "@/src/lib/sanity.client";
import { allBlogsQuery } from "@/src/lib/sanity.queries";
import type { SanityBlogListItem } from "@/src/lib/sanity.types";

async function getSanityBlogs(): Promise<SanityBlogListItem[]> {
  try {
    const res = await sanityClient.fetch<SanityBlogListItem[]>(allBlogsQuery);
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
}

export default async function BlogSection() {
  const sanityPosts = await getSanityBlogs();
  const posts =
    sanityPosts.length > 0
      ? sanityPosts.map((p) => ({
          _id: p._id,
          title: p.title,
          slug: p.slug,
          type: "Blog",
          excerpt: p.excerpt ?? "",
          publishedAt: p.publishedAt ?? new Date().toISOString(),
          imageUrl: p.coverImageUrl ?? null,
        }))
      : blogPosts;
  const featured = posts.slice(0, 3);
  return (
    <section
      className={[
        "omni-bg-overlay py-20",
        "bg-[url('/images/backgrounds/blogs-news-bg.jpg.jpg')] bg-cover bg-center bg-no-repeat",
      ].join(" ")}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-white">
          Blog & News
        </h2>
        <p className="text-center text-white/80 mb-12 max-w-2xl mx-auto">
          Insights on technology, development practices, and industry trends
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featured.map((post) => (
            <BlogCard
              key={post._id}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              publishedAt={post.publishedAt}
              type={post.type}
              imageUrl={post.imageUrl}
              variant="glass"
            />
          ))}
        </div>

        {/* Explore More Link */}
        <div className="text-center">
          <Link
            href="/blogs"
            className="inline-flex items-center text-sm font-medium text-white/85 hover:text-white transition-colors"
          >
            Explore More →
          </Link>
        </div>
      </div>
    </section>
  );
}

