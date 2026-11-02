import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getLocale, getTranslations } from "next-intl/server"
import { getTasa } from "@/lib/tasa"
import { ratePath } from "@/lib/rate"

export default async function RateDisplay() {
  const [tasa, t, locale] = await Promise.all([getTasa(), getTranslations("hero"), getLocale()])

  if (!tasa) return null

  return (
    <Link
      href={ratePath(locale)}
      className="group inline-flex flex-col bg-brand-light border border-brand-accent/20 rounded-xl px-5 py-4 gap-1 transition-all hover:border-brand-accent/50 hover:shadow-md active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
    >
      <p className="text-xs font-semibold text-text-body uppercase tracking-wider">
        {t("rateLabel")}
      </p>
      <p className="text-3xl font-bold text-brand-primary tabular-nums">
        ${tasa.tasaFinal.toLocaleString(locale === "en" ? "en-US" : "es-CO")}{" "}
        <span className="text-base font-semibold text-text-body">COP</span>
      </p>
      <p className="text-[10px] leading-snug text-text-body/50 flex items-start gap-1.5 mt-1 max-w-[260px]">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse flex-shrink-0 mt-0.5" />
        {t("rateDisclaimer")}
      </p>
      <span className="mt-2 inline-flex items-center gap-1.5 border-t border-brand-accent/15 pt-2 text-sm font-semibold text-brand-accent group-hover:text-brand-primary transition-colors">
        {t("rateMore")}
        <ArrowRight size={14} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}
