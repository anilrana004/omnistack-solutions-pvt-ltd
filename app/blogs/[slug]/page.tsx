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

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const preview = isPreviewMode();
  const post = await getPost(params.slug, preview);
  
  if (!post) return notFound();

  const dateLabel =
    post.publishedAt && !Number.isNaN(new Date(post.publishedAt).getTime())
      ? new Date(post.publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

  return (
    <div className={preview ? "pt-36" : "pt-16"}>
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
          "omni-bg-overlay py-8 sm:py-12 md:py-14",
          "bg-[url('/images/backgrounds/blogs-news-bg.jpg.jpg')] bg-cover bg-center bg-no-repeat",
        ].join(" ")}
      >
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="omni-glass p-4 sm:p-6 md:p-8">
            <div className="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 flex-wrap">
              {dateLabel ? <span className="text-xs text-white/70">{dateLabel}</span> : null}
              {preview && (
                <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded">
                  PREVIEW
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-50 leading-tight break-words">
              {post.title}
            </h1>

            <div className="relative w-full aspect-[16/9] mt-6 sm:mt-8 md:mt-10 rounded-xl sm:rounded-2xl overflow-hidden bg-white/10 border border-white/15">
              <Image
                src={post.coverImageUrl || blogFallbackCover.src}
                alt={post.coverImageUrl ? post.title : `Cover image for ${post.title}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>

            <article className="prose prose-sm sm:prose-base md:prose-lg max-w-none mt-6 sm:mt-8 md:mt-10 prose-invert prose-headings:text-gray-50 prose-p:text-white/90 prose-p:leading-relaxed prose-a:text-blue-300 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-ul:text-white/90 prose-ol:text-white/90 prose-li:text-white/90 prose-img:rounded-lg prose-img:w-full prose-img:max-w-full prose-img:h-auto prose-blockquote:border-l-white/30 prose-blockquote:text-white/80 prose-code:text-white prose-pre:bg-black/40 prose-pre:text-white/90 [&>*]:overflow-x-auto [&>*]:break-words [&>p]:break-words [&>h1]:break-words [&>h2]:break-words [&>h3]:break-words [&>h4]:break-words [&>h5]:break-words [&>h6]:break-words">
              {post.content ? <PortableText value={post.content as any} /> : null}
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

