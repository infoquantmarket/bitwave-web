import { getTranslations } from "next-intl/server"
import { siteConfig, getWhatsAppUrl } from "@/lib/config"
import { MessageCircle, Mail, Clock } from "lucide-react"

export default async function ContactSection() {
  const t = await getTranslations("contact")

  return (
    <section id="contacto" className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-primary">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-3">{t("title")}</h2>
        <p className="text-white/70 mb-10 text-lg">{t("subtitle")}</p>

        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1da851] text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg"
        >
          <MessageCircle size={24} />
          {t("whatsappBtn")}
        </a>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
          <div className="bg-white/10 rounded-xl p-5">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
              <Mail size={14} />
              {t("email")}
            </div>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-white font-medium hover:text-brand-accent transition-colors"
            >
              {siteConfig.email}
            </a>
          </div>
          <div className="bg-white/10 rounded-xl p-5">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
              <Clock size={14} />
              {t("attention")}
            </div>
            <p className="text-white font-medium">{t("schedule")}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
