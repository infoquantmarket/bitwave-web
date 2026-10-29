import { getTranslations } from "next-intl/server"
import { ChevronDown } from "lucide-react"

const faqKeys = ["1", "2", "3", "4", "5", "6", "7", "8"] as const

export default async function FaqSection() {
  const t = await getTranslations("faq")

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-text-title text-center mb-10">{t("title")}</h2>
        <div className="space-y-2">
          {faqKeys.map((k) => (
            <details
              key={k}
              name="faq"
              className="group border border-gray-100 rounded-xl overflow-hidden"
            >
              <summary className="flex w-full cursor-pointer list-none items-center justify-between px-5 py-4 text-left font-medium text-text-title hover:bg-brand-light transition-colors [&::-webkit-details-marker]:hidden">
                <span>{t(("q" + k) as Parameters<typeof t>[0])}</span>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className="flex-shrink-0 text-brand-accent transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <div className="px-5 pb-5 pt-3 text-sm text-text-body leading-relaxed border-t border-gray-50">
                {t(("a" + k) as Parameters<typeof t>[0])}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
