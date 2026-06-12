import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"
import createMDX from "@next/mdx"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

// Note: remark/rehype plugins are omitted here because Turbopack (Next.js 16)
// requires serializable options. Blog content is rendered via gray-matter +
// custom renderer, so compiled MDX plugin transforms are not needed.
const withMDX = createMDX({})

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
}

export default withNextIntl(withMDX(nextConfig))
