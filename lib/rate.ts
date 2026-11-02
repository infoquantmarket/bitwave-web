/** Página de tasa: /tasa-de-compra (ES) y /en/usdt-cop-rate (EN). */
export function ratePath(locale: string): string {
  return locale === "en" ? "/en/usdt-cop-rate" : "/tasa-de-compra"
}

export type CostLevel = "low" | "mid" | "variable"

export const networks = [
  { id: "polygon", costLevel: "low" as CostLevel },
  { id: "solana", costLevel: "low" as CostLevel },
  { id: "ethereum", costLevel: "variable" as CostLevel },
  { id: "tron", costLevel: "mid" as CostLevel },
] as const

export type NetworkId = (typeof networks)[number]["id"]
