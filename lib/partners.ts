// Aliados de terceros mostrados en el sitio. Nutifinanzas es una empresa INDEPENDIENTE de BitWave
// (otros socios, otra razón social): nunca debe parecer un servicio de BitWave. Edita los textos aquí.

export const NUTIFINANZAS_URL =
  "https://nutifinanzas.com/?utm_source=bitwave&utm_medium=referral&utm_campaign=aliado-nutifinanzas&utm_content=home"

/**
 * DECISIÓN DE NEGOCIO PENDIENTE: si BitWave recibe comisión o pago por derivar clientes a Nutifinanzas,
 * cambiar a "noopener sponsored". Si no hay compensación, "noopener" es correcto.
 */
export const NUTIFINANZAS_REL = "noopener"

export interface PartnerBannerCopy {
  label: string
  title: string
  support: string
  button: string
  logoAlt: string
  newTab: string
  legal: string
}

export const nutifinanzasBanner: Record<"es" | "en", PartnerBannerCopy> = {
  es: {
    label: "Servicio de un tercero",
    title: "¿Necesitas dólares, euros u otras divisas en efectivo? Cámbialas con Nutifinanzas",
    support:
      "Nutifinanzas es una empresa independiente de BitWave: presta y gestiona este servicio por su cuenta. Compra y vende 15 divisas en billete en Medellín y Envigado.",
    button: "Ir a Nutifinanzas",
    logoAlt: "Nutifinanzas Money Exchange",
    newTab: "(se abre en otra pestaña)",
    // PENDIENTE_LEGAL: este aviso debe revisarlo el abogado o el oficial de cumplimiento de BitWave antes de publicar.
    legal:
      "Servicio prestado por Nutifinanzas, empresa independiente de BitWave. BitWave no presta el servicio de compra y venta de divisas en efectivo ni responde por él. Las tasas de Nutifinanzas están sujetas a cambios sin previo aviso; consúltalas en nutifinanzas.com.",
  },
  en: {
    label: "Third-party service",
    title: "Need dollars, euros or other foreign currency in cash? Exchange it with Nutifinanzas",
    support:
      "Nutifinanzas is a company independent of BitWave: it provides and manages this service on its own. It buys and sells 15 currencies in banknotes in Medellín and Envigado.",
    button: "Go to Nutifinanzas",
    logoAlt: "Nutifinanzas Money Exchange",
    newTab: "(opens in a new tab)",
    // PENDIENTE_LEGAL: traducción del aviso en español; también debe revisarla el abogado o el oficial de cumplimiento.
    legal:
      "Service provided by Nutifinanzas, a company independent of BitWave. BitWave does not provide the cash currency buying and selling service and is not responsible for it. Nutifinanzas rates are subject to change without notice; check them at nutifinanzas.com.",
  },
}

/** Evento de medición del clic (Vercel Analytics). */
export const PARTNER_CLICK_EVENT = { name: "clic_aliado", props: { aliado: "nutifinanzas", ubicacion: "home" } } as const
