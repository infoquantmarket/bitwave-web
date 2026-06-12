import { getAllPosts } from "@/lib/blog"
import PostCard from "@/components/blog/PostCard"
import { getTranslations } from "next-intl/server"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEN = locale === "en"
  return {
    title: isEN ? "Blog | BitWave" : "Blog | BitWave",
    description: isEN
      ? "Articles about cryptocurrency, compliance and the Colombian market."
      : "Artículos sobre criptomonedas, cumplimiento y el mercado colombiano.",
    alternates: {
      canonical: isEN ? "https://www.bitwaveco.com/en/blog" : "https://www.bitwaveco.com/blog",
    },
  }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const posts = getAllPosts(locale as "es" | "en")
  const t = await getTranslations("blog")

  return (
    <main id="main-content">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-title">{t("title")}</h1>
          <p className="mt-3 text-text-body">{t("subtitle")}</p>
        </div>
        {posts.length === 0 ? (
          <p className="text-center text-text-body">Próximamente...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
