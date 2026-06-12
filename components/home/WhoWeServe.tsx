import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { Plane, Briefcase } from "lucide-react"

const cards = [
  {
    titleKey: "touristsTitle" as const,
    descKey: "touristsDesc" as const,
    badgeKey: "touristsBadge" as const,
    icon: Plane,
    image: "/images/turistas.png",
  },
  {
    titleKey: "localsTitle" as const,
    descKey: "localsDesc" as const,
    badgeKey: "localsBadge" as const,
    icon: Briefcase,
    image: "/images/locales.png",
  },
]

export default async function WhoWeServe() {
  const t = await getTranslations("whoWeServe")

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-light">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-text-title text-center mb-12">{t("title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map(({ titleKey, descKey, badgeKey, icon: Icon, image }) => (
            <div
              key={titleKey}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
            >
              <div className="relative h-56 bg-brand-light">
                <Image
                  src={image}
                  alt={t(titleKey)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center">
                    <Icon size={20} className="text-brand-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-text-title">{t(titleKey)}</h3>
                </div>
                <p className="text-text-body text-sm leading-relaxed mb-4">{t(descKey)}</p>
                <span className="inline-block bg-brand-light text-brand-primary text-xs font-semibold px-3 py-1 rounded-full">
                  {t(badgeKey)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
