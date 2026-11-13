"use client"
import { useActionState, useRef, useState } from "react"
import Link from "next/link"
import { Check, CircleAlert, ImagePlus, Loader2, Plus, Trash2 } from "lucide-react"
import { savePost, type SaveState } from "@/app/admin/blog/actions"

export interface EditorInitial {
  lang: "es" | "en"
  slug: string
  title: string
  excerpt: string
  coverImage: string
  coverAlt: string
  /** yyyy-mm-dd o "" */
  date: string
  author: string
  metaTitle: string
  metaDescription: string
  keywords: string
  faq: { q: string; a: string }[]
  alternate: string
  content: string
  status: "draft" | "published"
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

const input =
  "w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
const label = "block text-xs font-semibold text-gray-600 mb-1.5"
const card = "bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4"

function Counter({ value, min, max }: { value: number; min: number; max: number }) {
  const ok = value >= min && value <= max
  return <span className={`text-xs font-medium ${ok ? "text-green-700" : value === 0 ? "text-gray-400" : "text-amber-600"}`}>{value}/{max}</span>
}

export default function PostEditor({
  initial,
  original,
}: {
  initial: EditorInitial
  original: { lang: "es" | "en"; slug: string } | null
}) {
  const [state, formAction, pending] = useActionState<SaveState, FormData>(savePost, {})
  const [f, setF] = useState(initial)
  const slugTouched = useRef(!!original)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const set = <K extends keyof EditorInitial>(k: K, v: EditorInitial[K]) => setF((p) => ({ ...p, [k]: v }))

  async function onFile(file: File | undefined) {
    if (!file) return
    setUploading(true)
    setUploadError("")
    try {
      const body = new FormData()
      body.set("file", file)
      body.set("slug", f.slug || slugify(f.title))
      const res = await fetch("/admin/upload", { method: "POST", body })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !data.url) throw new Error(data.error || "No se pudo subir la imagen.")
      set("coverImage", data.url)
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "No se pudo subir la imagen.")
    } finally {
      setUploading(false)
    }
  }

  const words = f.content.trim() ? f.content.trim().split(/\s+/).length : 0
  const checks = [
    { ok: f.metaTitle.length >= 30 && f.metaTitle.length <= 60, text: "Título SEO de 30–60 caracteres" },
    { ok: f.metaDescription.length >= 120 && f.metaDescription.length <= 160, text: "Meta descripción de 120–160 caracteres" },
    { ok: !!f.slug && f.slug.length <= 70, text: "Slug corto y legible" },
    { ok: !!f.coverImage && !!f.coverAlt, text: "Portada con texto alternativo" },
    { ok: words >= 400, text: `Contenido de 400+ palabras (${words})` },
    { ok: /^##\s/m.test(f.content), text: "Al menos un subtítulo (## ...)" },
    { ok: f.keywords.split(",").some((k) => k.trim()), text: "Palabras clave definidas" },
  ]

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="originalLang" value={original?.lang ?? ""} />
      <input type="hidden" name="originalSlug" value={original?.slug ?? ""} />
      <input type="hidden" name="coverImage" value={f.coverImage} />
      <input type="hidden" name="faq" value={JSON.stringify(f.faq)} />

      {state.error && (
        <div role="alert" className="flex gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-3.5">
          <CircleAlert size={18} className="mt-0.5 flex-shrink-0" /> {state.error}
        </div>
      )}

      <section className={card}>
        <h2 className="text-base font-bold text-gray-800">Contenido</h2>
        <div>
          <label className={label} htmlFor="title">Título (H1)</label>
          <input
            id="title"
            name="title"
            required
            value={f.title}
            onChange={(e) => {
              set("title", e.target.value)
              if (!slugTouched.current) set("slug", slugify(e.target.value))
            }}
            className={input}
          />
        </div>
        <div>
          <label className={label} htmlFor="excerpt">Extracto (aparece en las tarjetas del blog)</label>
          <textarea id="excerpt" name="excerpt" rows={2} value={f.excerpt} onChange={(e) => set("excerpt", e.target.value)} className={input} />
        </div>
        <div>
          <label className={label} htmlFor="content">Artículo en Markdown</label>
          <textarea
            id="content"
            name="content"
            required
            rows={22}
            value={f.content}
            onChange={(e) => set("content", e.target.value)}
            placeholder={"Escribe aquí. Usa ## para subtítulos, ### para sub-subtítulos, **negrita**, - listas y [texto](https://enlace)."}
            className={`${input} font-mono leading-relaxed`}
          />
          <p className="text-xs text-gray-400 mt-1">{words} palabras. No repitas el título: ya se muestra como H1. Usa «Vista previa» tras guardar el borrador.</p>
        </div>
      </section>

      <section className={card}>
        <h2 className="text-base font-bold text-gray-800">Portada</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-56 aspect-[1.9/1] rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
            {f.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={f.coverImage} alt="" className="w-full h-full object-cover" />
            ) : (
              <ImagePlus className="text-gray-300" size={28} />
            )}
          </div>
          <div className="flex-1 space-y-3">
            <label className="inline-flex items-center gap-2 cursor-pointer border border-gray-200 bg-white hover:bg-gray-50 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700">
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
              {f.coverImage ? "Cambiar imagen" : "Subir imagen"}
              <input type="file" accept="image/*" className="sr-only" disabled={uploading} onChange={(e) => onFile(e.target.files?.[0])} />
            </label>
            <p className="text-xs text-gray-400">Recomendado 1200×630 (o similar, horizontal), hasta 4 MB. Se comprime a WebP automáticamente.</p>
            {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
            <div>
              <label className={label} htmlFor="coverAlt">Texto alternativo (describe la imagen)</label>
              <input id="coverAlt" name="coverAlt" value={f.coverAlt} onChange={(e) => set("coverAlt", e.target.value)} className={input} />
            </div>
          </div>
        </div>
      </section>

      <section className={card}>
        <h2 className="text-base font-bold text-gray-800">SEO</h2>
        <div>
          <label className={label} htmlFor="slug">Slug (URL)</label>
          <input
            id="slug"
            name="slug"
            required
            value={f.slug}
            onChange={(e) => {
              slugTouched.current = true
              set("slug", slugify(e.target.value))
            }}
            className={`${input} font-mono`}
          />
          <p className="text-xs text-gray-400 mt-1 font-mono break-all">
            bitwaveco.com{f.lang === "en" ? "/en" : ""}/blog/{f.slug || "…"}
          </p>
        </div>
        <div>
          <div className="flex justify-between">
            <label className={label} htmlFor="metaTitle">Título SEO (lo que se ve en Google)</label>
            <Counter value={f.metaTitle.length} min={30} max={60} />
          </div>
          <input id="metaTitle" name="metaTitle" value={f.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} placeholder={f.title} className={input} />
        </div>
        <div>
          <div className="flex justify-between">
            <label className={label} htmlFor="metaDescription">Meta descripción</label>
            <Counter value={f.metaDescription.length} min={120} max={160} />
          </div>
          <textarea id="metaDescription" name="metaDescription" rows={3} value={f.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} className={input} />
        </div>
        <div>
          <label className={label} htmlFor="keywords">Palabras clave (separadas por coma)</label>
          <input id="keywords" name="keywords" value={f.keywords} onChange={(e) => set("keywords", e.target.value)} className={input} />
        </div>

        <ul className="rounded-xl bg-gray-50 p-4 grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
          {checks.map((c) => (
            <li key={c.text} className={`flex items-center gap-2 ${c.ok ? "text-green-700" : "text-gray-500"}`}>
              {c.ok ? <Check size={14} /> : <CircleAlert size={14} className="text-amber-500" />}
              {c.text}
            </li>
          ))}
        </ul>
      </section>

      <section className={card}>
        <h2 className="text-base font-bold text-gray-800">Preguntas frecuentes (opcional)</h2>
        <p className="text-xs text-gray-400 -mt-2">Se muestran en el schema FAQPage del artículo, lo que ayuda a aparecer en resultados enriquecidos.</p>
        {f.faq.map((item, i) => (
          <div key={i} className="grid gap-2 rounded-xl border border-gray-100 p-3">
            <input
              aria-label={`Pregunta ${i + 1}`}
              placeholder="Pregunta"
              value={item.q}
              onChange={(e) => set("faq", f.faq.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))}
              className={input}
            />
            <textarea
              aria-label={`Respuesta ${i + 1}`}
              placeholder="Respuesta"
              rows={2}
              value={item.a}
              onChange={(e) => set("faq", f.faq.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))}
              className={input}
            />
            <button type="button" onClick={() => set("faq", f.faq.filter((_, j) => j !== i))} className="justify-self-end inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700">
              <Trash2 size={13} /> Quitar
            </button>
          </div>
        ))}
        <button type="button" onClick={() => set("faq", [...f.faq, { q: "", a: "" }])} className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 hover:text-green-800">
          <Plus size={15} /> Agregar pregunta
        </button>
      </section>

      <section className={card}>
        <h2 className="text-base font-bold text-gray-800">Publicación</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={label} htmlFor="lang">Idioma</label>
            <select id="lang" name="lang" value={f.lang} onChange={(e) => set("lang", e.target.value as "es" | "en")} className={input}>
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className={label} htmlFor="alternate">Slug del artículo equivalente en el otro idioma (opcional)</label>
            <input id="alternate" name="alternate" value={f.alternate} onChange={(e) => set("alternate", slugify(e.target.value))} className={`${input} font-mono`} />
          </div>
          <div>
            <label className={label} htmlFor="author">Autor</label>
            <input id="author" name="author" value={f.author} onChange={(e) => set("author", e.target.value)} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="date">Fecha de publicación</label>
            <input id="date" name="date" type="date" value={f.date} onChange={(e) => set("date", e.target.value)} className={input} />
            <p className="text-xs text-gray-400 mt-1">Vacía = fecha de hoy al publicar. El más reciente sale primero.</p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3 sticky bottom-0 bg-gray-50/90 backdrop-blur py-4">
        <button type="submit" name="status" value="published" disabled={pending || uploading} className="bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg text-sm">
          {pending ? "Guardando…" : f.status === "published" ? "Guardar y publicar" : "Publicar"}
        </button>
        <button type="submit" name="status" value="draft" disabled={pending || uploading} className="border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-60 text-gray-700 font-semibold px-6 py-2.5 rounded-lg text-sm">
          Guardar borrador
        </button>
        <Link href="/admin/blog" className="text-sm text-gray-500 hover:text-gray-700">Cancelar</Link>
      </div>
    </form>
  )
}
