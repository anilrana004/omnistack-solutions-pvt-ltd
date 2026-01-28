"use client";

import { useEffect, useMemo, useState } from "react";
import { Instagram } from "lucide-react";

interface InstagramPost {
  id?: string;
  permalink: string;
  timestamp: string;
  caption?: string;
  mediaUrl: string;
}

interface InstagramFeedProps {
  posts?: InstagramPost[];
  title?: string;
  subtitle?: string;
}

export default function InstagramFeed({
  posts: postsProp,
  title = "Follow Our Journey",
  subtitle = "Latest updates from our Instagram",
}: InstagramFeedProps) {
  const [posts, setPosts] = useState<InstagramPost[]>(postsProp ?? []);
  const [loading, setLoading] = useState<boolean>(!postsProp);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const placeholders = useMemo(() => Array.from({ length: 6 }), []);

  const normalizeApiPosts = (raw: any[]): InstagramPost[] => {
    return (raw ?? [])
      .slice(0, 6)
      .map((p) => ({
        permalink: String(p?.permalink ?? ""),
        timestamp: String(p?.timestamp ?? ""),
        caption: typeof p?.caption === "string" ? p.caption : "",
        mediaUrl: String(p?.mediaUrl ?? ""),
      }))
      .filter((p) => Boolean(p.mediaUrl && p.permalink));
  };

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/instagram", { method: "GET" });
      const json = (await res.json()) as { posts?: any[] };
      if (!res.ok) throw new Error("fetch_failed");

      const next = normalizeApiPosts(json.posts ?? []);
      setPosts(next);
      const usedFallback = res.headers.get("x-ig-fallback") === "1";
      if (usedFallback && next.length === 0) {
        setError("Couldn’t load Instagram posts. Please try again.");
      }
    } catch {
      setError("Couldn’t load Instagram posts. Please try again.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postsProp) return;
    fetchPosts();

    const interval = window.setInterval(() => {
      fetchPosts();
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      window.clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postsProp]);

  return (
    <section
      className={[
        "omni-bg-overlay py-20",
        "bg-[url('/images/backgrounds/instagram-section-bg.jpg')] bg-cover bg-center bg-no-repeat",
      ].join(" ")}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Instagram className="w-6 h-6 text-white/90" />
            <span className="text-sm font-medium text-white/80 uppercase tracking-wider">
              Instagram
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Feed Grid */}
        <div className="max-w-6xl mx-auto">
          {error ? (
            <div className="mx-auto max-w-xl rounded-2xl border border-white/15 bg-black/25 p-6 text-center text-white">
              <p className="text-sm text-white/90">{error}</p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={fetchPosts}
                  className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-semibold text-olive-800 transition-colors md:hover:bg-white/90"
                >
                  Retry
                </button>
                <a
                  href="https://www.instagram.com/omnistack.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition-colors md:hover:bg-white/10"
                >
                  Open Instagram
                </a>
              </div>
            </div>
          ) : null}

          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
            {(loading ? placeholders : posts).map((postOrPlaceholder, idx) => {
              const post = loading ? null : (postOrPlaceholder as InstagramPost);

              const imageSrc = post ? post.mediaUrl : null;

              const caption =
                post?.caption?.trim() ||
                (post ? "View on Instagram" : "Loading Instagram posts");

              const displayDate = post?.timestamp ? formatDate(post.timestamp) : "";

              const card = (
                <div
                  className={[
                    "omni-glass-card overflow-hidden",
                  ].join(" ")}
                >
                  <div className="relative w-full aspect-[4/3] bg-gray-50">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={caption}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full animate-pulse bg-gradient-to-br from-gray-50 to-gray-100" />
                    )}
                    <div className="absolute top-2 right-2 rounded-full bg-white/85 p-1 text-olive-700 shadow-sm">
                      <Instagram className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="px-3 py-2">
                    <p className="text-xs text-white/85 line-clamp-2">{caption}</p>
                    {displayDate ? (
                      <p className="mt-2 text-[11px] text-white/70">{displayDate}</p>
                    ) : null}
                  </div>
                </div>
              );

              if (!post) {
                return <div key={`ig-skeleton-${idx}`}>{card}</div>;
              }

              return (
                <a
                  key={post.permalink || `ig-${idx}`}
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open Instagram post"
                  className="block"
                >
                  {card}
                </a>
              );
            })}
          </div>
        </div>

        {/* Follow CTA */}
        <div className="text-center mt-12">
          <a
            href="https://www.instagram.com/omnistack.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-olive-600 to-olive-700 
                       text-white font-semibold rounded-full hover:from-olive-700 hover:to-olive-800 
                       transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            <Instagram className="w-5 h-5" />
            Follow @omnistack.dev
          </a>
        </div>
      </div>
    </section>
  );
}
