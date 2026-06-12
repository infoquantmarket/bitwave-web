# CLAUDE.md — BitWave Website

## Negocio
BitWave compra USDT/BTC de clientes y entrega COP (efectivo o transferencia).
KYC obligatorio + SARLAFT. Puntos físicos en Medellín (Oviedo, Coltejer) y Envigado (Viva).

## Stack
- Next.js 15 App Router + TypeScript
- Tailwind CSS v4 (tokens en app/globals.css bajo @theme)
- next-intl: `/` = español, `/en` = inglés
- Blog: archivos MDX en content/blog/
- Deploy: Vercel · Dominio: bitwaveco.com

## Paleta
- Primario: #1a4a2e  Acento/CTA: #2d8a4e  Fondo alterno: #e8f5ee
- Títulos: #1a1a1a  Cuerpo: #4b5563

## Logos
- public/logo_nb.png → navbar (fondo blanco) y footer (con filtro brightness-0 invert)
- public/logo.png → alternativa con fondo

## Configuración central
- lib/config.ts → WhatsApp, email, nombre legal, NIT
- lib/locations.ts → 3 sedes con dirección, horario y embed de Google Maps

## Restricciones de copy
- No prometer tasas específicas
- No afirmar que somos entidad vigilada por Superfinanciera
- No lenguaje de inversión
- No servicios de compra de cripto (solo compramos al cliente)

## Estado de fases
- [x] Fase 1: Setup
- [ ] Fase 2: Home completo en español
- [ ] Fase 3: Blog MDX
- [ ] Fase 4: i18n inglés + toggle
- [ ] Fase 5: SEO metadata + JSON-LD
- [ ] Fase 6: QA
