import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import {
  ArrowRight,
  Banknote,
  ChevronDown,
  ClipboardCheck,
  KeyRound,
  Lightbulb,
  MessageCircle,
  Percent,
  ShieldCheck,
  Wallet,
  Fuel,
  Network,
} from "lucide-react"
import { getWhatsAppUrl, siteConfig } from "@/lib/config"
import { getTasa } from "@/lib/tasa"
import { ratePath } from "@/lib/rate"
import type { Locale } from "@/lib/locations"
import PageNav from "./PageNav"
import NetworkExplorer from "./NetworkExplorer"
import AddressChecker from "./AddressChecker"

const abs = (path: string) => `${siteConfig.siteUrl}${path}`

export async function buildRateMetadata(locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "ratePage" })
  const self = abs(ratePath(locale))
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    alternates: {
      canonical: self,
      languages: {
        es: abs(ratePath("es")),
        en: abs(ratePath("en")),
        "x-default": abs(ratePath("es")),
      },
    },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDesc"),
      url: self,
      locale: locale === "en" ? "en_US" : "es_CO",
    },
  }
}

const btnPrimary =
  "inline-flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-primary text-white font-bold px-6 py-3.5 rounded-lg transition-all active:scale-[0.98] shadow-md whitespace-nowrap"
const btnWhatsapp =
  "inline-flex items-center justify-center gap-2 bg-whatsapp hover:bg-whatsapp-hover text-white font-bold px-6 py-3.5 rounded-lg transition-all active:scale-[0.98] whitespace-nowrap"

