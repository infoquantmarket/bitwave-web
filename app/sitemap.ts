import { MetadataRoute } from "next"
import { siteConfig } from "@/lib/config"
import { getAllPosts } from "@/lib/blog"
import { locations, locationPath } from "@/lib/locations"

// Fecha del último cambio real de contenido en home y páginas de sede.
// Actualizar SOLO cuando cambie ese contenido (nunca new Date()).
const SITE_CONTENT_UPDATED = new Date("2026-10-29")

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl
  const esPosts = getAllPosts("es")
  const enPosts = getAllPosts("en")
  const latest = (posts: { date: string }[]) =>
    posts.length ? new Date(Math.max(...posts.map((p) => new Date(p.date).getTime()))) : SITE_CONTENT_UPDATED

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: SITE_CONTENT_UPDATED, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/en`, lastModified: SITE_CONTENT_UPDATED, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: latest(esPosts), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/en/blog`, lastModified: latest(enPosts), changeFrequency: "weekly", priority: 0.7 },
  ]

  const locationPages: MetadataRoute.Sitemap = locations.flatMap((loc) => [
    { url: `${base}${locationPath(loc.id, "es")}`, lastModified: SITE_CONTENT_UPDATED, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${base}${locationPath(loc.id, "en")}`, lastModified: SITE_CONTENT_UPDATED, changeFrequency: "monthly" as const, priority: 0.7 },
  ])

  const posts: MetadataRoute.Sitemap = [
    ...esPosts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...enPosts.map((post) => ({
      url: `${base}/en/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]

  return [...staticPages, ...locationPages, ...posts]
}
