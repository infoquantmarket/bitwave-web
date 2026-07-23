import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Image from "next/image"
import { createSessionToken, validateSessionToken, ADMIN_EMAIL, ADMIN_PASSWORD } from "@/lib/auth"

export const dynamic = "force-dynamic"

async function getAuth() {
  const store = await cookies()
  const token = store.get("bw_admin")?.value
  return token ? validateSessionToken(token) : false
}

async function getCurrentSpread(): Promise<number> {
  try {
    const { get } = await import("@vercel/edge-config")
    return (await get<number>("spread_trm")) ?? 150
  } catch {
    return 150
  }
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>
}) {
  const params = await searchParams
  const isAuth = await getAuth()

  // ── Server Actions ──────────────────────────────────────────────────────────

  async function login(formData: FormData) {
    "use server"
    const email = (formData.get("email") as string)?.trim().toLowerCase()
    const pw = formData.get("password") as string

    if (email === ADMIN_EMAIL.toLowerCase() && pw === ADMIN_PASSWORD) {
      const store = await cookies()
      store.set("bw_admin", createSessionToken(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/admin",
        maxAge: 86400,
      })
      redirect("/admin")
    }
    redirect("/admin?error=credentials")
  }

  async function logout() {
    "use server"
    const store = await cookies()
    store.delete("bw_admin")
    redirect("/admin")
  }

  async function updateSpread(formData: FormData) {
    "use server"
    const store = await cookies()
    const token = store.get("bw_admin")?.value
    if (!token || !validateSessionToken(token)) redirect("/admin")

    const raw = formData.get("spread") as string
    const value = parseInt(raw, 10)
    if (isNaN(value) || value < 0 || value > 9999) redirect("/admin?error=spread")

    const edgeConfigId = process.env.EDGE_CONFIG_ID
    const vercelToken = process.env.VERCEL_API_TOKEN

    if (!edgeConfigId || !vercelToken) {
      console.error("EDGE_CONFIG_ID or VERCEL_API_TOKEN not set")
      redirect("/admin?error=config")
    }

    const res = await fetch(
      `https://api.vercel.com/v1/edge-config/${edgeConfigId}/items`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${vercelToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [{ operation: "upsert", key: "spread_trm", value }],
        }),
      }
    )

    redirect(res.ok ? "/admin?saved=1" : "/admin?error=save")
  }

  // ── Login View ──────────────────────────────────────────────────────────────
  if (!isAuth) {
    const hasError = params.error === "credentials"
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <div className="flex justify-center mb-6">
            <Image src="/logo.png" alt="BitWave" width={120} height={36} className="h-9 w-auto" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 text-center mb-1">Panel de administración</h1>
          <p className="text-sm text-gray-500 text-center mb-7">Acceso restringido a BitWave</p>

          {hasError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
              Credenciales incorrectas. Intenta de nuevo.
            </div>
          )}

          <form action={login} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Correo electrónico</label>
              <input
                name="email"
                type="email"
                required
                placeholder="info@bitwave.com"
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Contraseña</label>
              <input
                name="password"
                type="password"
                required
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
              />
            </div>
            <button
              type="submit"
              className="mt-2 w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ── Admin Panel ─────────────────────────────────────────────────────────────
  const currentSpread = await getCurrentSpread()
  const saved = params.saved === "1"
  const hasError = !!params.error && params.error !== "credentials"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="BitWave" width={100} height={30} className="h-8 w-auto" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider border-l border-gray-200 pl-3">
              Admin
            </span>
          </div>
          <form action={logout}>
            <button type="submit" className="text-xs text-gray-500 hover:text-red-600 transition-colors font-medium">
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Panel de administración</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona los parámetros de cotización en tiempo real.</p>
        </div>

        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-xl px-5 py-3.5 flex items-center gap-2">
            <span className="text-green-600">✓</span> Spread actualizado correctamente en Edge Config.
          </div>
        )}
        {hasError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-5 py-3.5">
            {params.error === "config"
              ? "Error: variables de entorno EDGE_CONFIG_ID o VERCEL_API_TOKEN no configuradas."
              : params.error === "spread"
              ? "Error: el valor del spread es inválido (debe ser entre 0 y 9999)."
              : "Error al actualizar Edge Config. Verifica el token y el ID."}
          </div>
        )}

        {/* Spread Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-800">Spread de cotización</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Tasa final = Precio Spot DolarApi − Spread
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-0.5">Valor actual</p>
              <p className="text-3xl font-bold text-green-700">{currentSpread.toLocaleString("es-CO")}</p>
              <p className="text-xs text-gray-400">COP / USDT</p>
            </div>
          </div>

          {/* Visual example */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-600 space-y-1.5">
            <p className="font-medium text-gray-700 mb-2">Ejemplo con valores actuales:</p>
            <div className="flex justify-between">
              <span>Precio Spot USD/COP</span>
              <span className="font-mono font-medium">$4.200 COP</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>− Spread actual</span>
              <span className="font-mono font-medium">− {currentSpread.toLocaleString("es-CO")}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-1.5 font-bold text-green-700">
              <span>= Tasa de compra cliente</span>
              <span className="font-mono">≈ ${(4200 - currentSpread).toLocaleString("es-CO")} COP</span>
            </div>
          </div>

          <form action={updateSpread} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Nuevo spread (COP)
              </label>
              <input
                name="spread"
                type="number"
                min="0"
                max="9999"
                defaultValue={currentSpread}
                required
                className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 font-mono"
              />
            </div>
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm whitespace-nowrap"
            >
              Guardar cambios
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Cómo funciona la cotización</h3>
          <ul className="text-sm text-blue-700 space-y-1.5 list-disc list-inside">
            <li>El precio spot se obtiene de <strong>DolarApi Colombia</strong> (Investing.com).</li>
            <li>Se actualiza automáticamente cada <strong>20 minutos</strong> vía caché de Next.js.</li>
            <li>El spread se lee desde <strong>Vercel Edge Config</strong> en cada request.</li>
            <li>El cambio de spread es <strong>inmediato</strong> — no requiere nuevo deploy.</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
