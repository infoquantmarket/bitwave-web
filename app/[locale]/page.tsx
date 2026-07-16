import type { Metadata } from "next"
import HeroSection from "@/components/home/HeroSection"
import TrustBar from "@/components/home/TrustBar"
import HowItWorks from "@/components/home/HowItWorks"
import WhoWeServe from "@/components/home/WhoWeServe"
import LocationsSection from "@/components/home/LocationsSection"
import BlogCarousel from "@/components/home/BlogCarousel"
import ComplianceSection from "@/components/home/ComplianceSection"
import FaqSection from "@/components/home/FaqSection"
import ContactSection from "@/components/home/ContactSection"
import WhatsAppFloatButton from "@/components/ui/WhatsAppFloatButton"
import { getLocale } from "next-intl/server"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEs = locale === "es"

  const titleEs = "BitWave — Cambia USDT por pesos colombianos en Medellín | Legal y Seguro"
  const titleEn = "BitWave — Sell USDT for Colombian Pesos in Medellín | Legal & Fast"
  const descEs =
    "Convierte tus USDT a pesos colombianos en efectivo o transferencia. KYC, SARLAFT, empresa legal. 3 puntos físicos en Medellín y Envigado. Turistas bienvenidos."
  const descEn =
    "Exchange USDT for Colombian pesos — cash or bank transfer. Full KYC, SARLAFT compliance, legally registered. 3 locations in Medellín & Envigado. Tourists welcome."

  return {
    title: isEs ? titleEs : titleEn,
    description: isEs ? descEs : descEn,
    alternates: {
      canonical: isEs ? "https://www.bitwaveco.com" : "https://www.bitwaveco.com/en",
      languages: {
        es: "https://www.bitwaveco.com",
        en: "https://www.bitwaveco.com/en",
        "x-default": "https://www.bitwaveco.com",
      },
    },
    openGraph: {
      title: isEs ? titleEs : titleEn,
      description: isEs ? descEs : descEn,
      url: isEs ? "https://www.bitwaveco.com" : "https://www.bitwaveco.com/en",
      locale: isEs ? "es_CO" : "en_US",
    },
  }
}

export default async function HomePage() {
  const locale = await getLocale()
  return (
    <main>
      <HeroSection />
      <TrustBar />
      <HowItWorks />
      <WhoWeServe />
      <LocationsSection />
      <BlogCarousel locale={locale} />
      <ComplianceSection />
      <FaqSection />
      <ContactSection />
      <WhatsAppFloatButton />
    </main>
  )
}
