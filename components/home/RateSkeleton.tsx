export default function RateSkeleton() {
  return (
    <div className="inline-flex flex-col gap-2 bg-brand-light rounded-xl px-5 py-4 animate-pulse">
      <div className="h-3 w-36 bg-gray-200 rounded-full" />
      <div className="h-8 w-44 bg-gray-200 rounded-full" />
      <div className="h-3 w-48 bg-gray-200 rounded-full" />
    </div>
  )
}
