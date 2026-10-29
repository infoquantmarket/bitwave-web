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
  async redirects() {
    return [
      {
        // El post trata de vender USDT; el slug "buy" se renombró a "sell".
        source: "/en/blog/buy-usdt-medellin-tourists-guide",
        destination: "/en/blog/sell-usdt-medellin-tourists-guide",
        permanent: true,
      },
    ]
  },
}

export default withNextIntl(withMDX(nextConfig))
