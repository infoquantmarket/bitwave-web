import Link from "next/link"
import { getLocale, getTranslations } from "next-intl/server"
import { ArrowRight, ShieldCheck } from "lucide-react"
import { walletPath } from "@/lib/wallet"
import WalletChecker from "@/components/wallet/WalletChecker"

export default async function WalletCheckSection() {
  const t = await getTranslations("walletHome")
  const locale = await getLocale()

  return (
    <section id="verificador" className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-brand-light">
      <div className="max-w-4xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-accent">
          <ShieldCheck size={14} aria-hidden="true" />
          {t("badge")}
        </span>
        <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-text-title tracking-tight">{t("title")}</h2>
        <p className="mt-3 text-text-body leading-relaxed max-w-2xl">{t("sub")}</p>
        <div className="mt-6">
          <WalletChecker />
        </div>
        <Link
          href={walletPath(locale)}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:text-brand-accent"
        >
          {t("more")}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
