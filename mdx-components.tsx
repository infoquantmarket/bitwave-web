// mdx-components.tsx
import type { MDXComponents } from "mdx/types"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold text-text-title mt-8 mb-3">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-text-title mt-6 mb-2">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="text-text-body leading-relaxed mb-4">{children}</p>
    ),
    a: ({ href, children }) => (
      <a href={href} className="text-brand-accent underline hover:text-brand-primary transition-colors">
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside space-y-1 mb-4 text-text-body">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside space-y-1 mb-4 text-text-body">{children}</ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    strong: ({ children }) => <strong className="font-semibold text-text-title">{children}</strong>,
    ...components,
  }
}
