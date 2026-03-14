/**
 * SEO utilities for blog: TOC extraction, slugify for heading anchors.
 */

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export type TocEntry = { text: string; level: "h2" | "h3"; id: string }

interface PortableTextBlock {
  _type?: string
  style?: string
  children?: Array<{ text?: string }>
}

export function extractHeadings(content: unknown): TocEntry[] {
  if (!Array.isArray(content)) return []
  const entries: TocEntry[] = []
  for (const block of content as PortableTextBlock[]) {
    if (block._type !== "block" || !block.style) continue
    if (block.style !== "h2" && block.style !== "h3") continue
    const text = block.children?.[0]?.text
    if (!text) continue
    entries.push({
      text,
      level: block.style as "h2" | "h3",
      id: slugify(text),
    })
  }
  return entries
}
