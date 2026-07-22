import qrcode from "qrcode"

export default async function QrCode({
  value,
  size = 180,
  className,
}: {
  value: string
  size?: number
  className?: string
}) {
  const svg = await qrcode.toString(value, {
    type: "svg",
    width: size,
    margin: 1,
    color: { dark: "#132d1e", light: "#ffffff" },
  })
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
