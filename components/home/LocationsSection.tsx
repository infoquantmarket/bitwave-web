import { getTranslations } from "next-intl/server"
import { locations } from "@/lib/locations"
import { MapPin, Clock, ExternalLink } from "lucide-react"

export default async function LocationsSection() {
  const t = await getTranslations("locations")

  return (
    <section id="ubicaciones" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-title">{t("title")}</h2>
          <p className="mt-3 text-text-body">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-bold text-text-title text-lg mb-1">{loc.name}</h3>
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
              >
                {t("directions")}
                <ExternalLink size={13} />
              </a>
            </div>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-64 md:h-80">
          <iframe
            src={locations[0].embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Mapa ${locations[0].name}`}
          />
        </div>
      </div>
    </section>
  )
}
