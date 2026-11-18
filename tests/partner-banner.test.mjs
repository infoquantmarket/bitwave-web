// Prueba del banner de Nutifinanzas. Ejecutar: npm test  (Node 22.18+/24 lee .ts directamente)
import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { NUTIFINANZAS_URL, NUTIFINANZAS_REL, nutifinanzasBanner } from "../lib/partners.ts"

const root = path.resolve(import.meta.dirname, "..")
const read = (p) => fs.readFileSync(path.join(root, p), "utf8")
const walk = (dir) =>
  fs.existsSync(path.join(root, dir))
    ? fs.readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]
      )
    : []

test("el enlace abre nutifinanzas.com con los UTM acordados", () => {
  const url = new URL(NUTIFINANZAS_URL)
  assert.equal(url.hostname, "nutifinanzas.com")
  assert.equal(url.searchParams.get("utm_source"), "bitwave")
  assert.equal(url.searchParams.get("utm_medium"), "referral")
  assert.equal(url.searchParams.get("utm_campaign"), "aliado-nutifinanzas")
  assert.equal(url.searchParams.get("utm_content"), "home")
  assert.match(NUTIFINANZAS_REL, /noopener/)
  assert.match(read("components/ui/PartnerLink.tsx"), /target="_blank"/)
})

test("el aviso de empresa independiente está en ambos idiomas y marcado para revisión legal", () => {
  assert.match(nutifinanzasBanner.es.legal, /empresa independiente de BitWave/)
  assert.match(nutifinanzasBanner.en.legal, /independent of BitWave/)
  assert.match(read("lib/partners.ts"), /PENDIENTE_LEGAL/)
  assert.ok(nutifinanzasBanner.es.label && nutifinanzasBanner.en.label)
})

test("el banner no usa tasas, precios ni frases prohibidas", () => {
  const forbidden = /remesa|zelle|giro|transferencia internacional|somos banco|100 ?% online|sin documentos|casa de cambio|garantizada|mejor tasa|inversi[oó]n|ganancia/i
  for (const lang of ["es", "en"]) {
    for (const text of Object.values(nutifinanzasBanner[lang])) assert.doesNotMatch(text, forbidden)
  }
})

test("el banner solo está en el home: no en el cotizador, las tasas, el menú, el schema ni llms.txt", () => {
  const home = read("app/[locale]/page.tsx")
  assert.equal((home.match(/<PartnerBanner\s*\/>/g) ?? []).length, 1)

  const mustNotUse = [
    "components/home/RateDisplay.tsx",
    "components/home/HeroSection.tsx",
    "components/layout/Navbar.tsx",
    "app/[locale]/layout.tsx",
    ...walk("components/rate"),
    ...walk("app/[locale]/tasa-de-compra"),
    ...walk("app/[locale]/usdt-cop-rate"),
  ].filter((p) => fs.existsSync(path.join(root, p)))
  for (const file of mustNotUse) {
    assert.doesNotMatch(read(file), /PartnerBanner|nutifinanzas\.com|lib\/partners/i, `${file} no debe incluir el banner`)
  }
  assert.doesNotMatch(read("public/llms.txt"), /nutifinanzas\.com/i)
})