export default async function RatePage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "ratePage" })
  const compliance = await getTranslations({ locale, namespace: "compliance" })
  const tasa = await getTasa()
  const home = locale === "en" ? "/en" : "/"
  const wa = getWhatsAppUrl(undefined, locale)

  const negSteps = [
    { n: 1, icon: MessageCircle, t: t("neg1t"), d: t("neg1d") },
    { n: 2, icon: Percent, t: t("neg2t"), d: t("neg2d") },
    { n: 3, icon: ShieldCheck, t: t("neg3t"), d: t("neg3d") },
    { n: 4, icon: Banknote, t: t("neg4t"), d: t("neg4d") },
  ]
  const guideSteps = [
    { t: t("g1t"), d: t("g1d") },
    { t: t("g2t"), d: t("g2d") },
    { t: t("g3t"), d: t("g3d") },
    { t: t("g4t"), d: t("g4d") },
    { t: t("g5t"), d: t("g5d") },
    { t: t("g6t"), d: t("g6d") },
    { t: t("g7t"), d: t("g7d") },
  ]
  const faqs = ["1", "2", "3", "4", "5", "6"].map((i) => ({
    q: t(`f${i}q` as "f1q"),
    a: t(`f${i}a` as "f1a"),
  }))

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
      { "@type": "ListItem", position: 1, name: t("breadcrumbHome"), item: locale === "en" ? abs("/en") : siteConfig.siteUrl },
      { "@type": "ListItem", position: 2, name: t("nav.rate"), item: abs(ratePath(locale)) },
    ],
  }

  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([faqSchema, breadcrumbSchema]) }}
      />

      <PageNav />

      {/* Hero: texto a la izquierda, tasa en vivo a la derecha */}
      <section id="tasa" className="scroll-mt-40 relative overflow-hidden bg-gradient-to-b from-brand-light to-white px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-accent/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
          <div>
            <nav aria-label="Breadcrumb" className="text-sm text-text-body mb-5">
              <Link href={home} className="hover:text-brand-primary">{t("breadcrumbHome")}</Link>
              <span className="mx-2" aria-hidden="true">/</span>
              <span className="font-medium text-text-title">{t("nav.rate")}</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-text-title leading-tight tracking-tight">
              {t("h1")}
            </h1>
            <p className="mt-5 text-lg text-text-body leading-relaxed max-w-xl">{t("sub")}</p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <a href={siteConfig.zabioUrl} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
                {t("ctaStart")}
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a href={wa} target="_blank" rel="noopener noreferrer" className={btnWhatsapp}>
                <MessageCircle size={18} aria-hidden="true" />
                {t("ctaWa")}
              </a>
            </div>
            <ul className="mt-7 flex flex-wrap gap-2">
              {[t("chip1"), t("chip2"), t("chip3")].map((c) => (
                <li key={c} className="rounded-lg border border-brand-accent/20 bg-white px-3 py-1.5 text-sm font-medium text-brand-primary">
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-brand-accent/15 bg-white p-6 sm:p-8 shadow-[0_24px_60px_-24px_rgba(26,74,46,0.35)]">
            <p className="text-sm font-semibold text-text-body">{t("rateTitle")}</p>
            {tasa ? (
              <>
                <div className="mt-3 flex items-center gap-3">
                  <Image src="/usdt.svg" alt="USDT" width={40} height={40} className="h-10 w-10 flex-shrink-0" />
                  <p className="text-4xl sm:text-5xl font-bold text-brand-primary tabular-nums">
                    ${tasa.tasaFinal.toLocaleString(locale === "en" ? "en-US" : "es-CO")}
                    <span className="ml-2 text-lg font-semibold text-text-body">COP</span>
                  </p>
                </div>
                <p className="mt-1 text-sm font-medium text-text-body">{t("ratePer")}</p>
              </>
            ) : (
              <p className="mt-3 rounded-xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">{t("rateUnavailable")}</p>
            )}
            <p className="mt-5 text-xs leading-relaxed text-text-body border-t border-gray-100 pt-4">{t("rateNote")}</p>
            <p className="mt-2 flex items-center gap-2 text-xs font-medium text-text-title">
              <Image src="/usdc.svg" alt="USDC" width={20} height={20} className="h-5 w-5" />
              {t("rateOther")}
            </p>
          </div>
        </div>
      </section>

      {/* Negociación: línea de tiempo de 4 pasos */}
      <section id="negociacion" className="scroll-mt-40 bg-white px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="reveal max-w-2xl">
            <h2 className="text-3xl font-bold text-text-title tracking-tight">{t("negTitle")}</h2>
            <p className="mt-3 text-text-body leading-relaxed">{t("negSub")}</p>
          </div>
          <ol className="relative mt-12 grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-10">
            <div aria-hidden="true" className="hidden md:block absolute left-[12.5%] right-[12.5%] top-7 h-px bg-brand-accent/25" />
            {negSteps.map(({ n, icon: Icon, t: title, d }) => (
              <li key={n} className="reveal relative flex md:flex-col items-start md:items-center gap-4 md:gap-0 md:text-center">
                <div className="relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-light ring-4 ring-white">
                  <Icon size={26} className="text-brand-primary" aria-hidden="true" />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-accent text-xs font-bold text-white">
                    {n}
                  </span>
                </div>
                <div className="md:mt-5">
                  <h3 className="text-lg font-bold text-text-title">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-body">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Banda CTA: registrarse para adelantar */}
      <section className="bg-brand-primary px-4 sm:px-6 lg:px-8 py-14">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-7">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{t("band1Title")}</h2>
            <p className="mt-2 text-white/75 leading-relaxed">{t("band1Body")}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a href={siteConfig.zabioUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 font-bold text-brand-primary transition-all hover:bg-brand-light active:scale-[0.98] whitespace-nowrap">
              {t("bandRegister")}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className={btnWhatsapp}>
              <MessageCircle size={18} aria-hidden="true" />
              {t("ctaWa")}
            </a>
          </div>
        </div>
      </section>

      {/* Redes: explorador interactivo */}
      <section id="redes" className="scroll-mt-40 bg-brand-light px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="reveal max-w-2xl">
            <h2 className="text-3xl font-bold text-text-title tracking-tight">{t("netTitle")}</h2>
            <p className="mt-3 text-text-body leading-relaxed">{t("netSub")}</p>
          </div>
          <div className="reveal mt-10">
            <NetworkExplorer />
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-text-body">{t("netDisclaimer")}</p>
        </div>
      </section>

      {/* Guía: intro y verificador a la izquierda, pasos a la derecha */}
      <section id="guia" className="scroll-mt-40 bg-white px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-16">
          <div className="lg:sticky lg:top-48 lg:self-start">
            <h2 className="text-3xl font-bold text-text-title tracking-tight">{t("guideTitle")}</h2>
            <p className="mt-3 text-text-body leading-relaxed">{t("guideSub")}</p>
            <div className="mt-8">
              <AddressChecker />
            </div>
          </div>

          <div>
            <ol className="relative space-y-8">
              <div aria-hidden="true" className="absolute left-[19px] top-2 bottom-2 w-px bg-brand-accent/20" />
              <div aria-hidden="true" className="line-grow absolute left-[19px] top-2 bottom-2 w-px bg-brand-accent" />
              {guideSteps.map((s, i) => (
                <li key={s.t} className="reveal relative flex gap-5">
                  <span className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-accent text-sm font-bold text-white ring-4 ring-white">
                    {i + 1}
                  </span>
                  <div className="pt-1.5">
                    <h3 className="text-lg font-bold text-text-title">{s.t}</h3>
                    <p className="mt-1 leading-relaxed text-text-body">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-10 flex gap-3 rounded-2xl bg-brand-light p-5">
              <Lightbulb size={20} className="mt-0.5 flex-shrink-0 text-brand-primary" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-text-body">{t("guideTip")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Errores comunes: bento de 4 celdas */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="reveal text-3xl font-bold text-text-title tracking-tight">{t("mistakesTitle")}</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="reveal md:col-span-2 rounded-2xl border border-gray-100 bg-white p-7 shadow-[0_8px_30px_-16px_rgba(26,74,46,0.25)]">
              <Network size={26} className="text-brand-accent" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-bold text-text-title">{t("m1t")}</h3>
              <p className="mt-2 leading-relaxed text-text-body">{t("m1d")}</p>
            </div>
            <div className="reveal rounded-2xl bg-brand-light p-7">
              <ClipboardCheck size={26} className="text-brand-primary" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-bold text-text-title">{t("m2t")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-body">{t("m2d")}</p>
            </div>
            <div className="reveal rounded-2xl border border-gray-100 bg-white p-7">
              <Fuel size={26} className="text-brand-accent" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-bold text-text-title">{t("m3t")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-body">{t("m3d")}</p>
            </div>
            <div className="reveal md:col-span-2 rounded-2xl bg-brand-primary p-7">
              <KeyRound size={26} className="text-white" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-bold text-white">{t("m4t")}</h3>
              <p className="mt-2 leading-relaxed text-white/80">{t("m4d")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-40 bg-brand-light px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="reveal text-3xl font-bold text-text-title tracking-tight">{t("faqTitle")}</h2>
          <div className="mt-8 space-y-2">
            {faqs.map((f) => (
              <details key={f.q} name="rate-faq" className="group overflow-hidden rounded-xl border border-gray-100 bg-white">
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

      {/* CTA final */}
      <section className="bg-brand-primary px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <Wallet size={32} className="mx-auto text-white/80" aria-hidden="true" />
          <h2 className="mt-4 text-3xl font-bold text-white tracking-tight">{t("finalTitle")}</h2>
          <p className="mt-3 text-white/75 leading-relaxed">{t("finalBody")}</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <a href={siteConfig.zabioUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 font-bold text-brand-primary transition-all hover:bg-brand-light active:scale-[0.98] whitespace-nowrap">
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
