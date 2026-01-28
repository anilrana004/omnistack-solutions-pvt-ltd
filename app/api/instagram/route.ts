import { NextResponse } from "next/server";
import { logger } from "@/src/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type InstagramApiItem = {
  id: string;
  media_type?: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" | string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  caption?: string | null;
  timestamp?: string;
};

type InstagramApiResponse = {
  data?: InstagramApiItem[];
};

type CleanPost = {
  mediaUrl: string;
  permalink: string;
  caption: string;
  timestamp: string;
};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
let cache: { expiresAt: number; posts: CleanPost[] } | null = null;

function trimCaption(value: unknown, max = 120) {
  const raw = typeof value === "string" ? value : "";
  const compact = raw.replace(/\s+/g, " ").trim();
  if (!compact) return "";
  if (compact.length <= max) return compact;
  return `${compact.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

function pickMediaUrl(item: InstagramApiItem) {
  const type = item.media_type ?? "";
  if (type === "VIDEO") {
    return item.thumbnail_url || item.media_url || "";
  }
  // IMAGE + CAROUSEL_ALBUM
  return item.media_url || "";
}

export async function GET() {
  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    return NextResponse.json(
      { posts: cache.posts },
      {
        headers: {
          "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  }

  const token =
    process.env.IG_ACCESS_TOKEN ?? process.env.IG_LONG_LIVED_ACCESS_TOKEN;
  const userId = process.env.IG_USER_ID ?? process.env.IG_BUSINESS_ID;

  // Safe fallback response shape (no secrets, no errors leaked)
  const fallback = (posts: CleanPost[] = []) =>
    NextResponse.json(
      { posts },
      {
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
          "x-ig-fallback": "1",
        },
      },
    );

  if (!token || !userId) {
    // Log missing config but don't error (graceful degradation)
    logger.warn('Instagram API credentials missing', {
      hasToken: !!token,
      hasUserId: !!userId,
      usingCache: !!cache,
    });
    return fallback(cache?.posts ?? []);
  }

  try {
    const apiBase =
      process.env.IG_API_BASE?.trim() || "https://graph.facebook.com";
    const apiVersion = process.env.IG_API_VERSION?.trim() || "v21.0";
    const normalizedBase = apiBase.replace(/\/+$/, "");
    const isInstagramBasic = normalizedBase.includes("graph.instagram.com");
    const basePath = isInstagramBasic
      ? `${normalizedBase}/${userId}/media`
      : `${normalizedBase}/${apiVersion}/${userId}/media`;

    const url = new URL(basePath);
    url.searchParams.set(
      "fields",
      "id,media_type,media_url,thumbnail_url,permalink,caption,timestamp",
    );
    url.searchParams.set("limit", "6");
    url.searchParams.set("access_token", token);

    const res = await fetch(url.toString(), {
      // Let our in-memory cache control rate limiting; keep Next caching off.
      cache: "no-store",
    });

    if (!res.ok) {
      return fallback(cache?.posts ?? []);
    }

    const json = (await res.json()) as InstagramApiResponse;

    const posts: CleanPost[] = (json.data ?? [])
      .slice(0, 6)
      .map((item) => {
        const mediaUrl = pickMediaUrl(item);
        return {
          mediaUrl,
          permalink: item.permalink ?? "",
          caption: trimCaption(item.caption, 120),
          timestamp: item.timestamp ?? "",
        };
      })
      .filter((p) => Boolean(p.mediaUrl && p.permalink));

    cache = { posts, expiresAt: now + CACHE_TTL_MS };

    return NextResponse.json(
      { posts },
      {
        headers: {
          "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  } catch (error) {
    // Log error but return fallback (graceful degradation)
    logger.apiError('/api/instagram', error instanceof Error ? error : new Error(String(error)), {
      errorType: 'INSTAGRAM_API_ERROR',
      usingCache: !!cache,
    });
    return fallback(cache?.posts ?? []);
  }
}

