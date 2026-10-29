export const siteConfig = {
  whatsappNumber: "+573192454560",
  whatsappMessage: "Hola vengo de tu página necesito más información",
  whatsappMessageEn: "Hi, I'm coming from your website and I need more information",
  email: "info@bitwaveco.com",
  siteUrl: "https://www.bitwaveco.com",
  companyName: "BitWave S.A.S.",
  nit: "901.920.120-1",
  zabioUrl: "https://www.zabio.xyz/i/bitwave",
  esimUrl: "https://esim.nutifinanzas.com",
}

export function getWhatsAppUrl(message?: string, locale?: string) {
  const fallback = locale === "en" ? siteConfig.whatsappMessageEn : siteConfig.whatsappMessage
  const msg = encodeURIComponent(message ?? fallback)
  return `https://wa.me/${siteConfig.whatsappNumber.replace(/\+/g, "")}?text=${msg}`
}
