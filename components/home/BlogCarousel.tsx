import { getTranslations } from "next-intl/server"
import Link from "next/link"

export default async function BlogCarousel() {
  const t = await getTranslations("blog")

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-light">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-text-title">{t("title")}</h2>
            <p className="mt-2 text-text-body">{t("subtitle")}</p>
          </div>
          <Link
            href="/blog"
            className="text-sm font-semibold text-brand-accent hover:text-brand-primary transition-colors"
          >
            {t("viewAll")} →
          </Link>
        </div>

        {/* Placeholders hasta que se implemente el blog en Fase 3 */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          aria-busy="true"
          aria-label={t("loading")}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
            >
              <div className="h-48 bg-brand-light animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                <div className="h-5 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 bg-gray-100 rounded animate-pulse w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
