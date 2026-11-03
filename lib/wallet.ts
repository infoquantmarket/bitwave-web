/** Verificador de billeteras: /verificador-de-billetera (ES) y /en/wallet-checker (EN). */
export function walletPath(locale: string): string {
  return locale === "en" ? "/en/wallet-checker" : "/verificador-de-billetera"
}
