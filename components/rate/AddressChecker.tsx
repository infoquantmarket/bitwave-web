"use client"
import { useId, useState } from "react"
import { useTranslations } from "next-intl"
import { CheckCircle2, CircleAlert, ShieldCheck } from "lucide-react"

type Kind = "empty" | "evm" | "tron" | "solana" | "btc" | "unknown"

const BASE58 = "[1-9A-HJ-NP-Za-km-z]"

function detect(raw: string): Kind {
  const v = raw.trim()
  if (!v) return "empty"
  if (/^0x[a-fA-F0-9]{40}$/.test(v)) return "evm"
  if (new RegExp(`^T${BASE58}{33}$`).test(v)) return "tron"
  if (/^(bc1[a-z0-9]{25,60}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})$/.test(v)) return "btc"
  if (new RegExp(`^${BASE58}{32,44}$`).test(v)) return "solana"
  return "unknown"
}

export default function AddressChecker() {
  const t = useTranslations("ratePage")
  const id = useId()
  const [value, setValue] = useState("")
  const kind = detect(value)

  const message: Record<Kind, string> = {
    empty: t("checkEmpty"),
    evm: t("checkEvm"),
    tron: t("checkTron"),
    solana: t("checkSolana"),
    btc: t("checkBtc"),
    unknown: t("checkUnknown"),
  }
  const ok = kind !== "empty" && kind !== "unknown"

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_8px_30px_-16px_rgba(26,74,46,0.25)]">
      <div className="flex items-center gap-2.5">
        <ShieldCheck size={20} className="text-brand-accent" aria-hidden="true" />
        <h3 className="text-lg font-bold text-text-title">{t("checkTitle")}</h3>
      </div>
      <p className="mt-2 text-sm text-text-body leading-relaxed">{t("checkBody")}</p>

      <label htmlFor={id} className="mt-5 block text-sm font-semibold text-text-title">
        {t("checkLabel")}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t("checkPlaceholder")}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-describedby={`${id}-help ${id}-result`}
        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-3 font-mono text-sm text-text-title placeholder:text-gray-500 focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
      />
      <p id={`${id}-help`} className="mt-2 text-xs text-text-body">
        {t("checkHelp")}
      </p>

      <div
        id={`${id}-result`}
        aria-live="polite"
        className={`mt-4 flex gap-2.5 rounded-xl px-4 py-3 text-sm leading-relaxed ${
          ok
            ? "bg-brand-light text-brand-primary"
            : kind === "unknown"
              ? "bg-amber-50 text-amber-900"
              : "bg-gray-50 text-text-body"
        }`}
      >
        {ok ? (
          <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
        ) : kind === "unknown" ? (
          <CircleAlert size={18} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
        ) : null}
        <span>{message[kind]}</span>
      </div>
      {kind !== "empty" && <p className="mt-3 text-xs text-text-body">{t("checkWarn")}</p>}
    </div>
  )
}
