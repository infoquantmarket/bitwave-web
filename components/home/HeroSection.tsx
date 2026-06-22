import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { getWhatsAppUrl } from "@/lib/config"
import { ArrowRight, MapPin } from "lucide-react"

export default async function HeroSection() {
  const t = await getTranslations("hero")

  return (
    <section className="bg-white pt-12 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-title leading-tight">
            {t("title")}
          </h1>
          <p className="mt-6 text-lg text-text-body leading-relaxed max-w-xl">
            {t("subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-accent hover:bg-brand-primary text-white font-semibold px-6 py-3 rounded-lg transition-colors text-base"
            >
              {t("ctaPrimary")}
              <ArrowRight size={18} />
            </a>
            <a
              href="#ubicaciones"
              className="inline-flex items-center gap-2 border-2 border-brand-primary text-brand-primary hover:bg-brand-light font-semibold px-6 py-3 rounded-lg transition-colors text-base"
            >
              <MapPin size={18} />
              {t("ctaSecondary")}
            </a>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end order-first lg:order-last">
          <div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-brand-light">
            <Image
              src="/images/hero.png"
              alt={t("title")}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
