// lib/blog.ts
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import readingTime from "reading-time"

const BLOG_DIR = path.join(process.cwd(), "content/blog")

export interface PostMeta {
  title: string
  slug: string
  excerpt: string
  coverImage: string
  date: string
  author: string
  readTime: string
  lang: "es" | "en"
  metaTitle: string
  metaDescription: string
  keywords: string[]
}

export interface Post extends PostMeta {
  content: string
}

export function getAllPosts(lang: "es" | "en" = "es"): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"))
  const posts = files.map((filename): PostMeta => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8")
    const { data, content } = matter(raw)
    const rt = readingTime(content)
    return {
      title: data.title ?? "",
      slug: data.slug ?? filename.replace(".mdx", ""),
      excerpt: data.excerpt ?? "",
      coverImage: data.coverImage ?? "/images/blog/default.jpg",
      date: data.date ?? new Date().toISOString(),
      author: data.author ?? "BitWave",
      readTime: `${Math.ceil(rt.minutes)} min`,
      lang: data.lang ?? "es",
      metaTitle: data.metaTitle ?? data.title ?? "",
      metaDescription: data.metaDescription ?? data.excerpt ?? "",
      keywords: data.keywords ?? [],
    }
  })
  return posts
    .filter((p) => p.lang === lang)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): Post | null {
  if (!fs.existsSync(BLOG_DIR)) return null
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"))
  for (const filename of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8")
    const { data, content } = matter(raw)
    if (data.slug === slug) {
      const rt = readingTime(content)
      return {
        title: data.title ?? "",
        slug: data.slug ?? filename.replace(".mdx", ""),
        excerpt: data.excerpt ?? "",
        coverImage: data.coverImage ?? "/images/blog/default.jpg",
        date: data.date ?? new Date().toISOString(),
        author: data.author ?? "BitWave",
        readTime: `${Math.ceil(rt.minutes)} min`,
        lang: data.lang ?? "es",
        metaTitle: data.metaTitle ?? data.title ?? "",
        metaDescription: data.metaDescription ?? data.excerpt ?? "",
        keywords: data.keywords ?? [],
        content,
      }
    }
  }
  return null
}
