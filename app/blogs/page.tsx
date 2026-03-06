import type { Metadata } from "next";
import Link from "next/link";

import BlogCard from "@/components/BlogCard";
import { blogPosts } from "@/data/blogPosts";
import { sanityClient } from "@/src/lib/sanity.client";
import { allBlogsQuery } from "@/src/lib/sanity.queries";
import type { SanityBlogListItem } from "@/src/lib/sanity.types";

export const revalidate = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://omnistack.co.in";

export const metadata: Metadata = {
  title: "Blogs & News | OmniStack Solutions",
  description:
    "Updates, insights, and announcements from the OmniStack team. Tech, full stack development, AI, and industry trends.",
  alternates: { canonical: `${SITE_URL}/blogs` },
  openGraph: {
    url: `${SITE_URL}/blogs`,
    title: "Blogs & News | OmniStack Solutions",
    description:
      "Updates, insights, and announcements from the OmniStack team. Tech, full stack development, AI, and industry trends.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogs & News | OmniStack Solutions",
    description:
      "Updates, insights, and announcements from the OmniStack team. Tech, full stack development, AI, and industry trends.",
  },
};

async function getSanityBlogs(): Promise<SanityBlogListItem[]> {
  try {
    const res = await sanityClient.fetch<SanityBlogListItem[]>(allBlogsQuery);
    return Array.isArray(res) ? res : [];
  } catch {
    return [];
  }
}

async function BlogsPageView() {
  const sanityPosts = await getSanityBlogs();
  const posts =
    sanityPosts.length > 0
      ? sanityPosts.map((p) => ({
          _id: p._id,
          title: p.title,
          slug: p.slug,
          type: "Blog" as const,
          category: p.category,
          tags: p.tags ?? [],
          readingTime: p.readingTime,
          excerpt: p.excerpt ?? "",
          publishedAt: p.publishedAt ?? new Date().toISOString(),
          imageUrl: p.coverImageUrl ?? null,
        }))
      : blogPosts;

  if (!posts.length) {
    return (
      <div className="pt-14 sm:pt-16 min-w-0 overflow-x-hidden">
        <section
          className={[
            "omni-bg-overlay py-12 sm:py-16 md:py-20 text-white",
            "bg-[url('/images/backgrounds/blogs-news-bg.jpg.jpg')] bg-cover bg-center bg-no-repeat",
          ].join(" ")}
        >
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 break-words">
              Blogs & News
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-1">
              Updates, insights, and announcements from the OmniStack team.
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 md:p-10 text-center shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-olive-900">
                No posts yet
              </h2>
              <p className="mt-3 text-sm sm:text-base text-gray-600">
                We’re working on new articles and updates. Check back soon.
              </p>
              <div className="mt-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-olive-700 px-6 py-3 text-sm font-semibold text-white hover:bg-olive-800 transition-colors"
                >
                  Talk to Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-14 sm:pt-16 min-w-0 overflow-x-hidden">
      <section
        className={[
          "omni-bg-overlay py-12 sm:py-16 md:py-20 text-white",
          "bg-[url('/images/backgrounds/blogs-news-bg.jpg.jpg')] bg-cover bg-center bg-no-repeat",
        ].join(" ")}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 break-words">
            Blogs & News
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-1">
            Updates, insights, and announcements from the OmniStack team.
          </p>
        </div>
      </section>

      <section
        className={[
          "omni-bg-overlay py-10 sm:py-14 md:py-20",
          "bg-[url('/images/backgrounds/blogs-news-bg.jpg.jpg')] bg-cover bg-center bg-no-repeat",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {posts.map((post) => {
              return (
                <BlogCard
                  key={post._id}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  publishedAt={post.publishedAt}
                  category={post.category}
                  tags={post.tags}
                  readingTime={post.readingTime}
                  type={post.type}
                  imageUrl={post.imageUrl}
                  variant="glass"
                />
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default async function BlogsPage() {
  return <BlogsPageView />;
}

