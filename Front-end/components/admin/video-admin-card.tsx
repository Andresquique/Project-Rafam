// Tarjeta de un video dentro del panel de admin.
// Muestra la miniatura, el nivel y la zona, y tiene botones para editar o eliminar.
// Acá también está el estado que abre el reproductor en un modal.
'use client'

import { useState } from 'react'
import { ImageIcon, Pencil, FileX } from 'lucide-react'
import { Video } from '@/types/videos.types'
import { VideoPlayerModal } from '@/components/video-player-modal'
import { VideoPlayOverlay } from '@/components/video-play-overlay'

interface VideoAdminCardProps {
  video: Video
  onEdit: (video: Video) => void
  onDelete: (id: number) => void
}

export function VideoAdminCard({ video, onEdit, onDelete }: VideoAdminCardProps) {
  // este estado controla si el modal del reproductor está abierto o no
  const [playing, setPlaying] = useState(false)

  return (
    <div className="rounded-xl border border-rafam-blue/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        {/* editar le pasa el video completo a la página para precargar el modal */}
        <button
          aria-label={`Editar ${video.nombre}`}
          onClick={() => onEdit(video)}
          className="rounded-md bg-rafam-blue p-1.5 text-white transition-opacity hover:opacity-90"
        >
          <Pencil className="h-5 w-5" />
        </button>
        {/* eliminar va directo con el id, la confirmación la hace la página */}
        <button
          aria-label={`Eliminar ${video.nombre}`}
          onClick={() => onDelete(video.id)}
          className="rounded-md bg-destructive p-1.5 text-destructive-foreground transition-opacity hover:opacity-90"
        >
          <FileX className="h-5 w-5" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={`Reproducir ${video.nombre}`}
        className="group relative flex h-32 w-full items-center justify-center overflow-hidden rounded-md bg-muted focus:outline-none focus:ring-2 focus:ring-rafam-blue/40"
      >
        {/* por ahora muestro los ids de nivel y zona porque no tengo los nombres cargados acá */}
        <div className="absolute left-2 top-2 z-10 flex gap-1.5">
          <span className="rounded-md bg-white/90 px-2 py-0.5 text-xs font-semibold text-rafam-blue">
            Nivel: {video.nivel_id}
          </span>
          <span className="rounded-md bg-white/90 px-2 py-0.5 text-xs font-semibold text-rafam-blue">
            Zona: {video.zona_muscular_id}
          </span>
        </div>
        {/* si no hay miniatura cae en el ícono de imagen */}
        {video.url_miniatura ? (
          <img src={video.url_miniatura} alt="" className="h-full w-full rounded-md object-cover" />
        ) : (
          <ImageIcon className="h-10 w-10 text-muted-foreground" />
        )}
        <VideoPlayOverlay compact />
      </button>

      <h3 className="mt-2 font-bold text-foreground">{video.nombre}</h3>
      <p className="line-clamp-1 text-sm text-muted-foreground">{video.descripcion}</p>

      {/* el player vive acá adentro y se muestra u oculta con el estado playing */}
      <VideoPlayerModal
        open={playing}
        title={video.nombre}
        url={video.url_video}
        onClose={() => setPlaying(false)}
      />
    </div>
  )
}
