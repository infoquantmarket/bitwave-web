export const siteConfig = {
  whatsappNumber: "+573XXXXXXXXX",
  whatsappMessage: "Hola, quiero cotizar mi cambio de USDT",
  email: "info@bitwaveco.com",
  siteUrl: "https://www.bitwaveco.com",
  companyName: "BitWave S.A.S.",
  nit: "XXX.XXX.XXX-X",
}

export function getWhatsAppUrl(message?: string) {
  const msg = encodeURIComponent(message ?? siteConfig.whatsappMessage)
  return `https://wa.me/${siteConfig.whatsappNumber.replace(/\+/g, "")}?text=${msg}`
}
