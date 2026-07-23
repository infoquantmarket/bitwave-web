import { NextResponse } from "next/server"
import { get } from "@vercel/edge-config"

const SPOT_URL = "https://co.dolarapi.com/v1/cotizaciones/spot"
const DEFAULT_SPREAD = 150

export async function GET() {
  try {
    const [spotRes, spread] = await Promise.all([
      fetch(SPOT_URL, { next: { revalidate: 1200 } }), // Cache 20 min in Next.js Data Cache
      get<number>("spread_trm").catch(() => DEFAULT_SPREAD),
    ])

    if (!spotRes.ok) {
      throw new Error(`DolarApi respondió con status ${spotRes.status}`)
    }

    const spot = await spotRes.json()
    // DolarApi Colombia spot: { compra, venta, nombre, fechaActualizacion }
    const precioSpot: number = spot.venta ?? spot.compra ?? spot.precio

    if (!precioSpot || isNaN(precioSpot)) {
      throw new Error("Precio spot inválido en la respuesta")
    }

    const spreadValue = spread ?? DEFAULT_SPREAD
    // tasaFinal = lo que BitWave paga al cliente por cada USDT (COP)
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
