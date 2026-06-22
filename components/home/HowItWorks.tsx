import { getTranslations } from "next-intl/server"
import { MessageCircle, UserCheck, Banknote, ArrowRight } from "lucide-react"
import { getWhatsAppUrl } from "@/lib/config"

const steps = [
  { num: 1, titleKey: "step1Title" as const, descKey: "step1Desc" as const, icon: MessageCircle },
  { num: 2, titleKey: "step2Title" as const, descKey: "step2Desc" as const, icon: UserCheck },
  { num: 3, titleKey: "step3Title" as const, descKey: "step3Desc" as const, icon: Banknote },
]

export default async function HowItWorks() {
  const t = await getTranslations("howItWorks")

  return (
    <section id="como-funciona" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-text-title text-center mb-12">{t("title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(({ num, titleKey, descKey, icon: Icon }) => (
            <div key={num} className="flex flex-col items-center text-center">
              <div className="relative w-20 h-20 rounded-2xl bg-brand-light flex items-center justify-center mb-5 shadow-sm">
                <Icon size={32} className="text-brand-primary" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-brand-accent text-white text-xs font-bold flex items-center justify-center">
                  {num}
                </span>
              </div>
              <h3 className="text-lg font-bold text-text-title mb-2">{t(titleKey)}</h3>
              <p className="text-sm text-text-body leading-relaxed">{t(descKey)}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-accent hover:bg-brand-primary text-white font-semibold px-6 py-3 rounded-lg transition-colors text-base"
          >
            {t("cta")} <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  )
}
