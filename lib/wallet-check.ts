import { createHash } from "node:crypto"
import ofac from "@/data/ofac-addresses.json"

export type WalletNetwork = "evm" | "tron" | "solana" | "btc"

export type WalletCheckResult =
  | { status: "invalid" }
  | {
      status: "ok"
      network: WalletNetwork
      ofac: { listed: boolean; assets: string[] }
      reputation:
        | { state: "checked"; flags: string[]; isContract: boolean }
        | { state: "unsupported" }
        | { state: "unavailable" }
      listUpdated: string
    }

const BASE58 = "[1-9A-HJ-NP-Za-km-z]"

export function detectNetwork(raw: string): WalletNetwork | null {
  const v = raw.trim()
  if (/^0x[a-fA-F0-9]{40}$/.test(v)) return "evm"
  if (new RegExp(`^T${BASE58}{33}$`).test(v)) return "tron"
  if (/^(bc1[a-z0-9]{25,60}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})$/.test(v)) return "btc"
  if (new RegExp(`^${BASE58}{32,44}$`).test(v)) return "solana"
  return null
}

const ofacList = ofac.addresses as Record<string, string[]>

export function lookupOfac(address: string, network: WalletNetwork) {
  // Las direcciones EVM no distinguen mayúsculas; las demás sí.
  const assets = ofacList[network === "evm" ? address.toLowerCase() : address] ?? []
  return { listed: assets.length > 0, assets }
}

// Señales de riesgo de GoPlus que se muestran al usuario (el valor "1" significa que aplica).
const GOPLUS_FLAGS = [
  "cybercrime",
  "money_laundering",
  "financial_crime",
  "darkweb_transactions",
  "phishing_activities",
  "stealing_attack",
  "blackmail_activities",
  "sanctioned",
  "mixer",
  "honeypot_related_address",
  "fake_kyc",
  "blacklist_doubt",
  "malicious_mining_activities",
  "fake_token",
  "fake_standard_interface",
  "gas_abuse",
  "reinit",
] as const

const GOPLUS_BASE = "https://api.gopluslabs.io/api/v1"
const GOPLUS_CHAIN: Partial<Record<WalletNetwork, string>> = { evm: "1", tron: "tron" }

let cachedToken: { value: string; expires: number } | null = null

// Con GOPLUS_APP_KEY y GOPLUS_APP_SECRET se usa el token de la cuenta (más cupo); sin ellas se usa el acceso público.
async function goplusHeaders(): Promise<Record<string, string>> {
  const key = process.env.GOPLUS_APP_KEY
  const secret = process.env.GOPLUS_APP_SECRET
  if (!key || !secret) return {}
  if (cachedToken && cachedToken.expires > Date.now() + 60_000) return { Authorization: cachedToken.value }
  const time = Math.floor(Date.now() / 1000)
  const sign = createHash("sha1").update(`${key}${time}${secret}`).digest("hex")
  const res = await fetch(`${GOPLUS_BASE}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_key: key, time, sign }),
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  })
  const json = await res.json()
  const token = json?.result?.access_token as string | undefined
  if (!token) return {}
  cachedToken = { value: token, expires: Date.now() + (Number(json.result.expires_in) || 3600) * 1000 }
  return { Authorization: token }
}

async function lookupReputation(address: string, network: WalletNetwork): Promise<Extract<WalletCheckResult, { status: "ok" }>["reputation"]> {
  const chain = GOPLUS_CHAIN[network]
  if (!chain) return { state: "unsupported" }
  try {
    const res = await fetch(`${GOPLUS_BASE}/address_security/${encodeURIComponent(address)}?chain_id=${chain}`, {
      headers: await goplusHeaders(),
      cache: "no-store", // no se guarda la dirección consultada en ninguna caché
      signal: AbortSignal.timeout(6000),
    })
    const json = await res.json()
    if (json?.code !== 1 || !json.result) return { state: "unavailable" }
    const r = json.result as Record<string, string>
    return {
      state: "checked",
      flags: GOPLUS_FLAGS.filter((f) => r[f] === "1"),
      isContract: r.contract_address === "1",
    }
  } catch {
    return { state: "unavailable" }
  }
}

export async function checkWallet(raw: string): Promise<WalletCheckResult> {
  const address = raw.trim()
  const network = detectNetwork(address)
  if (!network) return { status: "invalid" }
  return {
    status: "ok",
    network,
    ofac: lookupOfac(address, network),
    reputation: await lookupReputation(address, network),
    listUpdated: ofac.updated,
  }
}
