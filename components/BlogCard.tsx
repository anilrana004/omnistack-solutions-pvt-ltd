import Link from "next/link";
import Image from "next/image";

import { blogFallbackCover } from "@/data/imageAssets";

type BlogCardProps = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  category?: string;
  tags?: string[];
  readingTime?: number;
  type?: "Blog" | "News" | string;
  imageUrl?: string | null;
  className?: string;
  variant?: "default" | "glass";
};

export default function BlogCard({
  slug,
  title,
  excerpt,
  publishedAt,
  category,
  tags,
  readingTime,
  type,
  imageUrl,
  className = "",
  variant = "default",
}: BlogCardProps) {
  const href = `/blogs/${slug}`;
  const badge = category ? String(category) : type ? String(type) : null;
  const safeReadingTime =
    typeof readingTime === "number" && Number.isFinite(readingTime) && readingTime > 0
      ? `${Math.round(readingTime)} min read`
      : null;
  const visibleTags = Array.isArray(tags) ? tags.filter(Boolean).slice(0, 2) : [];

  const dateLabel =
    publishedAt && !Number.isNaN(new Date(publishedAt).getTime())
      ? new Date(publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

  return (
    <Link
      href={href}
      className={[
        "card-clickable block rounded-xl group overflow-hidden w-full min-w-0",
        variant === "glass"
          ? "omni-glass-card"
          : [
              "bg-white",
              "shadow-[0_1px_4px_rgba(15,23,42,0.08)]",
              "transition-transform duration-200 transition-shadow",
              // Hover effects only on desktop/non-touch devices
              "[@media(hover:hover)]:hover:-translate-y-0.5",
              "[@media(hover:hover)]:hover:shadow-[0_10px_22px_rgba(15,23,42,0.14)]",
            ].join(" "),
        className,
      ].join(" ")}
    >
      <div className="relative w-full aspect-[16/9] bg-gray-100 overflow-hidden min-h-0">
        <Image
          src={imageUrl || blogFallbackCover.src}
          alt={imageUrl ? title : `Cover image for ${title}`}
          fill
          sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 [@media(hover:hover)]:group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>

      <div className="p-4 sm:p-5 lg:p-6 min-h-[160px] sm:min-h-[180px] lg:min-h-[200px]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={[
                "text-xs",
                variant === "glass" ? "text-white/70" : "text-gray-500",
              ].join(" ")}
            >
              {dateLabel}
            </span>
            {safeReadingTime ? (
              <span
                className={[
                  "text-xs",
                  variant === "glass" ? "text-white/70" : "text-gray-500",
                ].join(" ")}
              >
                • {safeReadingTime}
              </span>
            ) : null}
          </div>
          {badge ? (
            <span
              className={[
                "text-xs px-2 py-1 rounded-full font-medium",
                variant === "glass"
                  ? "bg-white/10 text-white/85 border border-white/15"
                  : "bg-olive-100 text-olive-800",
              ].join(" ")}
            >
              {badge}
            </span>
          ) : null}
        </div>

        <h3
          className={[
            "text-lg sm:text-xl font-bold mb-2 sm:mb-3 transition-colors break-words",
            variant === "glass"
              ? "text-gray-50"
              : "text-olive-900 [@media(hover:hover)]:group-hover:text-olive-700",
          ].join(" ")}
        >
          {title}
        </h3>
        <p
          className={[
            "mb-3 sm:mb-4 leading-relaxed text-sm line-clamp-3 break-words",
            variant === "glass" ? "text-white/85" : "text-gray-600",
          ].join(" ")}
        >
          {excerpt}
        </p>

        {visibleTags.length > 0 ? (
          <div className="mb-3 flex gap-2 flex-wrap">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className={[
                  "text-[11px] px-2 py-1 rounded-full",
                  variant === "glass"
                    ? "bg-white/10 text-white/80 border border-white/10"
                    : "bg-gray-100 text-gray-700",
                ].join(" ")}
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}

        <div
          className={[
            "inline-flex items-center text-sm font-medium",
            variant === "glass" ? "text-white/90" : "text-olive-600",
          ].join(" ")}
        >
          Read more →
        </div>
      </div>
    </Link>
  );
}

