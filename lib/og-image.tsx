import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const OG_SIZE = { width: 1200, height: 630 }

const COPY = {
  es: {
    headline: "Cambia USDT y USDC por pesos colombianos",
    subline: "Efectivo o transferencia · KYC legal · Medellín y Envigado",
  },
  en: {
    headline: "Exchange USDT and USDC for Colombian pesos",
    subline: "Cash or bank transfer · Legal KYC · Medellín & Envigado",
  },
} as const

let logoDataUri: string | null = null
async function getLogoDataUri() {
  if (!logoDataUri) {
    const buf = await readFile(join(process.cwd(), "public/logo_bl.png"))
    logoDataUri = `data:image/png;base64,${buf.toString("base64")}`
  }
  return logoDataUri
}

export async function buildOgImage(locale: string) {
  const copy = locale === "en" ? COPY.en : COPY.es
  const logo = await getLogoDataUri()

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "linear-gradient(135deg, #1a4a2e 0%, #0f2f1c 100%)",
        fontFamily: "sans-serif",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} alt="BitWave" width={260} height={72} style={{ objectFit: "contain" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 980 }}>
        <div
          style={{
            fontSize: 58,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          {copy.headline}
        </div>
        <div style={{ fontSize: 26, fontWeight: 500, color: "#c9e6d4" }}>{copy.subline}</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: "#8fbfa2" }}>www.bitwaveco.com</div>
        <div style={{ display: "flex", gap: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 999,
              padding: "10px 20px",
              fontSize: 22,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            USDT
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 999,
              padding: "10px 20px",
              fontSize: 22,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            USDC
          </div>
        </div>
      </div>
    </div>
  )
}
