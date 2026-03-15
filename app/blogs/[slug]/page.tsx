import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";

import { blogFallbackCover } from "@/data/imageAssets";
import { getBlogBySlug, getRelatedBlogs } from "@/src/lib/sanity.api";
import { createSEOManager } from "@/src/lib/seo";
import { getSiteSettings } from "@/src/lib/sanity.api";
import { isPreviewMode } from "@/src/lib/preview-utils";
import PreviewBanner from "@/src/components/PreviewBanner";
import { extractHeadings, slugify } from "@/src/lib/blog-seo";

export const revalidate = 60;

async function getPost(slug: string, preview = false) {
  const result = await getBlogBySlug(slug, preview);
  return result.success ? result.data : null;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const preview = isPreviewMode();
  const post = await getPost(params.slug, preview);
  
  if (!post) return {};

  // Get site settings for SEO defaults
  const settingsResult = await getSiteSettings();
  const settings = settingsResult.data || undefined;

  // Use SEO manager for consistent metadata generation
  const seoManager = createSEOManager(settings);
  return seoManager.generateBlogMetadata(post, `/blogs/${params.slug}`);
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://omnistack.co.in";

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const preview = isPreviewMode();
  const post = await getPost(params.slug, preview);
  
  if (!post) return notFound();

  const postUrl = `${SITE_URL}/blogs/${params.slug}`;
  const settingsResult = await getSiteSettings();
  const seoManager = createSEOManager(settingsResult.data || undefined);
  const articleSchema = seoManager.generateArticleSchema(
    {
      title: post.title,
      summary: post.metaDescription || post.excerpt || post.title,
      publishedAt: post.publishedAt,
      category: post.category,
    },
    postUrl
  );

  const relatedPosts = await getRelatedBlogs(params.slug, preview);
  const tocEntries = extractHeadings(post.content);

  const portableTextComponents: Record<string, unknown> = {
    block: {
      h2: ({ children, value }: { children?: React.ReactNode; value?: { children?: Array<{ text?: string }> } }) => {
        const text = value?.children?.[0]?.text;
        const id = text ? slugify(text) : undefined;
        return <h2 id={id}>{children}</h2>;
      },
      h3: ({ children, value }: { children?: React.ReactNode; value?: { children?: Array<{ text?: string }> } }) => {
        const text = value?.children?.[0]?.text;
        const id = text ? slugify(text) : undefined;
        return <h3 id={id}>{children}</h3>;
      },
    },
  };

  const dateLabel =
    post.publishedAt && !Number.isNaN(new Date(post.publishedAt).getTime())
      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";
  const readingTimeLabel =
    typeof post.readingTime === "number" && Number.isFinite(post.readingTime) && post.readingTime > 0
      ? `${Math.round(post.readingTime)} min read`
      : "";
  const tags = Array.isArray(post.tags) ? post.tags.filter(Boolean) : [];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blogs` },
      { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
    ],
  };

  return (
    <div className={`min-w-0 w-full overflow-x-hidden max-w-[100vw] ${preview ? "pt-36" : "pt-14 sm:pt-16"}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Preview Banner */}
      {preview && (
        <PreviewBanner
          isPreview={preview}
          documentType="post"
          documentId={post._id}
        />
      )}

      {/* Full-screen layout: white background, centered content */}
      <section className="min-h-screen w-full bg-white py-8 sm:py-10 md:py-14">
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="w-full max-w-4xl">
            {/* Meta row: published date (content freshness), reading time, author, category */}
            <div className="mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 flex-wrap gap-y-1">
              {dateLabel ? (
                <span className="text-xs text-gray-500 shrink-0" title="Publication date">
                  Published: {dateLabel}
                </span>
              ) : null}
              {readingTimeLabel ? <span className="text-xs text-gray-500">• {readingTimeLabel}</span> : null}
              <span className="text-xs text-gray-500">• By OmniStack Solutions</span>
              {post.category ? (
                <span className="px-2 py-1 text-xs bg-olive-100 text-olive-800 border border-olive-200 rounded-full">
                  {post.category}
                </span>
              ) : null}
              {preview && (
                <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded">
                  PREVIEW
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight break-words hyphens-auto">
              {post.title}
            </h1>

            {/* Cover image - centered, aligned with content */}
            <div className="relative w-full aspect-[16/9] mt-6 sm:mt-8 md:mt-10 overflow-hidden min-h-0 rounded-lg bg-gray-100">
              <Image
                src={post.coverImageUrl || blogFallbackCover.src}
                alt={post.coverImageUrl ? `Featured image for article: ${post.title}` : `Cover image for blog article: ${post.title}`}
                fill
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
                priority
              />
            </div>

            {/* Table of contents — touch-friendly tap targets on mobile */}
            {tocEntries.length > 0 ? (
              <nav className="mt-6 sm:mt-8 p-4 sm:p-5 bg-gray-50 rounded-lg border border-gray-200" aria-label="Table of contents">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">In this article</h2>
                <ul className="space-y-0">
                  {tocEntries.map((entry) => (
                    <li key={entry.id} className={entry.level === "h3" ? "pl-4" : ""}>
                      <a
                        href={`#${entry.id}`}
                        className="block py-2.5 sm:py-2 text-sm font-medium text-olive-700 hover:underline active:bg-olive-100/50 rounded min-h-[44px] sm:min-h-0 flex items-center"
                      >
                        {entry.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}

            {/* Article body — mobile: overflow-safe prose, touch-friendly */}
            <div className="mt-6 sm:mt-8 md:mt-10 w-full min-w-0">
              <article className="prose prose-sm sm:prose-base md:prose-lg w-full max-w-none min-w-0 prose-headings:text-gray-900 prose-headings:text-left prose-headings:break-words prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-justify prose-p:hyphens-auto prose-p:break-words prose-a:text-olive-700 prose-a:no-underline hover:prose-a:underline prose-a:break-all prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ul:text-left prose-ol:text-gray-700 prose-ol:text-left prose-li:text-gray-700 prose-li:break-words prose-img:rounded-lg prose-img:max-w-full prose-img:mx-auto prose-img:block prose-img:h-auto prose-blockquote:border-l-olive-400 prose-blockquote:text-gray-600 prose-blockquote:text-left prose-blockquote:break-words prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:text-xs sm:prose-code:text-sm prose-code:break-all prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:overflow-x-auto prose-pre:max-w-full prose-pre:rounded-lg [&>*]:max-w-full [&>*]:break-words [&>p]:break-words [&>h1]:break-words [&>h2]:break-words [&>h3]:break-words [&>h4]:break-words [&>h5]:break-words [&>h6]:break-words">
                {post.content ? (
                  <PortableText value={post.content as any} components={portableTextComponents as any} />
                ) : null}
              </article>

              {tags.length > 0 ? (
                <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 justify-center">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs bg-gray-100 text-gray-700 border border-gray-200 rounded-full break-all"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}

              {/* Related posts */}
              {relatedPosts.length > 0 ? (
                <div className="mt-10 sm:mt-12 pt-8 border-t border-gray-200 w-full min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Related posts</h2>
                  <ul className="space-y-6 sm:space-y-4 list-none pl-0">
                    {relatedPosts.map((r) => (
                      <li key={r._id} className="border-b border-gray-100 pb-6 sm:pb-4 last:border-0 last:pb-0 last:sm:pb-0">
                        <Link
                          href={`/blogs/${r.slug}`}
                          className="block py-2 sm:py-1 text-olive-700 hover:underline font-medium break-words active:bg-gray-100 rounded min-h-[44px] sm:min-h-0 flex flex-col justify-center"
                        >
                          {r.title}
                        </Link>
                        {r.excerpt ? (
                          <p className="text-sm text-gray-600 mt-1 sm:mt-1 line-clamp-2 sm:line-clamp-2 break-words">{r.excerpt}</p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

