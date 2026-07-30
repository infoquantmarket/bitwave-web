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
- Env vars en Vercel (Production + Preview), TODAS configuradas: EDGE_CONFIG, EDGE_CONFIG_ID,
  VERCEL_API_TOKEN, ADMIN_SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD. lib/auth.ts tiene
  defaults de fallback en el código (solo se usan si la env var no existe — en producción
  siempre existe, así que el fallback es solo por si se corre local sin .env).
  Credenciales de /admin: NO están en este repo ni en memoria — solo en Vercel env vars
  (marcadas "Sensitive", no se pueden volver a leer ni desde la CLI). Si se pierden, se
  rotan con `vercel env rm ADMIN_PASSWORD production/preview` + `vercel env add ...` +
  `vercel deploy --prod` (los env vars no aplican a un build ya existente, hace falta
  redeploy).

## Stack
- Next.js 16 App Router + TypeScript
- Tailwind CSS v4 (tokens en app/globals.css bajo @theme)
- next-intl: `/` = español, `/en` = inglés
- Blog: archivos MDX en content/blog/
- Deploy: Vercel · Dominio: bitwaveco.com

## Deploy y operación
- Repo: github.com/infoquantmarket/bitwave-web (push a `main` = auto-deploy en Vercel, no
  hace falta CLI para esto).
- Proyecto Vercel: `quant-market-s-projects/bitwave-web` (org `infoquantmarket-2088`).
- La carpeta local ya está vinculada (`vercel link`, genera `.vercel/` gitignoreado). La
  CLI de Vercel queda autenticada con sesión propia del usuario — NO se necesita ni se debe
  pedir un token manual para nada (ver nota de seguridad abajo).
- Para cambios que solo tocan env vars (sin cambio de código): usar `vercel deploy --prod`
  directo, no hace falta un commit vacío.
- **Nota de seguridad histórica:** en una sesión anterior el usuario compartió un
  VERCEL_API_TOKEN por chat (necesario en ese momento porque la CLI no estaba vinculada
  aún). Ya no es necesario pedir tokens así — la CLI vinculada cubre todo lo operativo.
  Si en algún momento hace falta el `VERCEL_API_TOKEN` como env var (lo usa /admin para
  escribir en Edge Config vía API REST, es un uso distinto al de la CLI), pedir al usuario
  que lo genere él mismo desde Vercel → Account Settings → Tokens y lo pegue directo en
  `vercel env add`, nunca por chat.
- public/images/hero.png es en realidad un JPEG con extensión .png (bug menor preexistente,
  no roto pero inconsistente — no se usa ya en metadatos OG/Twitter, solo como imagen normal
  del hero vía next/image que sí sniffea el contenido real).

## Paleta
- Primario: #1a4a2e  Acento/CTA: #2d8a4e  Fondo alterno: #e8f5ee
- Títulos: #1a1a1a  Cuerpo: #4b5563

## Logos e imágenes de marca
- public/logo_nb.png → navbar (grande en desktop: h-[72px]) y footer
- public/logo_bl.png → logo BLANCO para fondos oscuros (logo_nb sobre oscuro da cuadro blanco);
  también se usa embebido (base64, vía lib/og-image.tsx) en la tarjeta social generada
- public/logo.png → alternativa con fondo; fuente del recorte del ícono (símbolo "b" solo)
  usado en app/favicon.ico y app/icon.png
- public/usdt.svg / public/usdc.svg → coins en el hero (vectoriales; reemplazables por PNG oficiales)
- app/favicon.ico (16/32/48px) + app/icon.png (512px) → ícono de marca BitWave. OJO: el
  proyecto arrancó con el triángulo default de Next.js/Vercel en favicon.ico durante meses
  sin que nadie lo notara — si algún día vuelve a verse un ícono genérico en las pestañas,
  es porque algo pisó estos archivos.
- app/[locale]/opengraph-image.tsx y twitter-image.tsx → tarjeta social 1200×630 generada
  en código (next/og ImageResponse, NO es una imagen estática), con textos ES/EN según
  locale. Lógica compartida en lib/og-image.tsx (buildOgImage). Para cambiar el diseño de
  la tarjeta se edita ese archivo, no hay que regenerar imágenes a mano.

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
