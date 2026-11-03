// Descarga la lista SDN de OFAC (Tesoro de EE. UU.) y guarda solo las direcciones
// cripto en data/ofac-addresses.json. Uso: node scripts/update-ofac.mjs [--if-older-than=DIAS]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const SOURCE = "https://sanctionslistservice.ofac.treas.gov/api/PublicationPreview/exports/SDN.XML"
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../data/ofac-addresses.json")
const MIN_EXPECTED = 700 // si baja de aquí, la descarga está dañada: no se sobrescribe nada

const olderThan = process.argv.find((a) => a.startsWith("--if-older-than="))?.split("=")[1]
const previous = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : null

if (olderThan && previous) {
  const ageDays = (Date.now() - new Date(previous.updated).getTime()) / 86_400_000
  if (ageDays < Number(olderThan)) {
    console.log(`Lista actualizada hace ${ageDays.toFixed(1)} días (< ${olderThan}). Nada que hacer.`)
    process.exit(0)
  }
}

const res = await fetch(SOURCE)
if (!res.ok) throw new Error(`OFAC respondió ${res.status}`)
const xml = await res.text()

// El CSV de OFAC trunca los textos largos y deja direcciones incompletas; el XML las trae completas.
const pattern = /<idType>Digital Currency Address - ([A-Z0-9]+)<\/idType>\s*<idNumber>([^<]+)<\/idNumber>/g
const addresses = {}
for (const [, asset, raw] of xml.matchAll(pattern)) {
  const address = raw.trim()
  // Las direcciones EVM no distinguen mayúsculas: se guardan en minúsculas
  const key = /^0x[0-9a-fA-F]{40}$/.test(address) ? address.toLowerCase() : address
  addresses[key] ??= []
  if (!addresses[key].includes(asset)) addresses[key].push(asset)
}

const count = Object.keys(addresses).length
if (count < MIN_EXPECTED) {
  throw new Error(`Solo se encontraron ${count} direcciones (mínimo esperado ${MIN_EXPECTED}). No se guarda.`)
}

const sorted = Object.fromEntries(Object.entries(addresses).sort(([a], [b]) => a.localeCompare(b)))
mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(
  OUT,
  JSON.stringify({ source: "OFAC SDN List", updated: new Date().toISOString().slice(0, 10), count, addresses: sorted }, null, 1) + "\n"
)
console.log(`OFAC: ${count} direcciones guardadas en data/ofac-addresses.json`)
