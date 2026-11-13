"use server"
import { redirect } from "next/navigation"
import { revalidatePath, updateTag } from "next/cache"
import readingTime from "reading-time"
import { requireAdmin } from "@/lib/admin-guard"
import { getFileSlugs } from "@/lib/blog"
import {
  blobConfigured,
  deleteStoredPost,
  getStoredIndex,
  saveStoredPost,
  type Lang,
  type StoredPost,
} from "@/lib/blog-store"
import { pingIndexNow } from "@/lib/indexnow"

export interface SaveState {
  error?: string
}

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/
const prefix = (lang: Lang) => (lang === "en" ? "/en" : "")

function refreshSite() {
  updateTag("blog")
  revalidatePath("/", "layout")
}

export async function savePost(_prev: SaveState, fd: FormData): Promise<SaveState> {
  await requireAdmin()
  if (!blobConfigured()) {
    return { error: "Falta conectar Vercel Blob al proyecto (Storage → Create → Blob) y hacer Redeploy." }
  }

  const str = (k: string) => String(fd.get(k) ?? "").trim()
  const lang: Lang = str("lang") === "en" ? "en" : "es"
  const status = str("status") === "published" ? "published" : "draft"
  const title = str("title")
  const slug = str("slug")
  const content = String(fd.get("content") ?? "").trim()
  const original = str("originalSlug") ? { lang: (str("originalLang") === "en" ? "en" : "es") as Lang, slug: str("originalSlug") } : undefined

  if (!title) return { error: "Falta el título." }
  if (!SLUG_RE.test(slug)) return { error: "El slug solo admite minúsculas, números y guiones (ej. como-vender-usdt)." }
  if (!content) return { error: "Falta el contenido." }
  if (status === "published") {
    if (!str("metaDescription") && !str("excerpt")) return { error: "Para publicar agrega la meta descripción o el extracto." }
    if (!str("coverImage")) return { error: "Para publicar sube una imagen de portada." }
  }

  const index = await getStoredIndex()
  const isSelf = (l: Lang, s: string) => original && original.lang === l && original.slug === s
  if (getFileSlugs(lang).includes(slug)) return { error: "Ya existe un post del sitio con ese slug." }
  if (index.some((m) => m.lang === lang && m.slug === slug && !isSelf(m.lang, m.slug))) {
    return { error: "Ya existe otro post con ese slug en este idioma." }
  }

  let faq: { q: string; a: string }[] = []
  try {
    faq = (JSON.parse(String(fd.get("faq") ?? "[]")) as { q: string; a: string }[])
      .map((f) => ({ q: String(f.q ?? "").trim(), a: String(f.a ?? "").trim() }))
      .filter((f) => f.q && f.a)
  } catch {
    return { error: "Las preguntas frecuentes tienen un formato inválido." }
  }

  const rawDate = str("date")
  const now = new Date().toISOString()
  const post: StoredPost = {
    title,
    slug,
    lang,
    excerpt: str("excerpt"),
    coverImage: str("coverImage"),
    coverAlt: str("coverAlt"),
    date: rawDate ? new Date(rawDate).toISOString() : status === "published" ? now : "",
    updatedAt: now,
    author: str("author") || "BitWave",
    metaTitle: str("metaTitle"),
    metaDescription: str("metaDescription"),
    keywords: str("keywords")
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    faq,
    alternate: str("alternate") || undefined,
    status,
    readMinutes: Math.max(1, Math.ceil(readingTime(content).minutes)),
    content,
  }

  try {
    await saveStoredPost(post, original)
  } catch (e) {
    console.error("savePost:", e)
    return { error: "No se pudo guardar en Vercel Blob. Revisa que el store sea público y que el token esté configurado." }
  }

  refreshSite()
  if (status === "published") {
    await pingIndexNow([`${prefix(lang)}/blog/${slug}`, `${prefix(lang)}/blog`])
  }
  redirect(`/admin/blog?saved=${status}`)
}

export async function deletePost(fd: FormData) {
  await requireAdmin()
  const lang: Lang = String(fd.get("lang")) === "en" ? "en" : "es"
  const slug = String(fd.get("slug") ?? "")
  if (!SLUG_RE.test(slug)) redirect("/admin/blog")
  try {
    await deleteStoredPost(lang, slug)
  } catch (e) {
    console.error("deletePost:", e)
    redirect("/admin/blog?error=delete")
  }
  refreshSite()
  redirect("/admin/blog?deleted=1")
}
