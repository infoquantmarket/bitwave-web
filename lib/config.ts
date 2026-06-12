export const siteConfig = {
  // TODO: reemplazar con el número real antes del deploy a producción
  whatsappNumber: "+573XXXXXXXXX",
  whatsappMessage: "Hola, quiero cotizar mi cambio de USDT",
  email: "info@bitwaveco.com",
  siteUrl: "https://www.bitwaveco.com",
  companyName: "BitWave S.A.S.",
  nit: "901.920.120-1",
}

export function getWhatsAppUrl(message?: string) {
  const msg = encodeURIComponent(message ?? siteConfig.whatsappMessage)
  return `https://wa.me/${siteConfig.whatsappNumber.replace(/\+/g, "")}?text=${msg}`
}
