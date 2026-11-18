import Image from "next/image"
import { getLocale } from "next-intl/server"
import { ArrowRight } from "lucide-react"
import PartnerLink from "@/components/ui/PartnerLink"
import { NUTIFINANZAS_REL, NUTIFINANZAS_URL, nutifinanzasBanner } from "@/lib/partners"

/** Banner de un tercero (Nutifinanzas). Solo va en el home: no en el cotizador, las tasas ni los datos estructurados. */
export default async function PartnerBanner() {
  const locale = await getLocale()
  const c = nutifinanzasBanner[locale === "en" ? "en" : "es"]

  return (
    <section
      aria-labelledby="partner-banner-title"
      className="bg-brand-light px-4 sm:px-6 lg:px-8 py-10 sm:py-12 border-b border-[#cfe2d6]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[auto_minmax(0,1fr)_auto] gap-x-8 gap-y-5 items-center rounded-2xl border border-[#cfe2d6] bg-white p-5 sm:p-7 shadow-[0_10px_30px_-18px_rgba(26,74,46,0.45)]">
          <Image
            src="/images/partners/nutifinanzas.png"
            alt={c.logoAlt}
            width={640}
            height={178}
            className="h-12 sm:h-14 w-auto justify-self-start"
          />
          <div>
            <span className="inline-block rounded-full border border-[#bfdccb] bg-brand-light px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-primary">
              {c.label}
            </span>
            <h2 id="partner-banner-title" className="mt-2.5 text-xl sm:text-[22px] font-bold leading-snug text-text-title">
              {c.title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-text-body max-w-[62ch]">{c.support}</p>
          </div>
          <PartnerLink
            href={NUTIFINANZAS_URL}
            rel={NUTIFINANZAS_REL}
            className="inline-flex w-full md:w-auto items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-brand-primary px-6 py-3 font-bold text-white transition-all hover:bg-brand-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 active:scale-[0.98] motion-reduce:transition-none"
          >
            {c.button}
            <ArrowRight size={18} aria-hidden="true" />
            <span className="sr-only">{c.newTab}</span>
          </PartnerLink>
          <p className="md:col-span-3 border-t border-[#d3e3d9] pt-4 text-[11.5px] leading-relaxed text-gray-600">{c.legal}</p>
        </div>
      </div>
    </section>
  )
}
