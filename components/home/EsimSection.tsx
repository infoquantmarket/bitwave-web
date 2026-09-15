import { getTranslations } from "next-intl/server"
import { Smartphone, ArrowRight, Globe2 } from "lucide-react"
import { siteConfig } from "@/lib/config"

export default async function EsimSection() {
  const t = await getTranslations("esim")

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="bg-brand-light rounded-2xl border border-gray-100 shadow-sm overflow-hidden md:flex md:items-center">
          <div className="p-8 md:p-10 md:flex-1">
            <span className="inline-flex items-center gap-1.5 bg-white text-brand-primary text-xs font-semibold px-3 py-1 rounded-full mb-4 shadow-sm">
              <Globe2 size={14} /> {t("badge")}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-text-title mb-3">{t("title")}</h2>
            <p className="text-text-body text-sm md:text-base leading-relaxed mb-6 max-w-xl">{t("desc")}</p>
            <a
              href={siteConfig.esimUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-accent hover:bg-brand-primary text-white font-bold px-6 py-3 rounded-lg transition-colors text-sm shadow-md"
            >
              {t("cta")} <ArrowRight size={16} />
            </a>
          </div>
          <div className="hidden md:flex md:flex-shrink-0 w-56 self-stretch items-center justify-center bg-brand-primary/5 p-10">
            <div className="w-28 h-28 rounded-3xl bg-white shadow-md flex items-center justify-center">
              <Smartphone size={48} className="text-brand-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
