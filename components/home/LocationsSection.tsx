"use client"
import { useTranslations } from "next-intl"
import { locations } from "@/lib/locations"
import { MapPin, Clock, ExternalLink } from "lucide-react"
import { useState } from "react"

export default function LocationsSection() {
  const t = useTranslations("locations")
  const [selected, setSelected] = useState(0)

  return (
    <section id="ubicaciones" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-title">{t("title")}</h2>
          <p className="mt-3 text-text-body">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {locations.map((loc, idx) => (
            <div
              key={loc.id}
              className={`border rounded-2xl p-6 shadow-sm cursor-pointer transition-all ${
                selected === idx
                  ? "border-brand-accent bg-brand-light"
                  : "border-gray-100 hover:shadow-md"
              }`}
              onClick={() => setSelected(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setSelected(idx)}
              aria-pressed={selected === idx}
            >
              <h3 className="font-bold text-text-title text-lg mb-1">{loc.name}</h3>
              <p className="text-sm text-brand-accent font-bold mb-2">{loc.local}</p>
              <div className="flex items-start gap-2 text-sm text-text-body mb-2">
                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-brand-accent" />
                <span>{loc.address}, {loc.city}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-body mb-5">
                <Clock size={14} className="text-brand-accent" />
                <span>{loc.hours}</span>
              </div>
              <a
                href={loc.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-accent hover:text-brand-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {t("directions")}
                <ExternalLink size={13} />
              </a>
            </div>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-56 sm:h-72 md:h-80">
          <iframe
            key={selected}
            src={locations[selected].embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${t("mapTitle")} ${locations[selected].name}`}
          />
        </div>
      </div>
    </section>
  )
}
