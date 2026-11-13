// lib/blog.ts
// Dos fuentes: archivos MDX en content/blog (en el repo) y posts publicados desde /admin (Vercel Blob).
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import readingTime from "reading-time"
import { siteConfig } from "@/lib/config"
import { getStoredIndex, getStoredPost, type StoredMeta } from "@/lib/blog-store"

const BLOG_DIR = path.join(process.cwd(), "content/blog")

export interface PostMeta {
  title: string
  slug: string
  excerpt: string
  /** Ruta relativa (/images/...) en posts de archivo; URL completa en posts del panel. */
  coverImage: string
  coverAlt?: string
  date: string
  author: string
  readTime: string
  lang: "es" | "en"
  metaTitle: string
  metaDescription: string
  keywords: string[]
  faq: { q: string; a: string }[]
  /** Slug del post equivalente en el otro idioma (para hreflang y selector de idioma). */
  alternate?: string
  /** "admin" = publicado desde el panel (Markdown plano); "file" = MDX del repo. */
  source: "file" | "admin"
}

export interface Post extends PostMeta {
  content: string
}

/** URL absoluta de una imagen de portada (relativa o ya completa). */
export function absoluteImage(src: string): string {
  return src.startsWith("http") ? src : `${siteConfig.siteUrl}${src}`
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
    faq: (data.faq as { q: string; a: string }[]) ?? [],
    alternate: (data.alternate as string) || undefined,
    source: "file",
  }
}

function storedToMeta(m: StoredMeta): PostMeta {
  return {
    title: m.title,
    slug: m.slug,
    excerpt: m.excerpt,
    coverImage: m.coverImage || "/images/blog/default.jpg",
    coverAlt: m.coverAlt || undefined,
    date: m.date,
    author: m.author || "BitWave",
    readTime: `${m.readMinutes || 1} min`,
    lang: m.lang,
    metaTitle: m.metaTitle || m.title,
    metaDescription: m.metaDescription || m.excerpt,
    keywords: m.keywords ?? [],
    faq: m.faq ?? [],
    alternate: m.alternate || undefined,
    source: "admin",
  }
}

function readFilePosts(): { meta: PostMeta; content: string }[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8")
      const { data, content } = matter(raw)
      return { meta: buildPostMeta(data, content, filename), content }
    })
}

/** Slugs de posts de archivo por idioma (para evitar colisiones al publicar desde el panel). */
export function getFileSlugs(lang: "es" | "en"): string[] {
  return readFilePosts()
    .filter((p) => p.meta.lang === lang)
    .map((p) => p.meta.slug)
}

/** Mapa slug -> slug equivalente en el otro idioma, por idioma de origen. */
export async function getPostAlternates(): Promise<Record<"es" | "en", Record<string, string>>> {
  const out: Record<"es" | "en", Record<string, string>> = { es: {}, en: {} }
  for (const lang of ["es", "en"] as const) {
    for (const p of await getAllPosts(lang)) {
      if (p.alternate) out[lang][p.slug] = p.alternate
    }
  }
  return out
}

/** Posts publicados (archivo + panel), del más reciente al más antiguo. */
export async function getAllPosts(lang: "es" | "en" = "es"): Promise<PostMeta[]> {
  const files = readFilePosts()
    .map((p) => p.meta)
    .filter((p) => p.lang === lang)
  const stored = (await getStoredIndex())
    .filter((m) => m.lang === lang && m.status === "published")
    .map((m) => storedToMeta(m))
  return [...files, ...stored].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostBySlug(
  slug: string,
  lang?: "es" | "en",
  opts?: { includeDrafts?: boolean }
): Promise<Post | null> {
  for (const { meta, content } of readFilePosts()) {
    if (meta.slug === slug && (!lang || meta.lang === lang)) return { ...meta, content }
  }
  const index = await getStoredIndex()
  const hit = index.find((m) => m.slug === slug && (!lang || m.lang === lang) && (opts?.includeDrafts || m.status === "published"))
  if (!hit) return null
  const full = await getStoredPost(hit.lang, hit.slug)
  if (!full) return null
  return { ...storedToMeta(full), content: full.content }
}
