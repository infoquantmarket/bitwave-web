import AdminShell from "@/components/admin/AdminShell"
import PostEditor, { type EditorInitial } from "@/components/admin/PostEditor"
import { requireAdmin } from "@/lib/admin-guard"
import { getStoredPost } from "@/lib/blog-store"

export const dynamic = "force-dynamic"

export default async function EditorPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; slug?: string }>
}) {
  await requireAdmin()
  const { lang, slug } = await searchParams
  const l = lang === "en" ? "en" : "es"
  const existing = slug ? await getStoredPost(l, slug) : null

  const initial: EditorInitial = existing
    ? {
        lang: existing.lang,
        slug: existing.slug,
        title: existing.title,
        excerpt: existing.excerpt,
        coverImage: existing.coverImage,
        coverAlt: existing.coverAlt,
        date: existing.date ? existing.date.slice(0, 10) : "",
        author: existing.author,
        metaTitle: existing.metaTitle,
        metaDescription: existing.metaDescription,
        keywords: existing.keywords.join(", "),
        faq: existing.faq,
        alternate: existing.alternate ?? "",
        content: existing.content,
        status: existing.status,
      }
    : {
        lang: "es",
        slug: "",
        title: "",
        excerpt: "",
        coverImage: "",
        coverAlt: "",
        date: "",
        author: "BitWave",
        metaTitle: "",
        metaDescription: "",
        keywords: "",
        faq: [],
        alternate: "",
        content: "",
        status: "draft",
      }

  return (
    <AdminShell wide>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{existing ? "Editar artículo" : "Nuevo artículo"}</h1>
      <PostEditor initial={initial} original={existing ? { lang: existing.lang, slug: existing.slug } : null} />
    </AdminShell>
  )
}
