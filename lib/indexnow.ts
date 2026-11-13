// IndexNow: avisa a Bing, Yandex y otros buscadores de URLs nuevas o actualizadas.
// Google no lo usa: se entera por el sitemap. La clave es pública por diseño (se verifica con public/<clave>.txt).
import { siteConfig } from "@/lib/config"

const KEY = "fe470c6023a256d202f7e3f8714c8044"

export async function pingIndexNow(paths: string[]): Promise<boolean> {
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(siteConfig.siteUrl).host,
        key: KEY,
        keyLocation: `${siteConfig.siteUrl}/${KEY}.txt`,
        urlList: paths.map((p) => `${siteConfig.siteUrl}${p}`),
      }),
    })
    return res.ok
  } catch {
    return false
  }
}
