import { Suspense } from "react"
import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { getWhatsAppUrl, siteConfig } from "@/lib/config"
import { ArrowRight, MessageCircle, MapPin } from "lucide-react"
import RateDisplay from "./RateDisplay"
import RateSkeleton from "./RateSkeleton"

export default async function HeroSection() {
  const t = await getTranslations("hero")

  return (
    <section className="bg-white pt-12 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-title leading-tight text-center lg:text-left">
            {t("title")}
          </h1>
          <p className="mt-6 text-lg text-text-body leading-relaxed max-w-xl text-center lg:text-left">
            {t("subtitle")}
          </p>

          {/* Live rate ticker */}
          <div className="mt-7 flex justify-center lg:justify-start">
            <Suspense fallback={<RateSkeleton />}>
              <RateDisplay />
            </Suspense>
          </div>

          {/* CTAs */}
          <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
            <a
              href={siteConfig.zabioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-primary text-white font-bold px-6 py-3.5 rounded-lg transition-colors text-base shadow-md"
            >
              {t("ctaFreeze")}
              <ArrowRight size={18} />
            </a>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 border-brand-primary text-brand-primary hover:bg-brand-light font-semibold px-6 py-3.5 rounded-lg transition-colors text-base"
            >
              <MessageCircle size={18} />
              {t("ctaPrimary")}
            </a>
            <a
              href="#ubicaciones"
              className="inline-flex items-center justify-center gap-2 text-text-body hover:text-brand-primary font-medium px-4 py-3.5 transition-colors text-sm"
            >
              <MapPin size={16} />
              {t("ctaSecondary")}
            </a>
          </div>

          {/* Coins aceptados */}
          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 justify-center lg:justify-start">
            <span className="text-sm font-medium text-text-body/70">{t("coinsLabel")}</span>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-2">
                <Image src="/usdt.svg" alt="USDT" width={28} height={28} className="h-7 w-7" />
                <span className="text-sm font-semibold text-text-title">USDT</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <Image src="/usdc.svg" alt="USDC" width={28} height={28} className="h-7 w-7" />
                <span className="text-sm font-semibold text-text-title">USDC</span>
              </span>
            </div>
            <span className="text-xs text-text-body/50 basis-full lg:basis-auto text-center lg:text-left">
              {t("coinsNetworks")}
            </span>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end order-first lg:order-last">
          <div className="relative w-full lg:max-w-lg aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-brand-light">
            <Image
              src="/images/hero.png"
              alt="Persona realizando un cambio de USDT en Medellín"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
