import { getAllPosts } from "@/lib/blog"
import PostCard from "@/components/blog/PostCard"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

interface BlogCarouselProps {
  locale: string
}

export default async function BlogCarousel({ locale }: BlogCarouselProps) {
  const t = await getTranslations("blog")
  const lang = (locale === "en" ? "en" : "es") as "es" | "en"
  const posts = getAllPosts(lang).slice(0, 3)
  const blogHref = locale === "en" ? "/en/blog" : "/blog"

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-light">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-text-title">{t("title")}</h2>
            <p className="mt-2 text-text-body">{t("subtitle")}</p>
          </div>
          <Link
            href={blogHref}
            className="text-sm font-semibold text-brand-accent hover:text-brand-primary transition-colors"
          >
            {t("viewAll")} →
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-text-body py-8">{t("comingSoon")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
