import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { ratePath } from "@/lib/rate"
import RatePage, { buildRateMetadata } from "@/components/rate/RatePage"

// Ruta en español: /tasa-de-compra. En inglés la ruta es /en/usdt-cop-rate.
export function generateStaticParams() {
  return [{ locale: "es" }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (locale !== "es") return {}
  return buildRateMetadata("es")
}

export default async function TasaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== "es") redirect(ratePath("en"))
  return <RatePage locale="es" />
}
