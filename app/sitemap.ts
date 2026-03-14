import type { MetadataRoute } from 'next'
import { sanityClient } from '@/src/lib/sanity.client'
import { allBlogsQuery } from '@/src/lib/sanity.queries'
import type { SanityBlogListItem } from '@/src/lib/sanity.types'

const PROGRAMMATIC_PATHS = [
  '/hire-react-developers',
  '/hire-nodejs-developers',
  '/ai-automation-services',
  '/cloud-devops-services',
  '/startup-mvp-development',
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') || 'https://omnistack.co.in'

  let posts: SanityBlogListItem[] = []
  try {
    posts = await sanityClient.fetch<SanityBlogListItem[]>(allBlogsQuery)
  } catch {
    posts = []
  }

  const now = new Date()
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/projects`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/blogs`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    ...PROGRAMMATIC_PATHS.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
  ]

  const blogEntries = posts
    .filter((p) => Boolean(p.slug))
    .map((p) => ({
      url: `${baseUrl}/blogs/${p.slug}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  return [...staticEntries, ...blogEntries]
}

