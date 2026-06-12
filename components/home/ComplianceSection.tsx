import { getTranslations } from "next-intl/server"
import { ShieldCheck, Building2, AlertCircle, UserCheck } from "lucide-react"

const items = [
  { titleKey: "kycTitle" as const, descKey: "kycDesc" as const, icon: UserCheck },
  { titleKey: "sarlaftTitle" as const, descKey: "sarlaftDesc" as const, icon: ShieldCheck },
  { titleKey: "legalTitle" as const, descKey: "legalDesc" as const, icon: Building2 },
]

export default async function ComplianceSection() {
  const t = await getTranslations("compliance")

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-light">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-title">{t("title")}</h2>
          <p className="mt-3 text-text-body">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {items.map(({ titleKey, descKey, icon: Icon }) => (
            <div key={titleKey} className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center mb-4">
                <Icon size={24} className="text-brand-primary" />
              </div>
              <h3 className="font-bold text-text-title mb-2">{t(titleKey)}</h3>
              <p className="text-sm text-text-body leading-relaxed">{t(descKey)}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 flex gap-4 border border-amber-100">
          <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text-body leading-relaxed">{t("disclaimer")}</p>
        </div>
      </div>
    </section>
  )
}
