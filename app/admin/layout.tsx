import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" })

export const metadata: Metadata = { title: "Admin | BitWave", robots: "noindex,nofollow" }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="bg-gray-50 min-h-screen font-sans">{children}</body>
    </html>
  )
}
