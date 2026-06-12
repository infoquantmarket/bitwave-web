"use client"
import Image from "next/image"
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"
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
  const [open, setOpen] = useState(false)
  const altHref = locale === "es" ? "/en" : "/"

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href={locale === "es" ? "/" : "/en"} className="flex-shrink-0">
          <Image
            src="/logo_nb.png"
            alt="BitWave"
            width={140}
            height={40}
            className="h-9 w-auto"
            priority
          />
        </Link>

        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.key}>
              <Link
                href={link.href}
                className="text-sm text-[#4b5563] hover:text-[#1a4a2e] font-medium transition-colors"
              >
                {t(link.key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link href={altHref} className="text-xl leading-none" title={locale === "es" ? "English" : "Español"}>
            {locale === "es" ? "🇺🇸" : "🇨🇴"}
          </Link>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 bg-[#2d8a4e] hover:bg-[#1a4a2e] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {t("cta")}
          </a>
          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
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
                  className="block text-sm text-[#4b5563] hover:text-[#1a4a2e] font-medium py-1"
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
                className="inline-flex items-center gap-2 bg-[#2d8a4e] text-white text-sm font-semibold px-4 py-2 rounded-lg mt-1"
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
