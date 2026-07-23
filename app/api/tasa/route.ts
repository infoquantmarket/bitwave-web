import { NextResponse } from "next/server"
import { get } from "@vercel/edge-config"

const RATES_URL = "https://co.dolarapi.com/v1/cotizaciones"
const DEFAULT_SPREAD = 150

export async function GET() {
  try {
    const [ratesRes, spread] = await Promise.all([
      fetch(RATES_URL, { next: { revalidate: 1200 } }), // Cache 20 min in Next.js Data Cache
      get<number>("spread_trm").catch(() => DEFAULT_SPREAD),
    ])

    if (!ratesRes.ok) {
      throw new Error(`DolarApi respondió con status ${ratesRes.status}`)
    }

    const rates: Array<{ moneda: string; compra: number; venta: number }> = await ratesRes.json()
    const usd = rates.find((r) => r.moneda === "USD")
    if (!usd) throw new Error("USD no encontrado en DolarApi")

    const precioSpot = usd.venta ?? usd.compra
    const spreadValue = spread ?? DEFAULT_SPREAD
    const tasaFinal = Math.round(precioSpot - spreadValue)

    return NextResponse.json({
      tasaFinal,
      precioSpot: Math.round(precioSpot),
      spread: spreadValue,
      actualizadoEn: new Date().toISOString(),
    })
  } catch (err) {
    console.error("[/api/tasa]", err)
    return NextResponse.json(
      { error: "No se pudo obtener la tasa en este momento" },
      { status: 500 }
    )
  }
}
