import { get } from "@vercel/edge-config"
import { getTranslations } from "next-intl/server"

const RATES_URL = "https://co.dolarapi.com/v1/cotizaciones"
const DEFAULT_SPREAD = 150

async function getTasa(): Promise<{ tasaFinal: number; precioSpot: number; spread: number } | null> {
  try {
    const [ratesRes, spread] = await Promise.all([
      fetch(RATES_URL, { next: { revalidate: 1200 } }),
      get<number>("spread_trm").catch(() => DEFAULT_SPREAD),
    ])

    if (!ratesRes.ok) return null
    const rates: Array<{ moneda: string; compra: number; venta: number }> = await ratesRes.json()
    const usd = rates.find((r) => r.moneda === "USD")
    if (!usd) return null

    const precioSpot = usd.venta ?? usd.compra
    const spreadValue = spread ?? DEFAULT_SPREAD
    return {
      tasaFinal: Math.round(precioSpot - spreadValue),
      precioSpot: Math.round(precioSpot),
      spread: spreadValue,
    }
  } catch {
    return null
  }
}

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
