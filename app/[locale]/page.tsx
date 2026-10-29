import type { Metadata } from "next"
import HeroSection from "@/components/home/HeroSection"
import TrustBar from "@/components/home/TrustBar"
import HowItWorks from "@/components/home/HowItWorks"
import WhoWeServe from "@/components/home/WhoWeServe"
import EsimSection from "@/components/home/EsimSection"
import LocationsSection from "@/components/home/LocationsSection"
import BlogCarousel from "@/components/home/BlogCarousel"
import ComplianceSection from "@/components/home/ComplianceSection"
import FaqSection from "@/components/home/FaqSection"
import ContactSection from "@/components/home/ContactSection"
import WhatsAppFloatButton from "@/components/ui/WhatsAppFloatButton"
import { getLocale, getTranslations } from "next-intl/server"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEs = locale === "es"

  const titleEs = "Cambia USDT y Bitcoin por pesos en Medellín | BitWave"
  const titleEn = "Exchange USDT & Bitcoin for Pesos in Medellín | BitWave"
  const descEs =
    "Convierte tus USDT, USDC y Bitcoin a pesos colombianos en efectivo o transferencia. Sin monto mínimo. KYC, SARLAFT, empresa legal. 3 puntos físicos en Medellín y Envigado. Turistas bienvenidos."
  const descEn =
    "Exchange USDT, USDC and Bitcoin for Colombian pesos — cash or bank transfer. No minimum amount. Full KYC, SARLAFT compliance, legally registered. 3 locations in Medellín & Envigado. Tourists welcome."

  return {
    title: { absolute: isEs ? titleEs : titleEn },
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
  const t = await getTranslations("faq")
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((k) => ({
      "@type": "Question",
      name: t(("q" + k) as Parameters<typeof t>[0]),
      acceptedAnswer: { "@type": "Answer", text: t(("a" + k) as Parameters<typeof t>[0]) },
    })),
  }
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <HeroSection />
      <TrustBar />
      <HowItWorks />
      <WhoWeServe />
      <LocationsSection />
      <EsimSection />
      <BlogCarousel locale={locale} />
      <ComplianceSection />
      <FaqSection />
      <ContactSection />
      <WhatsAppFloatButton />
    </main>
  )
}
