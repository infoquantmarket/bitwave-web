"use client"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Coins, Gauge, Layers, Lightbulb, ScanLine, Target } from "lucide-react"
import { networks, type CostLevel, type NetworkId } from "@/lib/rate"

const costStyle: Record<CostLevel, string> = {
  low: "bg-brand-light text-brand-primary",
  lowmid: "bg-brand-light text-brand-primary",
  high: "bg-amber-50 text-amber-800",
}

export default function NetworkExplorer() {
  const t = useTranslations("ratePage")
  const [active, setActive] = useState<NetworkId>("polygon")
  const current = networks.find((n) => n.id === active)!
  const k = (field: string) => t(`net.${active}.${field}` as "net.polygon.name")

  const facts = [
    { icon: Layers, label: t("netLabels.standard"), value: k("standard") },
    { icon: Coins, label: t("netLabels.token"), value: k("token") },
    { icon: Gauge, label: t("netLabels.speed"), value: k("speed") },
    { icon: ScanLine, label: t("netLabels.address"), value: k("address") },
    { icon: Target, label: t("netLabels.fit"), value: k("fit") },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,260px)_1fr] gap-6">
      <div role="tablist" aria-label={t("netTitle")} className="flex lg:flex-col gap-2 overflow-x-auto pb-1 lg:pb-0 [scrollbar-width:none]">
        {networks.map((n) => {
          const selected = n.id === active
          return (
            <button
              key={n.id}
              role="tab"
              id={`net-tab-${n.id}`}
              aria-selected={selected}
              aria-controls="net-panel"
              onClick={() => setActive(n.id)}
              className={`flex-shrink-0 lg:flex-shrink text-left rounded-2xl border px-5 py-4 transition-all active:scale-[0.98] ${
                selected
                  ? "border-brand-accent bg-white shadow-[0_8px_30px_-12px_rgba(26,74,46,0.35)]"
                  : "border-transparent bg-white/60 hover:bg-white"
              }`}
            >
              <span className="block text-lg font-bold text-text-title">{t(`net.${n.id}.name` as "net.polygon.name")}</span>
              <span className={`mt-1.5 inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${costStyle[n.costLevel]}`}>
                {t(`costLevels.${n.costLevel}` as "costLevels.low")}
              </span>
            </button>
          )
        })}
      </div>

      <div
        key={active}
        role="tabpanel"
        id="net-panel"
        aria-labelledby={`net-tab-${active}`}
        className="panel-in rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-[0_8px_30px_-16px_rgba(26,74,46,0.25)]"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="text-2xl font-bold text-text-title">{k("name")}</h3>
          <span className={`rounded-md px-2.5 py-1 text-sm font-semibold ${costStyle[current.costLevel]}`}>
            {t(`costLevels.${current.costLevel}` as "costLevels.low")}
          </span>
        </div>
        <p className="mt-3 text-text-body leading-relaxed">
          <span className="font-semibold text-text-title">{t("netLabels.cost")}: </span>
          {k("cost")}
        </p>

        <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex gap-3">
              <Icon size={18} className="mt-0.5 flex-shrink-0 text-brand-accent" aria-hidden="true" />
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-text-body/70">{label}</dt>
                <dd className="mt-0.5 text-text-title">{value}</dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex gap-3 rounded-xl bg-brand-light p-4">
          <Lightbulb size={18} className="mt-0.5 flex-shrink-0 text-brand-primary" aria-hidden="true" />
          <p className="text-sm text-text-body leading-relaxed">
            <span className="font-semibold text-brand-primary">{t("netLabels.tip")}: </span>
            {k("tip")}
          </p>
        </div>
      </div>
    </div>
  )
}
