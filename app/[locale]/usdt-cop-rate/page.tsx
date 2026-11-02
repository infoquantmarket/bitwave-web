import { notFound } from "next/navigation"
import type { Metadata } from "next"
import RatePage, { buildRateMetadata } from "@/components/rate/RatePage"

// Ruta en inglés: /en/usdt-cop-rate. En español la ruta es /tasa-de-compra.
export function generateStaticParams() {
  return [{ locale: "en" }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (locale !== "en") return {}
  return buildRateMetadata("en")
}

export default async function RateEnPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== "en") notFound()
  return <RatePage locale="en" />
}
