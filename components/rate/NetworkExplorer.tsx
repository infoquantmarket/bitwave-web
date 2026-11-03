"use client"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Coins, Gauge, Layers, Lightbulb, ScanLine, Target } from "lucide-react"
import { networks, type CostLevel, type NetworkId } from "@/lib/rate"

const costStyle: Record<CostLevel, string> = {
  low: "bg-brand-light text-brand-primary",
  mid: "bg-amber-50 text-amber-800",
  variable: "bg-amber-50 text-amber-800",
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
    <div className="space-y-3">
      <div role="tablist" aria-label={t("netTitle")} className="flex flex-wrap gap-1.5 sm:gap-2">
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
              className={`inline-flex items-center gap-2 rounded-full border px-3 sm:px-3.5 py-1.5 text-sm font-semibold transition-all active:scale-[0.98] ${
                selected
                  ? "border-brand-accent bg-brand-accent text-white shadow-sm"
                  : "border-gray-200 bg-white text-text-title hover:border-brand-accent/50"
              }`}
            >
              {t(`net.${n.id}.name` as "net.polygon.name")}
              <span
                aria-hidden="true"
                className={`hidden sm:block h-2 w-2 rounded-full ${
                  n.costLevel === "low" ? (selected ? "bg-white" : "bg-brand-accent") : "bg-amber-400"
                }`}
              />
            </button>
          )
        })}
      </div>

      <div
        key={active}
        role="tabpanel"
        id="net-panel"
        aria-labelledby={`net-tab-${active}`}
        className="panel-in rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-[0_8px_30px_-16px_rgba(26,74,46,0.25)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-text-title">{k("name")}</h3>
          <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${costStyle[current.costLevel]}`}>
            {t(`costLevels.${current.costLevel}` as "costLevels.low")}
          </span>
        </div>
        <p className="mt-2 text-sm text-text-body leading-relaxed">
          <span className="font-semibold text-text-title">{t("netLabels.cost")}: </span>
          {k("cost")}
        </p>

        <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex gap-2.5">
              <Icon size={15} className="mt-0.5 flex-shrink-0 text-brand-accent" aria-hidden="true" />
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-body/70">{label}</dt>
                <dd className="text-text-title">{value}</dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex gap-2.5 rounded-xl bg-brand-light p-3">
          <Lightbulb size={15} className="mt-0.5 flex-shrink-0 text-brand-primary" aria-hidden="true" />
          <p className="text-[13px] text-text-body leading-relaxed">
            <span className="font-semibold text-brand-primary">{t("netLabels.tip")}: </span>
            {k("tip")}
          </p>
        </div>
      </div>
    </div>
  )
}
