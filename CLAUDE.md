# CLAUDE.md — BitWave Website

## Negocio
BitWave S.A.S. (NIT 901.920.120-1) es una empresa de **soluciones tecnológicas**.
Línea principal del sitio: compra **USDT y USDC** (también BTC) de clientes y entrega COP
(efectivo o transferencia). También es dueña de Tasa Directa (marketplace B2B de PCD).
Redes soportadas: **Polygon, Tron, Solana, Ethereum y más**.
KYC obligatorio + SARLAFT. Puntos físicos en Medellín (Oviedo, Coltejer) y Envigado (Viva).
KYC en producción vía Zabio: https://www.zabio.xyz/i/bitwave (lib/config.ts → zabioUrl).

## Cotizador en vivo
- Fuente principal: **Bitso** par `usdt_cop` (endpoint público, sin API key, tiempo real).
- Respaldo: DolarApi USD (`co.dolarapi.com/v1/cotizaciones`) — OJO: solo refresca pocas
  veces al día, por eso NO se usa como principal.
- Lógica compartida en `lib/tasa.ts` → `getTasa()`: spot − spread = tasaFinal.
- `spread` se lee de Vercel Edge Config key `spread_trm` (default 150); editable en /admin.
- Caché: `fetch` con `revalidate: 1200` (20 min) en Next.js Data Cache.
- Consumido por `app/api/tasa/route.ts` y `components/home/RateDisplay.tsx`.
- Panel admin: `/admin` (fuera de i18n, ver middleware matcher). Sesión HMAC en lib/auth.ts.
- Env vars requeridas en Vercel: EDGE_CONFIG, EDGE_CONFIG_ID, VERCEL_API_TOKEN,
  ADMIN_SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD.

## Stack
- Next.js 16 App Router + TypeScript
- Tailwind CSS v4 (tokens en app/globals.css bajo @theme)
- next-intl: `/` = español, `/en` = inglés
- Blog: archivos MDX en content/blog/
- Deploy: Vercel · Dominio: bitwaveco.com

## Paleta
- Primario: #1a4a2e  Acento/CTA: #2d8a4e  Fondo alterno: #e8f5ee
- Títulos: #1a1a1a  Cuerpo: #4b5563

## Logos e imágenes de marca
- public/logo_nb.png → navbar (grande en desktop: h-[72px]) y footer
- public/logo_bl.png → logo BLANCO para fondos oscuros (logo_nb sobre oscuro da cuadro blanco)
- public/logo.png → alternativa con fondo
- public/usdt.svg / public/usdc.svg → coins en el hero (vectoriales; reemplazables por PNG oficiales)

## Configuración central
- lib/config.ts → WhatsApp, email, nombre legal, NIT, zabioUrl
- lib/locations.ts → 3 sedes con dirección, horario y embed de Google Maps
  - Horarios: Oviedo y Viva → Lun–Vie 8am–7pm, Sáb 9am–4pm; Coltejer → Lun–Vie 8am–5pm,
    Sáb 9am–1pm. Domingos y festivos cerrado (todas).

## Restricciones de copy
- No prometer tasas específicas
- No afirmar que somos entidad vigilada por Superfinanciera
- No lenguaje de inversión
- No servicios de compra de cripto (solo compramos al cliente)

## Estado de fases
- [x] Fase 1: Setup
- [x] Fase 2: Home completo en español
- [x] Fase 3: Blog MDX
- [x] Fase 4: i18n inglés + toggle
- [x] Fase 5: SEO metadata + JSON-LD + llms.txt + hreflang
- [x] Fase 6: QA
- [x] Cotizador en vivo + panel admin + integración Zabio
- Sitio EN PRODUCCIÓN prestando servicio desde jul-2026.
