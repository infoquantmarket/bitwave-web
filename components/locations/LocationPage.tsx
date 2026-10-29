import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { ArrowRight, ChevronDown, Clock, ExternalLink, MapPin, MessageCircle } from "lucide-react"
import { getWhatsAppUrl, siteConfig } from "@/lib/config"
import { getLocation, locationPath, locations, type Locale } from "@/lib/locations"

const abs = (path: string) => `${siteConfig.siteUrl}${path}`

export async function buildLocationMetadata(id: string, locale: Locale): Promise<Metadata> {
  const loc = getLocation(id)
  if (!loc) return {}
  const t = await getTranslations({ locale, namespace: "locationPage" })
  const params = {
    name: loc.name,
    zone: loc.zone[locale],
    address: `${loc.address}, ${loc.city}`,
    hours: loc.hours[locale],
  }
  const title = t("metaTitle", { zone: loc.zoneTitle[locale] })
  const description = t("metaDesc", params)
  const self = abs(locationPath(id, locale))
  return {
    title,
    description,
    alternates: {
      canonical: self,
      languages: {
        es: abs(locationPath(id, "es")),
        en: abs(locationPath(id, "en")),
        "x-default": abs(locationPath(id, "es")),
      },
    },
    openGraph: {
      title,
      description,
      url: self,
      locale: locale === "en" ? "en_US" : "es_CO",
      images: loc.image ? [{ url: abs(loc.image) }] : undefined,
    },
  }
}

export default async function LocationPage({ id, locale }: { id: string; locale: Locale }) {
  const loc = getLocation(id)
  if (!loc) return null
  const t = await getTranslations({ locale, namespace: "locationPage" })
  const home = locale === "en" ? "/en" : "/"
  const fullAddress = `${loc.address}, ${loc.city}`
  const faqParams = {
    name: loc.name,
    short: loc.shortName,
    local: loc.local[locale],
    address: loc.address,
    city: loc.city,
    hours: loc.hours[locale],
  }
  const faqs = ["1", "2", "3", "4", "5"].map((k) => ({
    q: t(`f${k}q` as "f1q", faqParams),
    a: t(`f${k}a` as "f1a", faqParams),
  }))
  const howSteps = ["how1", "how2", "how3", "how4"] as const
  const bringItems = ["bring1", "bring2", "bring3", "bring4"] as const
  const others = locations.filter((l) => l.id !== loc.id)

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("breadcrumbHome"), item: abs(home === "/" ? "" : home) || siteConfig.siteUrl },
      { "@type": "ListItem", position: 2, name: loc.name, item: abs(locationPath(loc.id, locale)) },
    ],
  }

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([faqSchema, breadcrumbSchema]) }}
      />

      <section className="bg-brand-light px-4 sm:px-6 lg:px-8 pt-10 pb-14">
        <div className="max-w-5xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-sm text-text-body mb-6">
            <Link href={home} className="hover:text-brand-primary">{t("breadcrumbHome")}</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-text-title font-medium">{loc.shortName}</span>
          </nav>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-accent bg-white rounded-full px-3 py-1 mb-4">
            {t("badge")}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-text-title leading-tight">
            {t("h1", { name: loc.name })}
          </h1>
          <p className="mt-4 text-lg text-text-body leading-relaxed max-w-3xl">
            {t("subtitle", { zone: loc.zone[locale] })}
          </p>
          <p className="mt-3 text-text-body leading-relaxed max-w-3xl">{loc.intro[locale]}</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href={getWhatsAppUrl(undefined, locale)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-whatsapp hover:bg-whatsapp-hover text-white font-bold px-6 py-3.5 rounded-lg transition-colors"
            >
              <MessageCircle size={18} aria-hidden="true" />
              {t("whatsapp")}
            </a>
            <a
              href={siteConfig.zabioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-primary text-white font-bold px-6 py-3.5 rounded-lg transition-colors"
            >
              {t("start")}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-14 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <MapPin size={20} className="mt-0.5 flex-shrink-0 text-brand-accent" aria-hidden="true" />
              <div>
                <h2 className="font-bold text-text-title">{t("address")}</h2>
                <p className="text-text-body">{loc.name}</p>
                <p className="text-text-body">{loc.local[locale]}</p>
                <p className="text-text-body">{fullAddress}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={20} className="mt-0.5 flex-shrink-0 text-brand-accent" aria-hidden="true" />
              <div>
                <h2 className="font-bold text-text-title">{t("hours")}</h2>
                <p className="text-text-body">{loc.hours[locale]}</p>
              </div>
            </div>
            <a
              href={loc.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-brand-accent hover:text-brand-primary transition-colors"
            >
              {t("directions")}
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-64">
            <iframe
              src={loc.embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${loc.name} — ${fullAddress}`}
            />
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-14 bg-brand-light">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold text-text-title mb-5">{t("howTitle")}</h2>
            <ol className="space-y-4">
              {howSteps.map((k, i) => (
                <li key={k} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-accent text-white text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-text-body leading-relaxed">{t(k)}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-title mb-5">{t("bringTitle")}</h2>
            <ul className="space-y-3 list-disc pl-5 text-text-body leading-relaxed">
              {bringItems.map((k) => (
                <li key={k}>{t(k)}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-14 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-text-title mb-3">{t("nutiTitle")}</h2>
          <p className="text-text-body leading-relaxed">{t("nuti")}</p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-14 bg-brand-light">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-text-title mb-6">{t("faqTitle")}</h2>
          <div className="space-y-2">
            {faqs.map((f) => (
              <details key={f.q} name="location-faq" className="group bg-white border border-gray-100 rounded-xl overflow-hidden">
                <summary className="flex w-full cursor-pointer list-none items-center justify-between px-5 py-4 font-medium text-text-title hover:bg-brand-light transition-colors [&::-webkit-details-marker]:hidden">
                  <span>{f.q}</span>
                  <ChevronDown
                    size={18}
                    aria-hidden="true"
                    className="flex-shrink-0 text-brand-accent transition-transform duration-200 group-open:rotate-180"
                  />
                </summary>
                <div className="px-5 pb-5 pt-3 text-sm text-text-body leading-relaxed border-t border-gray-50">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-14 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-text-title mb-6">{t("othersTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {others.map((o) => (
              <Link
                key={o.id}
                href={locationPath(o.id, locale)}
                className="block border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow"
              >
                <p className="font-bold text-text-title">{o.name}</p>
                <p className="text-sm text-text-body mt-1">{o.address}, {o.city}</p>
                <p className="text-sm text-text-body">{o.hours[locale]}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
