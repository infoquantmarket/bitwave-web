"use client"
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"
import { Link, useRouter, usePathname } from "@/i18n/navigation"
import { getWhatsAppUrl } from "@/lib/config"
import { Menu, X } from "lucide-react"
import { useState } from "react"

const navLinks = [
  { key: "howItWorks", href: "#como-funciona" },
  { key: "locations", href: "#ubicaciones" },
  { key: "blog", href: "/blog" },
  { key: "faq", href: "#faq" },
  { key: "contact", href: "#contacto" },
] as const

export default function Navbar() {
  const t = useTranslations("nav")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  function switchLocale() {
    const nextLocale = locale === "es" ? "en" : "es"
    router.replace(pathname, { locale: nextLocale })
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 md:h-24 flex items-center justify-between">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo_nb.png"
            alt="BitWave"
            width={220}
            height={62}
            className="h-16 md:h-[72px] w-auto"
            priority
          />
        </Link>

        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.key}>
              <Link
                href={link.href}
                className="text-sm text-text-body hover:text-brand-primary font-medium transition-colors"
              >
                {t(link.key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={switchLocale}
            className="text-xl leading-none cursor-pointer"
            title={locale === "es" ? "English" : "Español"}
          >
            <span aria-hidden="true">{locale === "es" ? "🇺🇸" : "🇨🇴"}</span>
            <span className="sr-only">{locale === "es" ? "Switch to English" : "Cambiar a Español"}</span>
          </button>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-accent hover:bg-brand-primary text-white text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors"
          >
            {t("cta")}
          </a>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
          <ul className="flex flex-col gap-3 pt-3">
            {navLinks.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className="block text-sm text-text-body hover:text-brand-primary font-medium py-1"
                  onClick={() => setOpen(false)}
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-accent text-white text-sm font-semibold px-4 py-2 rounded-lg mt-1"
              >
                {t("cta")}
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
