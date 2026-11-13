import Link from "next/link"
import { Plus } from "lucide-react"
import AdminShell from "@/components/admin/AdminShell"
import { requireAdmin } from "@/lib/admin-guard"
import { getAllPosts } from "@/lib/blog"
import { blobConfigured, getStoredIndex } from "@/lib/blog-store"
import { deletePost } from "./actions"

export const dynamic = "force-dynamic"

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>
}) {
  await requireAdmin()
  const params = await searchParams
  const configured = blobConfigured()
  const stored = (await getStoredIndex()).sort((a, b) => (b.date || b.updatedAt).localeCompare(a.date || a.updatedAt))
  const fileCount = (await getAllPosts("es")).filter((p) => p.source === "file").length + (await getAllPosts("en")).filter((p) => p.source === "file").length

  return (
    <AdminShell wide>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Blog</h1>
          <p className="text-sm text-gray-500 mt-1">
            Publica artículos desde aquí. Los {fileCount} artículos anteriores del sitio no se editan en el panel.
          </p>
        </div>
        <Link
          href="/admin/blog/editor"
          className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2.5 rounded-lg text-sm whitespace-nowrap"
        >
          <Plus size={16} /> Nuevo artículo
        </Link>
      </div>

      {!configured && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 text-sm rounded-xl px-5 py-4 mb-6">
          Falta conectar <strong>Vercel Blob</strong>: en Vercel → proyecto → Storage → Create → Blob (público) → conectar al
          proyecto, y luego Redeploy. Sin eso no se puede guardar.
        </div>
      )}
      {params.saved && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-xl px-5 py-3.5 mb-6">
          {params.saved === "published"
            ? "Artículo publicado. Ya aparece primero en el blog y se avisó a Bing/Yandex."
            : "Borrador guardado."}
        </div>
      )}
      {params.deleted && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-xl px-5 py-3.5 mb-6">
          Artículo eliminado.
        </div>
      )}
      {params.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-3.5 mb-6">
          No se pudo completar la operación.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
        {stored.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500">Aún no hay artículos publicados desde el panel.</p>
        ) : (
          stored.map((p) => {
            const pub = p.status === "published"
            const url = `${p.lang === "en" ? "/en" : ""}/blog/${p.slug}`
            return (
              <div key={`${p.lang}-${p.slug}`} className="p-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{p.title}</p>
                  <p className="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 font-semibold ${pub ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                    >
                      {pub ? "Publicado" : "Borrador"}
                    </span>
                    <span className="uppercase">{p.lang}</span>
                    <span className="font-mono">{url}</span>
                    {p.date && <span>{new Date(p.date).toLocaleDateString("es-CO")}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium flex-shrink-0">
                  {pub && (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-700">
                      Ver
                    </a>
                  )}
                  <Link href={`/admin/blog/preview?lang=${p.lang}&slug=${p.slug}`} className="text-gray-500 hover:text-green-700">
                    Vista previa
                  </Link>
                  <Link href={`/admin/blog/editor?lang=${p.lang}&slug=${p.slug}`} className="text-green-700 hover:text-green-800">
                    Editar
                  </Link>
                  <form action={deletePost}>
                    <input type="hidden" name="lang" value={p.lang} />
                    <input type="hidden" name="slug" value={p.slug} />
                    <button type="submit" className="text-red-600 hover:text-red-700">
                      Eliminar
                    </button>
                  </form>
                </div>
              </div>
            )
          })
        )}
      </div>
    </AdminShell>
  )
}
