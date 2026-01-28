import type {MetadataRoute} from 'next'
import {sanityClient} from '@/src/lib/sanity.client'
import {allBlogsQuery} from '@/src/lib/sanity.queries'
import type {SanityBlogListItem} from '@/src/lib/sanity.types'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') || 'http://localhost:3000'

  let posts: SanityBlogListItem[] = []
  try {
    posts = await sanityClient.fetch<SanityBlogListItem[]>(allBlogsQuery)
  } catch {
    posts = []
  }

  return [
    {url: `${baseUrl}/`, lastModified: new Date()},
    {url: `${baseUrl}/services`, lastModified: new Date()},
    {url: `${baseUrl}/projects`, lastModified: new Date()},
    {url: `${baseUrl}/about`, lastModified: new Date()},
    {url: `${baseUrl}/contact`, lastModified: new Date()},
    {url: `${baseUrl}/blogs`, lastModified: new Date()},
    ...posts
      .filter((p) => Boolean(p.slug))
      .map((p) => ({
        url: `${baseUrl}/blogs/${p.slug}`,
        lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
      })),
  ]
}

