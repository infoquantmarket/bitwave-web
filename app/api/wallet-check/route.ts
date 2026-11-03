import { NextResponse } from "next/server"
import { checkWallet } from "@/lib/wallet-check"

// Límite simple por IP (en memoria de la instancia): 20 consultas por minuto.
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 20
const hits = new Map<string, { count: number; reset: number }>()

function limited(ip: string): boolean {
  const now = Date.now()
  if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k)
  const entry = hits.get(ip)
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS })
    return false
  }
  entry.count += 1
  return entry.count > MAX_PER_WINDOW
}

// Nunca se registran ni se guardan las direcciones consultadas.
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  if (limited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 })
  }

  let address: unknown
  try {
    address = (await request.json())?.address
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }
  if (typeof address !== "string" || address.length === 0 || address.length > 128) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }

  const result = await checkWallet(address)
  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } })
}
