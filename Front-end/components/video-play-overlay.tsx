import { Play } from "lucide-react"

export function VideoPlayOverlay({ compact = false }: { compact?: boolean }) {
  return (
    <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/25 group-focus-visible:bg-black/25">
      <span
        className={`flex items-center justify-center rounded-full border-2 border-rafam-yellow bg-rafam-blue text-rafam-yellow shadow-md ${
          compact ? "h-10 w-10" : "h-14 w-14"
        }`}
      >
        <Play className={`ml-0.5 fill-current ${compact ? "h-5 w-5" : "h-7 w-7"}`} aria-hidden="true" />
      </span>
    </span>
  )
}
