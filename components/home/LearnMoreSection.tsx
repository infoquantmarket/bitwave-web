import Link from "next/link"
import { getLocale, getTranslations } from "next-intl/server"
import { ArrowRight, Network, Percent, Wallet } from "lucide-react"
import { networks, ratePath } from "@/lib/rate"

export default async function LearnMoreSection() {
  const [t, r, locale] = await Promise.all([
    getTranslations("learnMore"),
    getTranslations("ratePage"),
    getLocale(),
  ])

  const topics = [
    { icon: Percent, label: t("topic1") },
    { icon: Network, label: t("topic2") },
    { icon: Wallet, label: t("topic3") },
  ]

  return (
    <section className="bg-brand-primary px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-center">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight">
            {t("title")}
          </h2>
          <p className="mt-4 text-lg text-white/75 leading-relaxed max-w-xl">{t("body")}</p>

          <ul className="mt-7 space-y-3">
            {topics.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-white">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon size={18} aria-hidden="true" />
                </span>
                {label}
              </li>
            ))}
          </ul>

          <Link
            href={ratePath(locale)}
            className="mt-9 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-7 py-3.5 font-bold text-brand-primary transition-all hover:bg-brand-light active:scale-[0.98] whitespace-nowrap"
          >
            {t("cta")}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold text-white/70">{t("networksLabel")}</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {networks.map((n) => (
              <li key={n.id}>
                <Link
                  href={`${ratePath(locale)}#redes`}
                  className="group block rounded-2xl border border-white/15 bg-white/5 p-5 transition-all hover:bg-white/10 hover:border-white/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-lg font-bold text-white">
                      {r(`net.${n.id}.name` as "net.polygon.name")}
                    </span>
                    <ArrowRight
                      size={16}
                      aria-hidden="true"
                      className="mt-1.5 text-white/50 transition-all group-hover:translate-x-0.5 group-hover:text-white"
                    />
                  </div>
                  <p className="mt-1 text-sm text-white/65">
                    {r(`net.${n.id}.standard` as "net.polygon.standard")}
                  </p>
                  <span
                    className={`mt-4 inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${
                      n.costLevel !== "low" ? "bg-amber-100 text-amber-900" : "bg-brand-light text-brand-primary"
                    }`}
                  >
                    {r(`costLevels.${n.costLevel}` as "costLevels.low")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-white/55">{t("note")}</p>
        </div>
      </div>
    </section>
  )
}
