# Vercel Environment Variables Setup Guide

## 📋 Environment Variables Template

Your `.env.local` file should contain the following variables (see `.env.example` for template):

**⚠️ IMPORTANT:** Never commit `.env.local` to Git. Use `.env.example` as a template.

---

## 🚀 Vercel Environment Variables Setup

### Step-by-Step Instructions

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Select your project (or create new project)

2. **Navigate to Settings**
   - Click on your project
   - Go to **Settings** → **Environment Variables**

3. **Add Each Variable**

   Copy and paste each variable from the list below into Vercel:

---

## ✅ Required Environment Variables

These are **CRITICAL** - your site won't work without them:

### Sanity CMS (Required)
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=sk-your-token-here
```

### Site Configuration (Required)
```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Email Configuration (Required for Contact Form)
```
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
ADMIN_EMAIL=your-email@domain.com
```

---

## ⚠️ Optional Environment Variables

These enhance functionality but aren't critical:

### Preview Mode (Optional - for draft content preview)
```
SANITY_PREVIEW_SECRET=your-preview-secret-here
```

### Instagram Feed (Optional - if you want Instagram feed)
```
IG_LONG_LIVED_ACCESS_TOKEN=your-instagram-token
IG_BUSINESS_ID=your-business-id
```

---

## 📝 Quick Copy-Paste List for Vercel

**⚠️ IMPORTANT:** Replace placeholder values with your actual credentials from `.env.local`.

### Production Environment Variables:

See `.env.example` for the complete template with all required variables.

---

## 🔒 Security Notes

### ⚠️ IMPORTANT:
- **NEVER** commit `.env.local` to GitHub (already in `.gitignore` ✅)
- **NEVER** share these values publicly
- **DO** use Vercel's environment variable interface (secure)
- **DO** rotate secrets periodically

### Variables by Security Level:

**Public (Safe to expose):**
- `NEXT_PUBLIC_*` variables (these are exposed to browser)

**Private (Server-only):**
- `SANITY_API_TOKEN` - Server-only, never sent to client
- `SANITY_PREVIEW_SECRET` - Server-only, validates preview requests
- `SMTP_*` - Server-only, email credentials
- `ADMIN_EMAIL` - Server-only
- `IG_*` - Server-only, Instagram API credentials

---

## 🎯 Environment Selection in Vercel

When adding variables in Vercel, select:

- ✅ **Production** - For live site
- ✅ **Preview** - For preview deployments (optional, can use same values)
- ✅ **Development** - For local development (optional)

**Recommendation:** Set all variables for **Production** at minimum.

---

## ✅ Verification Checklist

After setting variables in Vercel:

- [ ] All required variables added
- [ ] Values copied exactly (no extra spaces/quotes)
- [ ] Production environment selected
- [ ] Redeploy after adding variables
- [ ] Test contact form (verifies SMTP)
- [ ] Test Sanity CMS content loads
- [ ] Check Vercel build logs for errors

---

## 🐛 Troubleshooting

### Build Fails with "Missing Environment Variable"
- Check variable name matches exactly (case-sensitive)
- Ensure variable is set for Production environment
- Redeploy after adding variables

### Contact Form Not Working
- Verify `SMTP_*` variables are set correctly
- Check `ADMIN_EMAIL` is valid
- Check Vercel Functions logs for SMTP errors

### Sanity CMS Not Loading
- Verify `SANITY_API_TOKEN` starts with `sk`
- Check `NEXT_PUBLIC_SANITY_PROJECT_ID` matches your Sanity project
- Verify token has Editor permissions in Sanity

### Preview Mode Not Working
- Ensure `SANITY_PREVIEW_SECRET` is set
- Verify `SANITY_API_TOKEN` is set
- Check preview URL format: `/api/preview?secret=YOUR_SECRET&slug=/page`

---

## 📚 Additional Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

---

**Last Updated:** January 28, 2026  
**Status:** Ready for Vercel Deployment ✅