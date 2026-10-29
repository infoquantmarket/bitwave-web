import { notFound } from "next/navigation"
import type { Metadata } from "next"
import LocationPage, { buildLocationMetadata } from "@/components/locations/LocationPage"
import { getLocation, locations } from "@/lib/locations"

// Ruta en inglés: /en/locations/[id]. En español la ruta es /sedes/[id].
export function generateStaticParams() {
  return locations.map((l) => ({ locale: "en", id: l.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params
  if (locale !== "en" || !getLocation(id)) return {}
  return buildLocationMetadata(id, "en")
}

export default async function LocationEnPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  if (locale !== "en" || !getLocation(id)) notFound()
  return <LocationPage id={id} locale="en" />
}
