import { Zap, MapPin, Banknote, Globe } from "lucide-react"
import { getTranslations } from "next-intl/server"

export default async function TrustBar() {
  const t = await getTranslations("trust")

  const stats = [
    { icon: Zap, label: t("stat1") },
    { icon: MapPin, label: t("stat2") },
    { icon: Banknote, label: t("stat3") },
    { icon: Globe, label: t("stat4") },
  ]

  return (
    <section className="bg-brand-primary py-8 px-4 sm:px-6 lg:px-8" aria-labelledby="trust-heading">
      <h2 id="trust-heading" className="sr-only">{t("sectionLabel")}</h2>
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 text-white">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Icon size={20} className="text-brand-accent" />
            </div>
            <span className="text-sm font-medium leading-tight">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
