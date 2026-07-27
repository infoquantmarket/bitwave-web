import { ImageResponse } from "next/og"
import { buildOgImage, OG_SIZE } from "@/lib/og-image"

export const alt = "BitWave — Cambia USDT y USDC por pesos colombianos"
export const size = OG_SIZE
export const contentType = "image/png"

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return new ImageResponse(await buildOgImage(locale), { ...size })
}
