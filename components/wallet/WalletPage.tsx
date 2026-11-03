import Link from "next/link"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { ArrowRight, ChevronDown, FileSearch, MessageCircle, Network, Radar, ShieldCheck } from "lucide-react"
import { getWhatsAppUrl, siteConfig } from "@/lib/config"
import { getAllPosts } from "@/lib/blog"
import { ratePath } from "@/lib/rate"
import { walletPath } from "@/lib/wallet"
import type { Locale } from "@/lib/locations"
import WalletChecker from "./WalletChecker"

const abs = (path: string) => `${siteConfig.siteUrl}${path}`

export async function buildWalletMetadata(locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "walletCheck" })
  const self = abs(walletPath(locale))
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    alternates: {
      canonical: self,
      languages: {
        es: abs(walletPath("es")),
        en: abs(walletPath("en")),
        "x-default": abs(walletPath("es")),
      },
    },
    openGraph: { title: t("metaTitle"), description: t("metaDesc"), url: self, locale: locale === "en" ? "en_US" : "es_CO" },
  }
}

const btnWhatsapp =
  "inline-flex items-center justify-center gap-2 bg-whatsapp hover:bg-whatsapp-hover text-white font-bold px-6 py-3.5 rounded-lg transition-all active:scale-[0.98] whitespace-nowrap"
const btnWhite =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 font-bold text-brand-primary transition-all hover:bg-brand-light active:scale-[0.98] whitespace-nowrap"

export default async function WalletPage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "walletCheck" })
  const compliance = await getTranslations({ locale, namespace: "compliance" })
  const home = locale === "en" ? "/en" : "/"
  const wa = getWhatsAppUrl(undefined, locale)
  // Enlaza al post de estafas cuando esté publicado; mientras tanto, al índice del blog.
  const scamsSlug = locale === "en" ? "avoid-scams-exchanging-usdt-medellin" : "como-evitar-estafas-cambiar-usdt-medellin"
  const scamsPublished = getAllPosts(locale).some((p) => p.slug === scamsSlug)
  const blogRoot = locale === "en" ? "/en/blog" : "/blog"
  const scamsPath = scamsPublished ? `${blogRoot}/${scamsSlug}` : blogRoot

  const checks = [
    { icon: Network, t: t("what1t"), d: t("what1d") },
    { icon: FileSearch, t: t("what2t"), d: t("what2d") },
    { icon: Radar, t: t("what3t"), d: t("what3d") },
  ]
  const reads = [
    { t: t("read1t"), d: t("read1d"), tone: "bg-red-50 text-red-900" },
    { t: t("read2t"), d: t("read2d"), tone: "bg-brand-light text-brand-primary" },
    { t: t("read3t"), d: t("read3d"), tone: "bg-amber-50 text-amber-900" },
  ]
  const faqs = ["1", "2", "3", "4", "5"].map((i) => ({ q: t(`f${i}q` as "f1q"), a: t(`f${i}a` as "f1a") }))

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t("breadcrumbHome"), item: locale === "en" ? abs("/en") : siteConfig.siteUrl },
        { "@type": "ListItem", position: 2, name: t("crumb"), item: abs(walletPath(locale)) },
      ],
    },
  ]

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }} />

      <section className="relative overflow-hidden bg-gradient-to-b from-brand-light to-white px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-accent/10 blur-3xl" />
        <div className="relative max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-sm text-text-body mb-5">
            <Link href={home} className="hover:text-brand-primary">{t("breadcrumbHome")}</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="font-medium text-text-title">{t("crumb")}</span>
          </nav>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-accent">
            <ShieldCheck size={14} aria-hidden="true" />
            {t("badge")}
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl xl:text-5xl font-bold text-text-title leading-tight tracking-tight">{t("h1")}</h1>
          <p className="mt-4 text-lg text-text-body leading-relaxed max-w-2xl">{t("sub")}</p>
          <div className="mt-8">
            <WalletChecker />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="reveal max-w-2xl">
            <h2 className="text-3xl font-bold text-text-title tracking-tight">{t("whatTitle")}</h2>
            <p className="mt-3 text-text-body leading-relaxed">{t("whatSub")}</p>
          </div>
          <ul className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {checks.map(({ icon: Icon, t: title, d }) => (
              <li key={title} className="reveal rounded-2xl border border-gray-100 bg-white p-7 shadow-[0_8px_30px_-16px_rgba(26,74,46,0.25)]">
                <Icon size={26} className="text-brand-accent" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-bold text-text-title">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-body">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-brand-light px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="reveal text-3xl font-bold text-text-title tracking-tight">{t("readTitle")}</h2>
          <ul className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {reads.map((r) => (
              <li key={r.t} className={`reveal rounded-2xl p-6 ${r.tone}`}>
                <h3 className="font-bold">{r.t}</h3>
                <p className="mt-2 text-sm leading-relaxed">{r.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-brand-primary px-4 sm:px-6 lg:px-8 py-14">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-7">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{t("bandTitle")}</h2>
            <p className="mt-2 text-white/75 leading-relaxed">{t("bandBody")}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link href={ratePath(locale)} className={btnWhite}>
              {t("bandRate")}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href={scamsPath} className={btnWhatsapp.replace("bg-whatsapp hover:bg-whatsapp-hover", "bg-white/10 hover:bg-white/20 border border-white/30")}>
              {t("bandScams")}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-brand-light px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="reveal text-3xl font-bold text-text-title tracking-tight">{t("faqTitle")}</h2>
          <div className="mt-8 space-y-2">
            {faqs.map((f) => (
              <details key={f.q} name="wallet-faq" className="group overflow-hidden rounded-xl border border-gray-100 bg-white">
                <summary className="flex w-full cursor-pointer list-none items-center justify-between px-5 py-4 font-medium text-text-title transition-colors hover:bg-brand-light [&::-webkit-details-marker]:hidden">
                  <span>{f.q}</span>
                  <ChevronDown size={18} aria-hidden="true" className="flex-shrink-0 text-brand-accent transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="border-t border-gray-50 px-5 pb-5 pt-3 text-sm leading-relaxed text-text-body">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-primary px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight">{t("finalTitle")}</h2>
          <p className="mt-3 text-white/75 leading-relaxed">{t("finalBody")}</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <a href={siteConfig.zabioUrl} target="_blank" rel="noopener noreferrer" className={btnWhite}>
              {t("ctaStart")}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className={btnWhatsapp}>
              <MessageCircle size={18} aria-hidden="true" />
              {t("ctaWa")}
            </a>
          </div>
          <p className="mt-10 text-xs leading-relaxed text-white/55">{compliance("disclaimer")}</p>
        </div>
      </section>
    </main>
  )
}
