import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Inter } from "next/font/google"
import { siteConfig } from "@/lib/config"
import { locations } from "@/lib/locations"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as "es" | "en")) notFound()
  const messages = await getMessages()
  const t = await getTranslations("faq")

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.siteUrl}/#organization`,
    name: "BitWave",
    url: siteConfig.siteUrl,
    logo: `${siteConfig.siteUrl}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Spanish", "English"],
    },
  }

  const localBusinesses = locations.map((loc) => ({
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: `BitWave — ${loc.name}`,
    image: `${siteConfig.siteUrl}${loc.image}`,
    description:
      "Intercambio de USDT por pesos colombianos (COP) en efectivo o transferencia bancaria. Proceso KYC completo y sistema SARLAFT.",
    url: siteConfig.siteUrl,
    telephone: siteConfig.whatsappNumber,
    address: {
      "@type": "PostalAddress",
      streetAddress: loc.address,
      addressLocality: loc.city,
      addressCountry: "CO",
    },
    areaServed: [
      { "@type": "City", name: "Medellín" },
      { "@type": "City", name: "Envigado" },
      { "@type": "State", name: "Antioquia" },
    ],
    openingHours: ["Mo-Fr 08:00-19:00", "Sa 09:00-16:00"],
    currenciesAccepted: "COP",
    priceRange: "$$",
    knowsAbout: ["USDT", "USDC", "criptoactivos", "cambio de divisas", "pesos colombianos", "Polygon", "Tron", "Solana", "Ethereum"],
  }))

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ["1", "2", "3", "4", "5", "6", "7", "8"].map((k) => ({
      "@type": "Question",
      name: t(("q" + k) as Parameters<typeof t>[0]),
      acceptedAnswer: { "@type": "Answer", text: t(("a" + k) as Parameters<typeof t>[0]) },
    })),
  }

  return (
    <html lang={locale} className={inter.variable}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, ...localBusinesses, faqSchema]) }}
          />
          <Navbar />
          {children}
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
