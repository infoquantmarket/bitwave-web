import { createHmac } from "crypto"

const SECRET = process.env.ADMIN_SESSION_SECRET ?? "bw-dev-secret-change-in-production"

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "info@bitwave.com"
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Elzorro123"

export function createSessionToken(): string {
  const ts = Date.now().toString()
  const sig = createHmac("sha256", SECRET).update(ts).digest("hex")
  return `${ts}.${sig}`
}

export function validateSessionToken(token: string): boolean {
  try {
    const [ts, sig] = token.split(".")
    if (!ts || !sig) return false
    if (Date.now() - parseInt(ts) > 86_400_000) return false // 24h expiry
    const expected = createHmac("sha256", SECRET).update(ts).digest("hex")
    return expected === sig
  } catch {
    return false
  }
}
