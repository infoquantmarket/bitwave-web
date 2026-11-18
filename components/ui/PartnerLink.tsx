"use client"
import { track } from "@vercel/analytics"
import { PARTNER_CLICK_EVENT } from "@/lib/partners"

/** Enlace saliente a un aliado; registra el clic con Vercel Analytics (sin cookies). */
export default function PartnerLink({
  href,
  rel,
  className,
  children,
}: {
  href: string
  rel: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel={rel}
      className={className}
      onClick={() => track(PARTNER_CLICK_EVENT.name, PARTNER_CLICK_EVENT.props)}
    >
      {children}
    </a>
  )
}
