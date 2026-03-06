import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";

import { blogFallbackCover } from "@/data/imageAssets";
import { getBlogBySlug } from "@/src/lib/sanity.api";
import { createSEOManager } from "@/src/lib/seo";
import { getSiteSettings } from "@/src/lib/sanity.api";
import { isPreviewMode } from "@/src/lib/preview-utils";
import PreviewBanner from "@/src/components/PreviewBanner";

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

  return (
    <div className={`min-w-0 overflow-x-hidden ${preview ? "pt-36" : "pt-14 sm:pt-16"}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Preview Banner */}
      {preview && (
        <PreviewBanner
          isPreview={preview}
          documentType="post"
          documentId={post._id}
        />
      )}
      
      <section
        className={[
          "omni-bg-overlay py-6 sm:py-10 md:py-14",
          "bg-[url('/images/backgrounds/blogs-news-bg.jpg.jpg')] bg-cover bg-center bg-no-repeat",
        ].join(" ")}
      >
        <div className="relative z-10 max-w-3xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="omni-glass p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl overflow-hidden">
            <div className="mb-3 sm:mb-6 flex items-center gap-2 sm:gap-3 flex-wrap">
              {dateLabel ? <span className="text-xs text-white/70">{dateLabel}</span> : null}
              {readingTimeLabel ? <span className="text-xs text-white/70">• {readingTimeLabel}</span> : null}
              {post.category ? (
                <span className="px-2 py-1 text-xs bg-white/10 text-white/85 border border-white/15 rounded-full">
                  {post.category}
                </span>
              ) : null}
              {preview && (
                <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded">
                  PREVIEW
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-50 leading-tight break-words hyphens-auto">
              {post.title}
            </h1>

            <div className="relative w-full aspect-[16/9] mt-4 sm:mt-6 md:mt-10 rounded-lg sm:rounded-2xl overflow-hidden bg-white/10 border border-white/15 min-h-0">
              <Image
                src={post.coverImageUrl || blogFallbackCover.src}
                alt={post.coverImageUrl ? post.title : `Cover image for ${post.title}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>

            <article className="prose prose-sm sm:prose-base md:prose-lg max-w-none mt-4 sm:mt-6 md:mt-10 prose-invert prose-headings:text-gray-50 prose-p:text-white/90 prose-p:leading-relaxed prose-a:text-blue-300 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-ul:text-white/90 prose-ol:text-white/90 prose-li:text-white/90 prose-img:rounded-lg prose-img:max-w-full prose-img:h-auto prose-blockquote:border-l-white/30 prose-blockquote:text-white/80 prose-code:text-white prose-pre:bg-black/40 prose-pre:text-white/90 prose-pre:overflow-x-auto prose-pre:max-w-full [&>*]:max-w-full [&>*]:overflow-x-auto [&>*]:break-words [&>p]:break-words [&>h1]:break-words [&>h2]:break-words [&>h3]:break-words [&>h4]:break-words [&>h5]:break-words [&>h6]:break-words [&_a]:break-all">
              {post.content ? <PortableText value={post.content as any} /> : null}
            </article>

            {tags.length > 0 ? (
              <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs bg-white/10 text-white/85 border border-white/15 rounded-full break-all"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

