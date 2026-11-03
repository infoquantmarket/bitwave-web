"use client"
import { useId, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { CheckCircle2, CircleAlert, Info, Loader2, ShieldAlert, ShieldCheck } from "lucide-react"
import type { WalletCheckResult } from "@/lib/wallet-check"

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: "errLimit" | "errGeneric" | "errInvalid" }
  | { kind: "done"; result: Extract<WalletCheckResult, { status: "ok" }> }

const NETWORK_LABEL = { evm: "netEvm", tron: "netTron", solana: "netSolana", btc: "netBtc" } as const

export default function WalletChecker() {
  const t = useTranslations("walletCheck")
  const locale = useLocale()
  const id = useId()
  const [value, setValue] = useState("")
  const [state, setState] = useState<State>({ kind: "idle" })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const address = value.trim()
    if (!address) return
    setState({ kind: "loading" })
    try {
      const res = await fetch("/api/wallet-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      })
      if (res.status === 429) return setState({ kind: "error", message: "errLimit" })
      if (!res.ok) return setState({ kind: "error", message: "errGeneric" })
      const result = (await res.json()) as WalletCheckResult
      if (result.status === "invalid") return setState({ kind: "error", message: "errInvalid" })
      setState({ kind: "done", result })
    } catch {
      setState({ kind: "error", message: "errGeneric" })
    }
  }

  const loading = state.kind === "loading"

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-[0_24px_60px_-24px_rgba(26,74,46,0.35)]">
      <form onSubmit={onSubmit} noValidate>
        <label htmlFor={id} className="block text-sm font-semibold text-text-title">
          {t("label")}
        </label>
        <div className="mt-2 flex flex-col sm:flex-row gap-3">
          <input
            id={id}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t("placeholder")}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            maxLength={128}
            aria-describedby={`${id}-privacy ${id}-result`}
            className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3.5 py-3 font-mono text-sm text-text-title placeholder:text-gray-500 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
          />
          <button
            type="submit"
            disabled={loading || !value.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-accent px-6 py-3 font-bold text-white transition-all hover:bg-brand-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                {t("loading")}
              </>
            ) : (
              <>
                <ShieldCheck size={18} aria-hidden="true" />
                {t("button")}
              </>
            )}
          </button>
        </div>
        <p id={`${id}-privacy`} className="mt-2 text-xs text-text-body">
          {t("privacy")}
        </p>
      </form>

      <div id={`${id}-result`} aria-live="polite" className="mt-5">
        {state.kind === "error" && (
          <div className="flex gap-2.5 rounded-xl bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
            <CircleAlert size={18} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
            <span>{t(state.message)}</span>
          </div>
        )}
        {state.kind === "done" && <Result result={state.result} t={t} locale={locale} />}
      </div>
    </div>
  )
}

function Result({
  result,
  t,
  locale,
}: {
  result: Extract<WalletCheckResult, { status: "ok" }>
  t: ReturnType<typeof useTranslations<"walletCheck">>
  locale: string
}) {
  const rep = result.reputation
  const flagged = rep.state === "checked" && rep.flags.length > 0
  const alert = result.ofac.listed || flagged
  const partial = !alert && rep.state === "unavailable"
  const tone = alert
    ? { box: "bg-red-50 text-red-900", icon: ShieldAlert, title: t("alertTitle"), body: t("alertBody") }
    : partial
      ? { box: "bg-amber-50 text-amber-900", icon: CircleAlert, title: t("partialTitle"), body: t("partialBody") }
      : { box: "bg-brand-light text-brand-primary", icon: CheckCircle2, title: t("clearTitle"), body: t("clearBody") }
  const Icon = tone.icon
  const date = new Date(result.listUpdated).toLocaleDateString(locale === "en" ? "en-US" : "es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })

  const lines: string[] = [t("formatOk", { network: t(NETWORK_LABEL[result.network]) })]
  lines.push(
    result.ofac.listed
      ? t("ofacHit", { assets: result.ofac.assets.join(", ") })
      : t("ofacClear", { date })
  )
  if (rep.state === "checked") {
    lines.push(
      rep.flags.length > 0
        ? t("repFlags", { flags: rep.flags.map((f) => t(`flags.${f}` as "flags.mixer")).join(", ") })
        : t("repClear")
    )
    if (rep.isContract) lines.push(t("contractNote"))
  } else if (rep.state === "unsupported") {
    lines.push(t("repUnsupported"))
  } else {
    lines.push(t("repUnavailable"))
  }
  if (result.network === "btc") lines.push(t("btcNote"))

  return (
    <div>
      <div className={`flex gap-3 rounded-xl px-4 py-4 ${tone.box}`}>
        <Icon size={22} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
        <div>
          <p className="font-bold">{tone.title}</p>
          <p className="mt-1 text-sm leading-relaxed">{tone.body}</p>
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {lines.map((line) => (
          <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-text-body">
            <Info size={16} className="mt-0.5 flex-shrink-0 text-brand-accent" aria-hidden="true" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 border-t border-gray-100 pt-4 text-xs leading-relaxed text-text-body">{t("disclaimer")}</p>
    </div>
  )
}
