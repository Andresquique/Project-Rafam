// Modal reproductor de video. Sirve tanto para links de YouTube/Vimeo como para
// archivos directos. Recibe open, el título, la url y onClose.
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
  // ref al contenedor del video, la necesito para pedir pantalla completa
  const playerRef = useRef<HTMLDivElement>(null)
  // esto me dice si la url es youtube, vimeo, un archivo o si no se puede reproducir
  const playable = getPlayableVideo(url)

  // con el modal abierto escucho Escape: si estoy en pantalla completa salgo de eso,
  // si no, cierro el modal
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

  // mientras el modal está abierto bloqueo el scroll del body,
  // y cuando se cierra lo devuelvo a como estaba
  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open) return null

  // pregunto si ya hay algo en fullscreen para saber si entro o salgo
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
    // este se cierra con Escape o con el botón Cerrar, el click afuera no hace nada
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
              // si es youtube o vimeo lo meto en un iframe con la url de embed
              <iframe
                src={playable.embedUrl}
                title={title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : playable.kind === "file" ? (
              // si es un archivo de video común uso la etiqueta <video> con controles
              <video
                src={playable.src}
                className="h-full w-full"
                controls
                autoPlay
                playsInline
              />
            ) : (
              // si la url no es nada reconocible muestro este mensaje
              <p className="flex h-full items-center justify-center px-6 text-center text-lg font-semibold text-white">
                Este ejercicio no tiene un video disponible para reproducir.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          {/* el botón de pantalla completa solo aparece si hay algo para reproducir */}
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
