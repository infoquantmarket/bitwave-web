import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import LocationPage, { buildLocationMetadata } from "@/components/locations/LocationPage"
import { getLocation, locationPath, locations } from "@/lib/locations"

// Ruta en español: /sedes/[id]. En inglés la ruta es /en/locations/[id].
export function generateStaticParams() {
  return locations.map((l) => ({ locale: "es", id: l.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params
  if (locale !== "es" || !getLocation(id)) return {}
  return buildLocationMetadata(id, "es")
}

export default async function SedePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  if (!getLocation(id)) notFound()
  // Visitante con idioma EN (cookie) que llega a la ruta en español: lo llevamos a la suya.
  if (locale !== "es") redirect(locationPath(id, "en"))
  return <LocationPage id={id} locale="es" />
}
