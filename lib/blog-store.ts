// Posts publicados desde /admin: viven en Vercel Blob (el filesystem de Vercel es de solo lectura).
// Layout: blog/index.json (metadatos de todos) + blog/posts/{lang}/{slug}.json (post completo) + blog/images/*.
import { put, head, del, BlobNotFoundError } from "@vercel/blob"
import { unstable_cache } from "next/cache"

export type PostStatus = "draft" | "published"
export type Lang = "es" | "en"

export interface StoredMeta {
  title: string
  slug: string
  lang: Lang
  excerpt: string
  coverImage: string
  coverAlt: string
  /** Fecha de publicación (ISO). Define el orden en el blog. */
  date: string
  updatedAt: string
  author: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  faq: { q: string; a: string }[]
  alternate?: string
  status: PostStatus
  readMinutes: number
}

export interface StoredPost extends StoredMeta {
  content: string
}

const INDEX = "blog/index.json"
const postPath = (lang: Lang, slug: string) => `blog/posts/${lang}/${slug}.json`

export const blobConfigured = () => !!process.env.BLOB_READ_WRITE_TOKEN

async function readJson<T>(pathname: string): Promise<T | null> {
  try {
    const meta = await head(pathname)
    // El query evita que el CDN de Blob sirva una versión vieja tras sobrescribir el archivo.
    const res = await fetch(`${meta.url}?t=${Date.now()}`, { cache: "no-store" })
    return res.ok ? ((await res.json()) as T) : null
  } catch (e) {
    if (e instanceof BlobNotFoundError) return null
    throw e
  }
}

async function writeJson(pathname: string, data: unknown) {
  await put(pathname, JSON.stringify(data), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  })
}

const cachedIndex = unstable_cache(async () => (await readJson<StoredMeta[]>(INDEX)) ?? [], ["blog-index"], {
  tags: ["blog"],
  revalidate: 3600,
})

const cachedPost = unstable_cache(async (lang: Lang, slug: string) => readJson<StoredPost>(postPath(lang, slug)), ["blog-post"], {
  tags: ["blog"],
  revalidate: 3600,
})

/** Metadatos de todos los posts del panel (borradores incluidos). Nunca lanza: sin Blob devuelve []. */
export async function getStoredIndex(): Promise<StoredMeta[]> {
  if (!blobConfigured()) return []
  try {
    return await cachedIndex()
  } catch (e) {
    console.error("blog-store: no se pudo leer el índice", e)
    return []
  }
}

export async function getStoredPost(lang: Lang, slug: string): Promise<StoredPost | null> {
  if (!blobConfigured()) return null
  try {
    return await cachedPost(lang, slug)
  } catch (e) {
    console.error("blog-store: no se pudo leer el post", e)
    return null
  }
}

const toMeta = ({ content: _content, ...meta }: StoredPost): StoredMeta => meta

/** Guarda el post y actualiza el índice. `previous` = lang/slug anteriores si se editó el slug o el idioma. */
export async function saveStoredPost(post: StoredPost, previous?: { lang: Lang; slug: string }) {
  const index = (await readJson<StoredMeta[]>(INDEX)) ?? []
  const renamed = previous && (previous.lang !== post.lang || previous.slug !== post.slug)
  const next = index.filter(
    (m) => !(m.lang === post.lang && m.slug === post.slug) && !(renamed && m.lang === previous.lang && m.slug === previous.slug)
  )
  next.push(toMeta(post))
  await writeJson(postPath(post.lang, post.slug), post)
  await writeJson(INDEX, next)
  if (renamed) await removeBlob(postPath(previous.lang, previous.slug))
}

export async function deleteStoredPost(lang: Lang, slug: string) {
  const index = (await readJson<StoredMeta[]>(INDEX)) ?? []
  await writeJson(
    INDEX,
    index.filter((m) => !(m.lang === lang && m.slug === slug))
  )
  await removeBlob(postPath(lang, slug))
}

async function removeBlob(pathname: string) {
  try {
    await del((await head(pathname)).url)
  } catch (e) {
    if (!(e instanceof BlobNotFoundError)) throw e
  }
}

export async function uploadCover(data: Buffer, baseName: string): Promise<string> {
  const blob = await put(`blog/images/${baseName}-${Date.now()}.webp`, data, {
    access: "public",
    contentType: "image/webp",
    addRandomSuffix: false,
  })
  return blob.url
}
