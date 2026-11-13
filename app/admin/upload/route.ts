// Sube la portada de un post: la comprime a WebP (máx. 1600 px de ancho) y la guarda en Vercel Blob.
// Vive bajo /admin para que le llegue la cookie de sesión (path=/admin).
import sharp from "sharp"
import { isAdmin } from "@/lib/admin-guard"
import { blobConfigured, uploadCover } from "@/lib/blog-store"

export const runtime = "nodejs"

const MAX_BYTES = 4 * 1024 * 1024 // límite de cuerpo de Vercel Functions: 4,5 MB

export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "No autorizado." }, { status: 401 })
  if (!blobConfigured()) return Response.json({ error: "Falta conectar Vercel Blob al proyecto." }, { status: 503 })

  const form = await req.formData()
  const file = form.get("file")
  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    return Response.json({ error: "Selecciona una imagen." }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "La imagen pesa más de 4 MB. Redúcela e intenta de nuevo." }, { status: 413 })
  }

  try {
    const out = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer()
    const base =
      String(form.get("slug") ?? "")
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
        .slice(0, 60) || "portada"
    return Response.json({ url: await uploadCover(out, base) })
  } catch (e) {
    console.error("upload portada:", e)
    return Response.json({ error: "No se pudo procesar o guardar la imagen." }, { status: 500 })
  }
}
