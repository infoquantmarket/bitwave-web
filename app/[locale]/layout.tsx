import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Inter } from "next/font/google"
import { siteConfig } from "@/lib/config"
import { locations, locationPath } from "@/lib/locations"
import { getPostAlternates } from "@/lib/blog"

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
  const isEn = locale === "en"

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
    parentOrganization: { "@id": `${siteConfig.siteUrl}/#organization` },
    image: `${siteConfig.siteUrl}${loc.image}`,
    description:
      isEn
        ? "Exchange of USDT, USDC and Bitcoin for Colombian pesos (COP), in cash or bank transfer. Full KYC process and SARLAFT system."
        : "Intercambio de USDT, USDC y Bitcoin por pesos colombianos (COP) en efectivo o transferencia bancaria. Proceso KYC completo y sistema SARLAFT.",
    url: `${siteConfig.siteUrl}${locationPath(loc.id, locale)}`,
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
    openingHours: loc.openingHours,
    currenciesAccepted: "COP",
    priceRange: "$$",
    knowsAbout: ["USDT", "USDC", "Bitcoin","criptoactivos", "cambio de divisas", "pesos colombianos", "Polygon", "Tron", "Solana", "Ethereum"],
  }))

  const postAlternates = getPostAlternates()

  return (
    <html lang={locale} className={inter.variable}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, ...localBusinesses]) }}
          />
          <Navbar postAlternates={postAlternates} />
          {children}
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
