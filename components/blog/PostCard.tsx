import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock } from "lucide-react"
import type { PostMeta } from "@/lib/blog"

interface PostCardProps {
  post: PostMeta
  locale: string
}

export default function PostCard({ post, locale }: PostCardProps) {
  const blogPath = locale === "en" ? `/en/blog/${post.slug}` : `/blog/${post.slug}`
  const dateStr = new Date(post.date).toLocaleDateString(
    locale === "en" ? "en-US" : "es-CO",
    { year: "numeric", month: "short", day: "numeric" }
  )

  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      <div className="relative h-48 bg-brand-light">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 text-xs text-text-body mb-3">
          <span className="flex items-center gap-1">
            <Calendar size={12} aria-hidden="true" />
            <time dateTime={post.date}>{dateStr}</time>
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} aria-hidden="true" />
            {post.readTime}
          </span>
        </div>
        <h3 className="font-bold text-text-title mb-2 leading-snug line-clamp-2">{post.title}</h3>
        <p className="text-sm text-text-body leading-relaxed flex-1 line-clamp-3">{post.excerpt}</p>
        <Link
          href={blogPath}
          className="mt-4 text-sm font-semibold text-brand-accent hover:text-brand-primary transition-colors"
          aria-label={`Leer más sobre ${post.title}`}
        >
          {locale === "en" ? "Read more" : "Leer más"} →
        </Link>
      </div>
    </article>
  )
}
