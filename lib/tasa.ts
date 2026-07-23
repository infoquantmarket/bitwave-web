import { get } from "@vercel/edge-config"

// Fuente principal: par USDT/COP en vivo (Bitso, exchange regulado, endpoint público sin API key)
const BITSO_URL = "https://api.bitso.com/v3/ticker/?book=usdt_cop"
// Respaldo: dólar oficial de DolarApi Colombia (se actualiza pocas veces al día)
const DOLARAPI_URL = "https://co.dolarapi.com/v1/cotizaciones"
const DEFAULT_SPREAD = 150
const REVALIDATE = 1200 // 20 min en Next.js Data Cache

export interface Tasa {
  tasaFinal: number
  precioSpot: number
  spread: number
  fuente: "bitso" | "dolarapi"
}

async function getSpot(): Promise<{ spot: number; fuente: "bitso" | "dolarapi" } | null> {
  // Principal: Bitso USDT/COP en tiempo real
  try {
    const res = await fetch(BITSO_URL, { next: { revalidate: REVALIDATE } })
    if (res.ok) {
      const json = await res.json()
      const p = json?.payload
      const spot = Number(p?.last ?? p?.ask ?? p?.bid)
      if (Number.isFinite(spot) && spot > 0) return { spot, fuente: "bitso" }
    }
  } catch {
    // cae al respaldo
  }
  // Respaldo: DolarApi USD
  try {
    const res = await fetch(DOLARAPI_URL, { next: { revalidate: REVALIDATE } })
    if (res.ok) {
      const rates: Array<{ moneda: string; compra: number; venta: number }> = await res.json()
      const usd = rates.find((r) => r.moneda === "USD")
      const spot = usd?.venta ?? usd?.compra
      if (spot && spot > 0) return { spot, fuente: "dolarapi" }
    }
  } catch {
    // sin fuentes disponibles
  }
  return null
}

export async function getTasa(): Promise<Tasa | null> {
  const [spotData, spread] = await Promise.all([
    getSpot(),
    get<number>("spread_trm").catch(() => DEFAULT_SPREAD),
  ])
  if (!spotData) return null

  const spreadValue = spread ?? DEFAULT_SPREAD
  return {
    tasaFinal: Math.round(spotData.spot - spreadValue),
    precioSpot: Math.round(spotData.spot),
    spread: spreadValue,
    fuente: spotData.fuente,
  }
}
