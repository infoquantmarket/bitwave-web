/** Página de tasa: /tasa-de-compra (ES) y /en/usdt-cop-rate (EN). */
export function ratePath(locale: string): string {
  return locale === "en" ? "/en/usdt-cop-rate" : "/tasa-de-compra"
}

export type CostLevel = "low" | "lowmid" | "high"

export const networks = [
  { id: "polygon", costLevel: "low" as CostLevel },
  { id: "solana", costLevel: "low" as CostLevel },
  { id: "tron", costLevel: "lowmid" as CostLevel },
  { id: "ethereum", costLevel: "high" as CostLevel },
] as const

export type NetworkId = (typeof networks)[number]["id"]
