import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { getWhatsAppUrl, siteConfig } from "@/lib/config"
import { MessageCircle, ArrowRight } from "lucide-react"
import QrCode from "@/components/ui/QrCode"

export default async function ContactSection() {
  const t = await getTranslations("contact")

  return (
    <section id="contacto" className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-primary">
      <div className="max-w-4xl mx-auto text-center">
        <Image
          src="/logo_bl.png"
          alt="BitWave"
          width={140}
          height={40}
          className="h-20 w-auto mx-auto mb-6"
        />
        <h2 className="text-3xl font-bold text-white mb-3">{t("title")}</h2>
        <p className="text-white/70 mb-12 text-lg">{t("subtitle")}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Camino 1: Iniciar intercambio directo */}
          <div className="bg-white/10 rounded-2xl p-8 flex flex-col items-center gap-5">
            <div className="bg-white rounded-xl p-3 shadow-lg">
              <QrCode value={siteConfig.zabioUrl} size={160} />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-base mb-1">{t("qrLabel")}</p>
              <p className="text-white/60 text-sm">{t("qrSub")}</p>
            </div>
            <a
              href={siteConfig.zabioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-accent hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg transition-colors text-base w-full justify-center"
            >
              {t("startBtn")}
              <ArrowRight size={18} />
            </a>
          </div>

          {/* Camino 2: Consultar por WhatsApp */}
          <div className="bg-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-5">
            <div className="w-16 h-16 rounded-full bg-whatsapp/20 flex items-center justify-center">
              <MessageCircle size={32} className="text-green-400" />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-lg mb-2">{t("whatsappTitle")}</p>
              <p className="text-white/60 text-sm leading-relaxed">{t("whatsappDesc")}</p>
            </div>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-whatsapp hover:bg-whatsapp-hover text-white font-bold px-6 py-3 rounded-lg transition-colors text-base w-full justify-center"
            >
              <MessageCircle size={20} />
              {t("whatsappBtn")}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
