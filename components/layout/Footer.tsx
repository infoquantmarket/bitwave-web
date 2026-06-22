import Image from "next/image"
import Link from "next/link"
import { getTranslations } from "next-intl/server"
import { siteConfig } from "@/lib/config"
import { locations } from "@/lib/locations"
import { Mail, MapPin } from "lucide-react"

export default async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations("footer")
  const nav = await getTranslations("nav")
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brand-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <Image
              src="/logo_nb.png"
              alt="BitWave"
              width={28}
              height={28}
              className="w-7 h-7 object-contain brightness-0 invert"
            />
            <span className="text-white font-bold text-base">BitWave</span>
          </div>
          <p className="text-xs text-white/70 leading-relaxed">Cambia USDT por pesos colombianos con respaldo legal.</p>
          <div className="mt-2 text-xs text-white/50">
            <p>{siteConfig.companyName}</p>
            <p>NIT: {siteConfig.nit}</p>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-3">{t("links")}</h3>
          <ul className="space-y-1.5 text-xs text-white/80">
            {[
              { label: nav("howItWorks"), href: "#como-funciona" },
              { label: nav("locations"), href: "#ubicaciones" },
              { label: nav("blog"), href: `${locale === "en" ? "/en" : ""}/blog` },
              { label: nav("faq"), href: "#faq" },
              { label: nav("contact"), href: "#contacto" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-3">{t("locationsTitle")}</h3>
          <ul className="space-y-2 text-xs text-white/80">
            {locations.map((loc) => (
              <li key={loc.id} className="flex gap-1.5">
                <MapPin size={12} className="mt-0.5 flex-shrink-0 text-brand-accent" />
                <span>
                  <span className="font-medium text-white">{loc.name}</span>
                  <br />
                  {loc.address}, {loc.city}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Image
            src="/logo_nb.png"
            alt="BitWave"
            width={120}
            height={34}
            className="h-auto brightness-0 invert mb-2"
            style={{ width: "auto", maxWidth: "100%" }}
          />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-3">{t("contactTitle")}</h3>
          <a
            href={`mailto:${siteConfig.email}`}
            className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors"
          >
            <Mail size={12} />
            {siteConfig.email}
          </a>
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-white/40 leading-relaxed">{t("disclaimer")}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-3 text-center text-xs text-white/40">
        © {year} {siteConfig.companyName} · {t("rights")}
      </div>
    </footer>
  )
}
