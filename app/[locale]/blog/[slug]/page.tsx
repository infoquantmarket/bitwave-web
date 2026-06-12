import { getAllPosts, getPostBySlug } from "@/lib/blog"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import { siteConfig } from "@/lib/config"

export async function generateStaticParams() {
  const esPosts = getAllPosts("es")
  const enPosts = getAllPosts("en")
  return [...esPosts, ...enPosts].map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords.join(", "),
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.date,
      images: [
        {
          url: `${siteConfig.siteUrl}${post.coverImage}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}

function renderMarkdown(content: string) {
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []
  let key = 0

  const parseInline = (text: string): React.ReactNode => {
    // Handle bold+italic combinations and simple bold/italic
    const parts = text.split(/(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith("***") && part.endsWith("***")) {
        return <strong key={i}><em>{part.slice(3, -3)}</em></strong>
      }
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} className="font-semibold text-text-title">{part.slice(2, -2)}</strong>
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
        return <em key={i}>{part.slice(1, -1)}</em>
      }
      return part
    })
  }

  let i = 0
  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="text-2xl font-bold text-text-title mt-8 mb-3">
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="text-xl font-semibold text-text-title mt-6 mb-2">
          {line.slice(4)}
        </h3>
      )
    } else if (line.startsWith("- ")) {
      // Collect consecutive list items
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={key++} className="list-disc list-inside space-y-1 mb-4 text-text-body">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">{parseInline(item)}</li>
          ))}
        </ul>
      )
      continue
    } else if (/^\d+\./.test(line)) {
      // Collect consecutive numbered list items
      const items: string[] = []
      while (i < lines.length && /^\d+\./.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s*/, ""))
        i++
      }
      elements.push(
        <ol key={key++} className="list-decimal list-inside space-y-1 mb-4 text-text-body">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">{parseInline(item)}</li>
          ))}
        </ol>
      )
      continue
    } else if (line.trim() === "") {
      // skip blank lines
    } else {
      elements.push(
        <p key={key++} className="text-text-body leading-relaxed mb-4">
          {parseInline(line)}
        </p>
      )
    }
    i++
  }

  return elements
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const backHref = locale === "en" ? "/en/blog" : "/blog"
  const backLabel = locale === "en" ? "Back to blog" : "Volver al blog"
  const readLabel = locale === "en" ? "read" : "lectura"

  const dateStr = new Date(post.date).toLocaleDateString(
    locale === "en" ? "en-US" : "es-CO",
    { year: "numeric", month: "long", day: "numeric" }
  )

  return (
    <main id="main-content" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-brand-accent hover:text-brand-primary mb-8 font-medium transition-colors"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        {backLabel}
      </Link>

      <h1 className="text-3xl sm:text-4xl font-bold text-text-title leading-tight mb-4">
        {post.title}
      </h1>

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
          alt={post.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>

      <article className="prose-custom">
        {renderMarkdown(post.content)}
      </article>
    </main>
  )
}
