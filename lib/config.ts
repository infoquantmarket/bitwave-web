export const siteConfig = {
  whatsappNumber: "+573192454560",
  whatsappMessage: "Hola vengo de tu página necesito más información",
  email: "info@bitwaveco.com",
  siteUrl: "https://www.bitwaveco.com",
  companyName: "BitWave S.A.S.",
  nit: "901.920.120-1",
  zabioUrl: "https://www.zabio.xyz/i/bitwave",
}

export function getWhatsAppUrl(message?: string) {
  const msg = encodeURIComponent(message ?? siteConfig.whatsappMessage)
  return `https://wa.me/${siteConfig.whatsappNumber.replace(/\+/g, "")}?text=${msg}`
}
