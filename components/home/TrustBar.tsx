import { getTranslations } from "next-intl/server"
import { Building2, UserCheck, Shield, Search } from "lucide-react"

const items = [
  { key: "legal" as const, icon: Building2 },
  { key: "kyc" as const, icon: UserCheck },
  { key: "sarlaft" as const, icon: Shield },
  { key: "verification" as const, icon: Search },
]

export default async function TrustBar() {
  const t = await getTranslations("trust")

  return (
    <section className="bg-brand-primary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map(({ key, icon: Icon }) => (
          <div key={key} className="flex items-center gap-3 text-white">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Icon size={20} className="text-brand-accent" />
            </div>
            <span className="text-sm font-medium leading-tight">{t(key)}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
