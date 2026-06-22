export interface Location {
  id: string
  name: string
  local: string
  address: string
  city: string
  mapsUrl: string
  embedUrl: string
  hours: string
  image?: string
}

export const locations: Location[] = [
  {
    id: "oviedo",
    name: "Centro Comercial Oviedo",
    local: "Local 158 (dentro de las oficinas de NUTIFINANZAS)",
    address: "Cra. 43A #6 Sur-15, El Poblado",
    city: "Medellín",
    mapsUrl: "https://maps.google.com/?q=Centro+Comercial+Oviedo+Medellin",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521298893093!2d-75.56880492426644!3d6.208706927357158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4429e22c51d58d%3A0x1a31b1d52f37b1d5!2sCentro%20Comercial%20Oviedo!5e0!3m2!1ses!2sco!4v1",
    hours: "Lunes a sábado 10am – 7pm",
    image: "/images/sede-oviedo.jpg",
  },
  {
    id: "coltejer",
    name: "Edificio Coltejer",
    local: "Local 203 (dentro de las oficinas de NUTIFINANZAS)",
    address: "Cl. 52 #47-42, Centro",
    city: "Medellín",
    mapsUrl: "https://maps.google.com/?q=Edificio+Coltejer+Medellin",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0!2d-75.5674!3d6.2518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4429c7a16b0001%3A0x1!2sEdificio%20Coltejer!5e0!3m2!1ses!2sco!4v1",
    hours: "Lunes a viernes 9am – 6pm",
    image: "/images/sede-coltejer.jpg",
  },
  {
    id: "viva-envigado",
    name: "Centro Comercial Viva Envigado",
    local: "Local 203Z (dentro de las oficinas de NUTIFINANZAS)",
    address: "Cra. 48 #32B Sur-139",
    city: "Envigado",
    mapsUrl: "https://maps.google.com/?q=Centro+Comercial+Viva+Envigado",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0!2d-75.5920!3d6.1625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e468281e29a3b15%3A0x1!2sCentro%20Comercial%20Viva%20Envigado!5e0!3m2!1ses!2sco!4v1",
    hours: "Lunes a domingo 11am – 8pm",
    image: "/images/sede-viva-envigado.jpg",
  },
]
