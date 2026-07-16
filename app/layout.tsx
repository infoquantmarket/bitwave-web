import type { Metadata } from "next"
import "./globals.css"

const title = "BitWave — Cambia tus USDT por pesos colombianos en Medellín"
const description =
  "BitWave compra tus USDT y te entrega pesos colombianos en efectivo o transferencia bancaria. Empresa legal, proceso KYC, sistema SARLAFT. Puntos físicos en Medellín y Envigado."

export const metadata: Metadata = {
  title: {
    template: "%s | BitWave",
    default: title,
  },
  description,
  metadataBase: new URL("https://www.bitwaveco.com"),
  keywords: [
    "cambiar USDT a pesos colombianos",
    "vender USDT Medellín",
    "exchange USDT COP Colombia",
    "cambio criptomonedas Medellín",
    "USDT a pesos efectivo",
    "casa de cambio crypto Colombia",
    "BitWave",
    "sell USDT Medellín",
    "crypto exchange Medellín Colombia",
  ],
  authors: [{ name: "BitWave S.A.S.", url: "https://www.bitwaveco.com" }],
  creator: "BitWave S.A.S.",
  publisher: "BitWave S.A.S.",
  openGraph: {
    type: "website",
    siteName: "BitWave",
    title,
    description,
    url: "https://www.bitwaveco.com",
    locale: "es_CO",
    images: [
      {
        url: "/images/hero.png",
        width: 1200,
        height: 630,
        alt: "BitWave — Cambia USDT por pesos colombianos en Medellín",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/hero.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
