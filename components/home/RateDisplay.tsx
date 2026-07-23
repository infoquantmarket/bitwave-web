import { getTranslations } from "next-intl/server"
import { getTasa } from "@/lib/tasa"

export default async function RateDisplay() {
  const [tasa, t] = await Promise.all([getTasa(), getTranslations("hero")])

  if (!tasa) return null

  return (
    <div className="inline-flex flex-col bg-brand-light border border-brand-accent/20 rounded-xl px-5 py-4 gap-1">
      <p className="text-xs font-semibold text-text-body uppercase tracking-wider">
        {t("rateLabel")}
      </p>
      <p className="text-3xl font-bold text-brand-primary tabular-nums">
        ${tasa.tasaFinal.toLocaleString("es-CO")}{" "}
        <span className="text-base font-semibold text-text-body">COP</span>
      </p>
      <p className="text-[10px] leading-snug text-text-body/50 flex items-start gap-1.5 mt-1 max-w-[260px]">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse flex-shrink-0 mt-0.5" />
        {t("rateDisclaimer")}
      </p>
    </div>
  )
}
