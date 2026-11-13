import { notFound } from "next/navigation"
import PostArticle from "@/components/blog/PostArticle"
import { requireAdmin } from "@/lib/admin-guard"
import { getPostBySlug } from "@/lib/blog"

export const dynamic = "force-dynamic"

/** Vista previa de un artículo del panel (borrador o publicado), solo para admin. */
export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; slug?: string }>
}) {
  await requireAdmin()
  const { lang, slug } = await searchParams
  const l = lang === "en" ? "en" : "es"
  const post = slug ? await getPostBySlug(slug, l, { includeDrafts: true }) : null
  if (!post) notFound()

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-sm text-center py-2">
        Vista previa · solo visible para administradores
      </div>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PostArticle post={post} locale={l} backHref="/admin/blog" />
      </main>
    </div>
  )
}
