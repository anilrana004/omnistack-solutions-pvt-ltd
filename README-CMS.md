# OmniStack CMS (Sanity) – Quick Ops

## What you can update without code/terminal
- Create/edit/publish blog posts in Sanity Studio.
- Website updates automatically (ISR + optional webhook revalidation).

## Environment variables
Add these to your hosting environment (and optionally to `.env.local`):

```env
# Sanity (frontend reads only)
NEXT_PUBLIC_SANITY_PROJECT_ID=kvjr9xh2
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

# Optional: used for sitemap/robots
NEXT_PUBLIC_SITE_URL=https://YOUR_DOMAIN

# Optional: instant updates on publish (webhook)
SANITY_REVALIDATE_SECRET=some-long-random-string
```

## Instant blog updates after Publish (recommended)

### 1) Create a webhook in Sanity
In Sanity Manage:
- Project: `kvjr9xh2`
- Dataset: `production`
- Go to **API → Webhooks → Create**

Webhook URL:
`https://YOUR_DOMAIN/api/revalidate?secret=SANITY_REVALIDATE_SECRET`

Trigger:
- “Create” and “Update” (at minimum)
- Filter to `_type == "post"` if available

Payload (JSON):
```json
{ "slug": "{{document.slug.current}}" }
```

### 2) What happens
- `/blogs` is revalidated immediately
- `/blogs/[slug]` is revalidated when `slug` is provided

## Sanity Studio (local)
If you’re running Studio locally:

```bash
 
npm install
npm run dev
```

Studio runs at: `http://localhost:3333`

