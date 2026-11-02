"use client"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"

const sections = ["tasa", "negociacion", "redes", "guia", "faq"] as const
const keys = { tasa: "rate", negociacion: "negotiation", redes: "networks", guia: "guide", faq: "faq" } as const

export default function PageNav() {
  const t = useTranslations("ratePage.nav")
  const [active, setActive] = useState<string>("tasa")

  useEffect(() => {
    const els = sections
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          setActive(visible[0].target.id)
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="sticky top-24 z-40 border-b border-gray-100 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <nav aria-label="Secciones" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="flex gap-1 overflow-x-auto py-2 [scrollbar-width:none]">
          {sections.map((id) => (
            <li key={id} className="flex-shrink-0">
              <a
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                className={`block rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  active === id
                    ? "bg-brand-primary text-white"
                    : "text-text-body hover:bg-brand-light hover:text-brand-primary"
                }`}
              >
                {t(keys[id])}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
