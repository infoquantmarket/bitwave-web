import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { validateSessionToken } from "@/lib/auth"

export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get("bw_admin")?.value
  return token ? validateSessionToken(token) : false
}

/** Para páginas y server actions del panel: sin sesión válida, vuelve al login. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin")
}
