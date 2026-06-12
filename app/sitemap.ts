import { MetadataRoute } from "next"
import { siteConfig } from "@/lib/config"
import { getAllPosts } from "@/lib/blog"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl

  // Rutas estáticas ES (sin prefijo)
  const staticES = ["/", "/blog"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1.0 : 0.8,
  }))

  // Rutas estáticas EN
  const staticEN = ["/en", "/en/blog"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "/en" ? 0.9 : 0.7,
  }))

  // Posts ES
  const esPosts = getAllPosts("es").map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  // Posts EN
  const enPosts = getAllPosts("en").map((post) => ({
    url: `${base}/en/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...staticES, ...staticEN, ...esPosts, ...enPosts]
}
