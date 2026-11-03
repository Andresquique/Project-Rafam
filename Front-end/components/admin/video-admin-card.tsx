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
  const [playing, setPlaying] = useState(false)

  return (
    <div className="rounded-xl border border-rafam-blue/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <button
          aria-label={`Editar ${video.nombre}`}
          onClick={() => onEdit(video)}
          className="rounded-md bg-rafam-blue p-1.5 text-white transition-opacity hover:opacity-90"
        >
          <Pencil className="h-5 w-5" />
        </button>
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
        <div className="absolute left-2 top-2 z-10 flex gap-1.5">
          <span className="rounded-md bg-white/90 px-2 py-0.5 text-xs font-semibold text-rafam-blue">
            Nivel: {video.nivel_id}
          </span>
          <span className="rounded-md bg-white/90 px-2 py-0.5 text-xs font-semibold text-rafam-blue">
            Zona: {video.zona_muscular_id}
          </span>
        </div>
        {video.url_miniatura ? (
          <img src={video.url_miniatura} alt="" className="h-full w-full rounded-md object-cover" />
        ) : (
          <ImageIcon className="h-10 w-10 text-muted-foreground" />
        )}
        <VideoPlayOverlay compact />
      </button>

      <h3 className="mt-2 font-bold text-foreground">{video.nombre}</h3>
      <p className="line-clamp-1 text-sm text-muted-foreground">{video.descripcion}</p>

      <VideoPlayerModal
        open={playing}
        title={video.nombre}
        url={video.url_video}
        onClose={() => setPlaying(false)}
      />
    </div>
  )
}
