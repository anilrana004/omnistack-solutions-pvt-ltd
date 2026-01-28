# Sanity Preview Mode - Usage Guide

## Overview

Preview mode allows content editors to view draft/unpublished content before publishing. It's secured using two environment variables that are **never exposed to the client**.

## Environment Variables

Both variables are loaded from `.env.local` (server-only):

```bash
# Server-only token for authenticating Sanity API requests
SANITY_API_TOKEN="sk_..."

# Secret for securing the preview endpoint
SANITY_PREVIEW_SECRET="your_secure_secret"
```

**Security:** These are server-only variables. They are never sent to the client browser.

## How It Works

### 1. Enable Preview Mode

Visit the preview endpoint with your secret:

```
https://yoursite.com/api/preview?secret=YOUR_SECRET&slug=/blogs/my-post
```

**What happens:**
- API validates `SANITY_PREVIEW_SECRET` against provided secret
- Sets `__sanity_preview` cookie (httpOnly, secure)
- Redirects to the requested page (or returns JSON if no slug)

### 2. Fetch Draft Content

In your page components, check preview mode and pass it to API functions:

```typescript
// app/blogs/[slug]/page.tsx
import { isPreviewMode } from '@/src/lib/preview-utils'
import { getBlogBySlug } from '@/src/lib/sanity.api'

export default async function BlogPage({ params }) {
  // Check if preview mode is enabled (reads __sanity_preview cookie)
  const preview = isPreviewMode()
  
  // Fetch content (will get drafts if preview=true)
  const result = await getBlogBySlug(params.slug, preview)
  
  // If preview mode, show draft content
  // If not, show only published content
  const post = result.data
  
  return <div>{post.title}</div>
}
```

### 3. Disable Preview Mode

Visit:
```
DELETE /api/preview
```

Or use the preview banner's "Exit Preview" button.

## Security Flow

```
User Request
    ↓
/api/preview?secret=SECRET
    ↓
Validates SANITY_PREVIEW_SECRET (server-only)
    ↓
Sets __sanity_preview cookie (httpOnly)
    ↓
Page Component
    ↓
isPreviewMode() checks cookie
    ↓
getClient(preview) returns previewClient
    ↓
previewClient uses SANITY_API_TOKEN (server-only)
    ↓
Fetches draft content from Sanity
```

## Key Points

1. **SANITY_API_TOKEN** is only used server-side in `previewClient`
2. **SANITY_PREVIEW_SECRET** is only validated in `/api/preview` route
3. **Cookie is httpOnly** - JavaScript cannot access it
4. **Token never reaches client** - All API calls are server-side
5. **Falls back gracefully** - If token missing, shows published content only

## Example: Complete Page with Preview

```typescript
import { isPreviewMode } from '@/src/lib/preview-utils'
import { getBlogBySlug } from '@/src/lib/sanity.api'
import PreviewBanner from '@/src/components/PreviewBanner'

export default async function BlogPage({ params }) {
  const preview = isPreviewMode()
  const result = await getBlogBySlug(params.slug, preview)
  
  if (!result.data) return <div>Not found</div>
  
  return (
    <div>
      {preview && (
        <PreviewBanner
          isPreview={preview}
          documentType="post"
          documentId={result.data._id}
        />
      )}
      <article>
        <h1>{result.data.title}</h1>
        {/* Content */}
      </article>
    </div>
  )
}
```

## Testing Preview Mode

1. **Create a draft in Sanity Studio**
2. **Enable preview mode:**
   ```
   http://localhost:3000/api/preview?secret=your_secret&slug=/blogs/draft-post
   ```
3. **Verify draft content appears**
4. **Check preview banner is visible**
5. **Disable preview:**
   ```
   DELETE http://localhost:3000/api/preview
   ```
6. **Verify only published content shows**

## Troubleshooting

**Preview mode not working?**
- Check `SANITY_API_TOKEN` exists in `.env.local`
- Check `SANITY_PREVIEW_SECRET` matches the secret you're using
- Verify token has Editor permissions in Sanity
- Check browser console for cookie (should see `__sanity_preview`)

**Still seeing published content in preview?**
- Token might not have correct permissions
- Document might not be in draft state
- Check Sanity Studio to verify document status

**Token exposed to client?**
- Impossible - token is only used in server-side `previewClient`
- Check network tab - you should never see the token in requests
- Cookie is httpOnly - JavaScript cannot read it