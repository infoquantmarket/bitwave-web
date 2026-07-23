import { get } from "@vercel/edge-config"
import { getTranslations } from "next-intl/server"

const SPOT_URL = "https://co.dolarapi.com/v1/cotizaciones/spot"
const DEFAULT_SPREAD = 150

async function getTasa(): Promise<{ tasaFinal: number; precioSpot: number; spread: number } | null> {
  try {
    const [spotRes, spread] = await Promise.all([
      fetch(SPOT_URL, { next: { revalidate: 1200 } }),
      get<number>("spread_trm").catch(() => DEFAULT_SPREAD),
    ])

    if (!spotRes.ok) return null
    const spot = await spotRes.json()
    const precioSpot: number = spot.venta ?? spot.compra ?? spot.precio
    if (!precioSpot || isNaN(precioSpot)) return null

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
    <div className="inline-flex flex-col bg-brand-light border border-brand-accent/20 rounded-xl px-5 py-4 gap-0.5">
      <p className="text-xs font-semibold text-text-body uppercase tracking-wider">
        {t("rateLabel")}
      </p>
      <p className="text-3xl font-bold text-brand-primary tabular-nums">
        ${tasa.tasaFinal.toLocaleString("es-CO")}{" "}
        <span className="text-base font-semibold text-text-body">COP</span>
      </p>
      <p className="text-xs text-text-body/60 flex items-center gap-1.5 mt-0.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        {t("rateDisclaimer")}
      </p>
    </div>
  )
}
