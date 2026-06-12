import { getAllPosts, getPostBySlug } from "@/lib/blog"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import { siteConfig } from "@/lib/config"
import { MDXRemote } from "next-mdx-remote/rsc"

export async function generateStaticParams() {
  const esPosts = getAllPosts("es")
  const enPosts = getAllPosts("en")
  return [
    ...esPosts.map((p) => ({ locale: "es", slug: p.slug })),
    ...enPosts.map((p) => ({ locale: "en", slug: p.slug })),
  ]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const post = getPostBySlug(slug, locale as "es" | "en")
  if (!post) return {}
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords.join(", "),
    alternates: {
      canonical: `${siteConfig.siteUrl}${locale === "en" ? "/en" : ""}/blog/${post.slug}`,
    },
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const post = getPostBySlug(slug, locale as "es" | "en")
  if (!post) notFound()

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    image: `${siteConfig.siteUrl}${post.coverImage}`,
    datePublished: post.date,
    author: { "@type": "Organization", name: "BitWave", url: siteConfig.siteUrl },
    publisher: { "@type": "Organization", name: "BitWave", logo: { "@type": "ImageObject", url: `${siteConfig.siteUrl}/logo.png` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteConfig.siteUrl}${locale === "en" ? "/en" : ""}/blog/${post.slug}` },
  }

  const backHref = locale === "en" ? "/en/blog" : "/blog"
  const backLabel = locale === "en" ? "Back to blog" : "Volver al blog"
  const readLabel = locale === "en" ? "read" : "lectura"

  const dateStr = new Date(post.date).toLocaleDateString(
    locale === "en" ? "en-US" : "es-CO",
    { year: "numeric", month: "long", day: "numeric" }
  )

  return (
    <main id="main-content" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
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

      <article className="space-y-4">
        <MDXRemote source={post.content} />
      </article>
    </main>
  )
}
