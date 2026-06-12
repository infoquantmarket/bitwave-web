"use client"
import { getWhatsAppUrl } from "@/lib/config"
import { MessageCircle } from "lucide-react"

export default function WhatsAppFloatButton() {
  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#1da851] text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
    >
      <MessageCircle size={26} />
    </a>
  )
}
