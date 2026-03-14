# Performance optimizations

This document summarizes the optimizations in place for fast loading.

## Loading & bundle

- **Homepage:** Hero and Services load first; all below-the-fold sections (Testimonials, Instagram, Portfolio, Projects, Blog, Why Choose Us, CTA) are lazy-loaded via `next/dynamic` with light placeholders.
- **Tree-shaking:** `optimizePackageImports` in `next.config.js` for `lucide-react` and `@sanity/client` to reduce client JS.
- **WhatsApp button:** Loaded after 1.8s via `WhatsAppButtonDeferred` so it doesn’t block LCP or main thread.
- **Compression:** `compress: true` in Next.js config (gzip/brotli when supported).

## LCP & critical path

- **Hero image:** `priority` and `fetchPriority="high"`; preloaded in layout with `<link rel="preload" href="/hero/hero-illustration.png" as="image">`.
- **Logo:** Preloaded in layout; priority loading for size ≥ 40px (navbar).
- **Preconnect:** `cdn.sanity.io` in layout head for Sanity images.

## Caching

- **Headers (next.config):** Long-lived cache for `/_next/static/*`, `/logo.png`, `/favicon.ico`, `/hero/*`.
- **ISR:** Homepage and blog use `revalidate = 60` where appropriate.

## Images

- **Formats:** AVIF and WebP enabled in `next.config.js` for smaller images.
- **Lazy loading:** Below-the-fold images use default lazy loading; hero and logo use `priority`.

## Pushing to GitHub

Ensure `.env.local` and other env files with secrets are in `.gitignore` (they are). Never commit API keys or database URLs.
