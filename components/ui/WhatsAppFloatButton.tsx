"use client"
import { getWhatsAppUrl } from "@/lib/config"
import { MessageCircle } from "lucide-react"
import { useState } from "react"

export default function WhatsAppFloatButton() {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-whatsapp hover:bg-whatsapp-hover text-white rounded-full shadow-lg transition-all duration-300"
      style={{ padding: hovered ? "14px 20px 14px 20px" : "14px" }}
    >
      <MessageCircle size={26} aria-hidden="true" className="flex-shrink-0" />
      <span
        className="text-sm font-semibold whitespace-nowrap overflow-hidden transition-all duration-300"
        style={{ maxWidth: hovered ? "120px" : "0px", opacity: hovered ? 1 : 0 }}
      >
        Consúltanos
      </span>
    </a>
  )
}
