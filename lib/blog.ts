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

function buildPostMeta(data: Record<string, unknown>, content: string, filename: string): PostMeta {
  const rt = readingTime(content)
  return {
    title: (data.title as string) ?? "",
    slug: (data.slug as string) ?? filename.replace(".mdx", ""),
    excerpt: (data.excerpt as string) ?? "",
    coverImage: (data.coverImage as string) ?? "/images/blog/default.jpg",
    date: (data.date as string) ?? new Date().toISOString(),
    author: (data.author as string) ?? "BitWave",
    readTime: `${Math.ceil(rt.minutes)} min`,
    lang: ((data.lang as string) === "en" ? "en" : "es") as "es" | "en",
    metaTitle: (data.metaTitle as string) ?? (data.title as string) ?? "",
    metaDescription: (data.metaDescription as string) ?? (data.excerpt as string) ?? "",
    keywords: (data.keywords as string[]) ?? [],
  }
}

export function getAllPosts(lang: "es" | "en" = "es"): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"))
  const posts = files.map((filename): PostMeta => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8")
    const { data, content } = matter(raw)
    return buildPostMeta(data, content, filename)
  })
  return posts
    .filter((p) => p.lang === lang)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string, lang?: "es" | "en"): Post | null {
  if (!fs.existsSync(BLOG_DIR)) return null
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"))
  for (const filename of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8")
    const { data, content } = matter(raw)
    if (data.slug === slug && (!lang || data.lang === lang)) {
      return {
        ...buildPostMeta(data, content, filename),
        content,
      }
    }
  }
  return null
}
