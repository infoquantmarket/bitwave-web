import { NextResponse } from "next/server"
import { getTasa } from "@/lib/tasa"

export async function GET() {
  const tasa = await getTasa()

  if (!tasa) {
    return NextResponse.json(
      { error: "No se pudo obtener la tasa en este momento" },
      { status: 500 }
    )
  }

  return NextResponse.json({
    ...tasa,
    actualizadoEn: new Date().toISOString(),
  })
}
