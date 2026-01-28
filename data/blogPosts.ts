export type BlogPost = {
  _id: string
  title: string
  slug: string
  type: 'Blog' | 'News'
  excerpt: string
  publishedAt: string
  featured?: boolean
  imageUrl?: string | null
  author?: string
  content?: string[]
}

export const blogPosts: BlogPost[] = [
  {
    _id: 'local-1',
    title: 'Blogs & News (Coming Soon)',
    slug: 'coming-soon',
    type: 'News',
    excerpt:
      'Sanity CMS has been removed from this project. You can add your CMS setup later and wire these pages back up.',
    publishedAt: new Date().toISOString(),
    featured: true,
    author: 'OmniStack Solutions',
    content: [
      'This project is currently using local placeholder content for blogs.',
      'When you re-add Sanity, you can replace this with Portable Text rendering and real content.',
    ],
  },
]

