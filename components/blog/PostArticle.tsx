import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import { useMDXComponents } from "@/mdx-components"
import type { Post } from "@/lib/blog"

/** Cuerpo del post (título, fecha, portada y contenido). Lo usan la página pública y la vista previa del admin. */
export default function PostArticle({ post, locale, backHref }: { post: Post; locale: string; backHref?: string }) {
  const back = backHref ?? (locale === "en" ? "/en/blog" : "/blog")
  const backLabel = locale === "en" ? "Back to blog" : "Volver al blog"
  const readLabel = locale === "en" ? "read" : "lectura"
  const dateStr = new Date(post.date).toLocaleDateString(locale === "en" ? "en-US" : "es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <>
      <Link
        href={back}
        className="inline-flex items-center gap-1.5 text-sm text-brand-accent hover:text-brand-primary mb-8 font-medium transition-colors"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        {backLabel}
      </Link>

      <h1 className="text-3xl sm:text-4xl font-bold text-text-title leading-tight mb-4">{post.title}</h1>

      <div className="flex items-center gap-4 text-sm text-text-body mb-8">
        <span className="flex items-center gap-1.5">
          <Calendar size={14} aria-hidden="true" />
          <time dateTime={post.date}>{dateStr}</time>
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={14} aria-hidden="true" />
          {post.readTime} {readLabel}
        </span>
      </div>

      <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-10 bg-brand-light">
        <Image
          src={post.coverImage}
          alt={post.coverAlt || post.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>

      <article className="space-y-4">
        {post.source === "admin" ? (
          // Posts del panel: Markdown plano (sin JSX/expresiones), para que un símbolo suelto no rompa la página.
          <MDXRemote
            source={post.content}
            components={useMDXComponents({})}
            options={{ mdxOptions: { format: "md", remarkPlugins: [remarkGfm] } }}
          />
        ) : (
          <MDXRemote source={post.content} />
        )}
      </article>
    </>
  )
}
