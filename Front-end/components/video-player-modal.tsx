"use client"

import { useEffect, useRef } from "react"
import { Maximize2 } from "lucide-react"
import { getPlayableVideo } from "@/lib/video-url"

interface VideoPlayerModalProps {
  open: boolean
  title: string
  url: string
  onClose: () => void
}

export function VideoPlayerModal({ open, title, url, onClose }: VideoPlayerModalProps) {
  const playerRef = useRef<HTMLDivElement>(null)
  const playable = getPlayableVideo(url)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      if (document.fullscreenElement) {
        void document.exitFullscreen()
        return
      }
      onClose()
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open) return null

  const toggleFullscreen = async () => {
    const el = playerRef.current
    if (!el) return
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await el.requestFullscreen()
      }
    } catch (error) {
      console.error("No se pudo activar pantalla completa:", error)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-player-title"
    >
      <section className="relative mx-auto w-full max-w-4xl">
        <div className="rounded-xl border-2 border-rafam-yellow bg-card p-4 shadow-[0_12px_40px_rgba(22,66,128,0.18)] sm:p-6">
          <h2
            id="video-player-title"
            className="mb-4 text-center text-2xl font-extrabold text-rafam-blue sm:text-3xl"
          >
            {title}
          </h2>

          <div
            ref={playerRef}
            className="relative aspect-video w-full overflow-hidden rounded-md bg-black [&:fullscreen]:flex [&:fullscreen]:h-full [&:fullscreen]:w-full [&:fullscreen]:items-center [&:fullscreen]:justify-center [&:fullscreen]:rounded-none"
          >
            {playable.kind === "youtube" || playable.kind === "vimeo" ? (
              <iframe
                src={playable.embedUrl}
                title={title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : playable.kind === "file" ? (
              <video
                src={playable.src}
                className="h-full w-full"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <p className="flex h-full items-center justify-center px-6 text-center text-lg font-semibold text-white">
                Este ejercicio no tiene un video disponible para reproducir.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          {playable.kind !== "unavailable" && (
            <button
              type="button"
              onClick={toggleFullscreen}
              className="inline-flex items-center gap-2 rounded-lg bg-rafam-blue px-8 py-3 text-xl font-bold text-rafam-yellow transition-colors hover:bg-rafam-blue-dark focus:outline-none focus:ring-2 focus:ring-rafam-blue/40"
            >
              <Maximize2 className="h-5 w-5" aria-hidden="true" />
              Pantalla completa
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-rafam-blue px-12 py-3 text-xl font-bold text-rafam-yellow transition-colors hover:bg-rafam-blue-dark focus:outline-none focus:ring-2 focus:ring-rafam-blue/40"
          >
            Cerrar
          </button>
        </div>
      </section>
    </div>
  )
}
