import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { getWhatsAppUrl } from "@/lib/config"
import { MessageCircle } from "lucide-react"

export default async function ContactSection() {
  const t = await getTranslations("contact")

  return (
    <section id="contacto" className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-primary">
      <div className="max-w-3xl mx-auto text-center">
        <Image
          src="/logo_bl.png"
          alt="BitWave"
          width={140}
          height={40}
          className="h-20 w-auto mx-auto mb-6"
        />
        <h2 className="text-3xl font-bold text-white mb-3">{t("title")}</h2>
        <p className="text-white/70 mb-10 text-lg">{t("subtitle")}</p>

        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-whatsapp hover:bg-whatsapp-hover text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg"
        >
          <MessageCircle size={24} />
          {t("whatsappBtn")}
        </a>

      </div>
    </section>
  )
}
