export type Locale = "es" | "en"
export type Localized = Record<Locale, string>

export interface Location {
  id: string
  name: string
  shortName: string
  local: Localized
  address: string
  city: string
  zone: Localized
  zoneTitle: Localized
  intro: Localized
  mapsUrl: string
  embedUrl: string
  hours: Localized
  openingHours: string[]
  image?: string
}

export const locations: Location[] = [
  {
    id: "oviedo",
    name: "Centro Comercial Oviedo",
    shortName: "Oviedo",
    local: {
      es: "Local 158 (dentro de las oficinas de NUTIFINANZAS)",
      en: "Local 158 (inside the NUTIFINANZAS offices)",
    },
    address: "Cra. 43A #6 Sur-15, El Poblado",
    city: "Medellín",
    zone: { es: "El Poblado, Medellín", en: "El Poblado, Medellín" },
    zoneTitle: { es: "El Poblado, Medellín", en: "El Poblado, Medellín" },
    intro: {
      es: "Esta sede queda en el Centro Comercial Oviedo, en El Poblado, una de las zonas más visitadas por turistas y nómadas digitales en Medellín.",
      en: "This location is in Centro Comercial Oviedo, in El Poblado, one of the areas of Medellín most visited by tourists and digital nomads.",
    },
    mapsUrl: "https://maps.google.com/?q=Centro+Comercial+Oviedo+Medellin",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521298893093!2d-75.56880492426644!3d6.208706927357158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4429e22c51d58d%3A0x1a31b1d52f37b1d5!2sCentro%20Comercial%20Oviedo!5e0!3m2!1ses!2sco!4v1",
    hours: {
      es: "Lun–Vie 8am–7pm · Sáb 9am–4pm · Dom y festivos cerrado",
      en: "Mon–Fri 8am–7pm · Sat 9am–4pm · Sun & holidays closed",
    },
    openingHours: ["Mo-Fr 08:00-19:00", "Sa 09:00-16:00"],
    image: "/images/sede-oviedo.jpg",
  },
  {
    id: "coltejer",
    name: "Edificio Coltejer",
    shortName: "Coltejer",
    local: {
      es: "Local 203 (dentro de las oficinas de NUTIFINANZAS)",
      en: "Local 203 (inside the NUTIFINANZAS offices)",
    },
    address: "Cl. 52 #47-42, Centro",
    city: "Medellín",
    zone: { es: "el Centro de Medellín", en: "Downtown Medellín" },
    zoneTitle: { es: "el Centro de Medellín", en: "Downtown Medellín" },
    intro: {
      es: "Esta sede queda en el Edificio Coltejer, en el Centro de Medellín.",
      en: "This location is in the Coltejer Building, in downtown Medellín.",
    },
    mapsUrl: "https://maps.google.com/?q=Edificio+Coltejer+Medellin",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0!2d-75.5674!3d6.2518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4429c7a16b0001%3A0x1!2sEdificio%20Coltejer!5e0!3m2!1ses!2sco!4v1",
    hours: {
      es: "Lun–Vie 8am–5pm · Sáb 9am–1pm · Dom y festivos cerrado",
      en: "Mon–Fri 8am–5pm · Sat 9am–1pm · Sun & holidays closed",
    },
    openingHours: ["Mo-Fr 08:00-17:00", "Sa 09:00-13:00"],
    image: "/images/sede-coltejer.jpg",
  },
  {
    id: "viva-envigado",
    name: "Centro Comercial Viva Envigado",
    shortName: "Viva Envigado",
    local: {
      es: "Local 203Z (dentro de las oficinas de NUTIFINANZAS)",
      en: "Local 203Z (inside the NUTIFINANZAS offices)",
    },
    address: "Cra. 48 #32B Sur-139",
    city: "Envigado",
    zone: { es: "Envigado", en: "Envigado" },
    zoneTitle: { es: "Envigado", en: "Envigado" },
    intro: {
      es: "Esta sede queda en el Centro Comercial Viva Envigado, en Envigado, al sur de Medellín.",
      en: "This location is in Centro Comercial Viva Envigado, in Envigado, south of Medellín.",
    },
    mapsUrl: "https://maps.google.com/?q=Centro+Comercial+Viva+Envigado",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0!2d-75.5920!3d6.1625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e468281e29a3b15%3A0x1!2sCentro%20Comercial%20Viva%20Envigado!5e0!3m2!1ses!2sco!4v1",
    hours: {
      es: "Lun–Vie 8am–7pm · Sáb 9am–4pm · Dom y festivos cerrado",
      en: "Mon–Fri 8am–7pm · Sat 9am–4pm · Sun & holidays closed",
    },
    openingHours: ["Mo-Fr 08:00-19:00", "Sa 09:00-16:00"],
    image: "/images/sede-viva-envigado.jpg",
  },
]

export function getLocation(id: string): Location | undefined {
  return locations.find((l) => l.id === id)
}

/** Path de la página de la sede, con prefijo de idioma (ES sin prefijo). */
export function locationPath(id: string, locale: string): string {
  return locale === "en" ? `/en/locations/${id}` : `/sedes/${id}`
}
