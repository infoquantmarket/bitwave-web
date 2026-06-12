"use client"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqKeys = ["1", "2", "3", "4", "5", "6", "7", "8"] as const

export default function FaqSection() {
  const t = useTranslations("faq")
  const [open, setOpen] = useState<string | null>(null)

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-text-title text-center mb-10">{t("title")}</h2>
        <div className="space-y-2">
          {faqKeys.map((k) => (
            <div key={k} className="border border-gray-100 rounded-xl overflow-hidden">
              <button
                id={`faq-btn-${k}`}
                onClick={() => setOpen(open === k ? null : k)}
                className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-text-title hover:bg-brand-light transition-colors"
                aria-expanded={open === k}
                aria-controls={`faq-panel-${k}`}
              >
                <span>{t(("q" + k) as Parameters<typeof t>[0])}</span>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className={`flex-shrink-0 text-brand-accent transition-transform duration-200 ${
                    open === k ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                id={`faq-panel-${k}`}
                role="region"
                aria-labelledby={`faq-btn-${k}`}
                hidden={open !== k}
                className="px-5 pb-5 pt-3 text-sm text-text-body leading-relaxed border-t border-gray-50"
              >
                {t(("a" + k) as Parameters<typeof t>[0])}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
