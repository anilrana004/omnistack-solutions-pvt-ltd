import Link from "next/link";

import BlogCard from "@/components/BlogCard";
import { blogPosts } from "@/data/blogPosts";
import { sanityClient } from "@/src/lib/sanity.client";
import { allBlogsQuery } from "@/src/lib/sanity.queries";
import type { SanityBlogListItem } from "@/src/lib/sanity.types";

export const revalidate = 60;

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
          type: "Blog",
          excerpt: p.excerpt ?? "",
          publishedAt: p.publishedAt ?? new Date().toISOString(),
          imageUrl: p.coverImageUrl ?? null,
        }))
      : blogPosts;

  if (!posts.length) {
    return (
      <div className="pt-16">
        <section
          className={[
            "omni-bg-overlay py-20 text-white",
            "bg-[url('/images/backgrounds/blogs-news-bg.jpg.jpg')] bg-cover bg-center bg-no-repeat",
          ].join(" ")}
        >
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Blogs & News</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Updates, insights, and announcements from the OmniStack team.
            </p>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-olive-900">
                No posts yet
              </h2>
              <p className="mt-3 text-gray-600">
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
    <div className="pt-16">
      <section
        className={[
          "omni-bg-overlay py-20 text-white",
          "bg-[url('/images/backgrounds/blogs-news-bg.jpg.jpg')] bg-cover bg-center bg-no-repeat",
        ].join(" ")}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Blogs & News</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Updates, insights, and announcements from the OmniStack team.
          </p>
        </div>
      </section>

      <section
        className={[
          "omni-bg-overlay py-20",
          "bg-[url('/images/backgrounds/blogs-news-bg.jpg.jpg')] bg-cover bg-center bg-no-repeat",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => {
              return (
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

