import Image from "next/image"
import Link from "next/link"

/** Marco común de las páginas del panel (cabecera + contenedor). */
export default function AdminShell({
  children,
  wide = false,
}: {
  children: React.ReactNode
  wide?: boolean
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="BitWave" width={100} height={30} className="h-8 w-auto" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider border-l border-gray-200 pl-3">
              Admin
            </span>
          </div>
          <nav className="flex items-center gap-5 text-sm font-medium">
            <Link href="/admin" className="text-gray-500 hover:text-green-700">
              Cotizador
            </Link>
            <Link href="/admin/blog" className="text-gray-500 hover:text-green-700">
              Blog
            </Link>
          </nav>
        </div>
      </header>
      <main className={`${wide ? "max-w-5xl" : "max-w-4xl"} mx-auto px-6 py-10`}>{children}</main>
    </div>
  )
}
