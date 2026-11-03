import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { walletPath } from "@/lib/wallet"
import WalletPage, { buildWalletMetadata } from "@/components/wallet/WalletPage"

// Ruta en español: /verificador-de-billetera. En inglés la ruta es /en/wallet-checker.
export function generateStaticParams() {
  return [{ locale: "es" }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (locale !== "es") return {}
  return buildWalletMetadata("es")
}

export default async function VerificadorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (locale !== "es") redirect(walletPath("en"))
  return <WalletPage locale="es" />
}
