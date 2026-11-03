import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { walletPath } from "@/lib/wallet"
import WalletPage, { buildWalletMetadata } from "@/components/wallet/WalletPage"

// Ruta en inglés: /en/wallet-checker. En español la ruta es /verificador-de-billetera.
export function generateStaticParams() {
  return [{ locale: "en" }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (locale !== "en") return {}
  return buildWalletMetadata("en")
}

export default async function WalletCheckerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== "en") redirect(walletPath("es"))
  return <WalletPage locale="en" />
}
