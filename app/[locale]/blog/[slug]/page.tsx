import { absoluteImage, getAllPosts, getPostBySlug } from "@/lib/blog"
import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import { siteConfig } from "@/lib/config"
import PostArticle from "@/components/blog/PostArticle"

export async function generateStaticParams() {
  const esPosts = await getAllPosts("es")
  const enPosts = await getAllPosts("en")
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
  const post = await getPostBySlug(slug, locale as "es" | "en")
  if (!post) return {}
  const prefix = (l: string) => (l === "en" ? "/en" : "")
  const self = `${siteConfig.siteUrl}${prefix(locale)}/blog/${post.slug}`
  const otherLocale = locale === "en" ? "es" : "en"
  const languages: Record<string, string> = { [locale]: self }
  if (post.alternate) {
    languages[otherLocale] = `${siteConfig.siteUrl}${prefix(otherLocale)}/blog/${post.alternate}`
    languages["x-default"] = locale === "es" ? self : languages[otherLocale]
  } else {
    languages["x-default"] = self
  }
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords.join(", "),
    alternates: { canonical: self, languages },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: self,
      locale: locale === "en" ? "en_US" : "es_CO",
      type: "article",
      publishedTime: post.date,
      images: [
        {
          url: absoluteImage(post.coverImage),
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
  const post = await getPostBySlug(slug, locale as "es" | "en")
  if (!post) {
    // El post existe en el otro idioma (p. ej. cookie de idioma distinto): llevamos al equivalente o al blog.
    const other = await getPostBySlug(slug, locale === "en" ? "es" : "en")
    if (!other) notFound()
    const pre = locale === "en" ? "/en" : ""
    redirect(other.alternate ? `${pre}/blog/${other.alternate}` : `${pre}/blog`)
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    image: absoluteImage(post.coverImage),
    datePublished: post.date,
    author: { "@type": "Organization", name: "BitWave", url: siteConfig.siteUrl },
    publisher: { "@type": "Organization", name: "BitWave", logo: { "@type": "ImageObject", url: `${siteConfig.siteUrl}/logo.png` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteConfig.siteUrl}${locale === "en" ? "/en" : ""}/blog/${post.slug}` },
  }

  const faqSchema =
    post.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null

  const backHref = locale === "en" ? "/en/blog" : "/blog"
  const backLabel = locale === "en" ? "Back to blog" : "Volver al blog"
  const readLabel = locale === "en" ? "read" : "lectura"

  const dateStr = new Date(post.date).toLocaleDateString(
    locale === "en" ? "en-US" : "es-CO",
    { year: "numeric", month: "long", day: "numeric" }
  )

  return (
    <main id="main-content" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema ? [articleSchema, faqSchema] : articleSchema),
        }}
      />
      <PostArticle post={post} locale={locale} />
    </main>
  )
}
