import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    template: "%s | BitWave",
    default: "BitWave — Cambia tus USDT por pesos colombianos",
  },
  description:
    "BitWave compra tus USDT y te entrega pesos colombianos en efectivo o transferencia bancaria. Empresa legal, proceso KYC, sistema SARLAFT. Medellín y Envigado.",
  metadataBase: new URL("https://www.bitwaveco.com"),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
