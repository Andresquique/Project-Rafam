'use client'

import { ImageIcon, Pencil, FileX } from 'lucide-react'
import { Video } from '@/types/videos.types'

interface VideoAdminCardProps {
  video: Video
  onEdit: (video: Video) => void
  onDelete: (id: number) => void
}

export function VideoAdminCard({ video, onEdit, onDelete }: VideoAdminCardProps) {
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

      <div className="relative flex h-32 items-center justify-center rounded-md bg-muted">
        <div className="absolute left-2 top-2 flex gap-1.5">
          <span className="rounded-md bg-white/90 px-2 py-0.5 text-xs font-semibold text-rafam-blue">
            Nivel: {video.nivel_id}
          </span>
          <span className="rounded-md bg-white/90 px-2 py-0.5 text-xs font-semibold text-rafam-blue">
            Zona: {video.zona_muscular_id}
          </span>
        </div>
        {video.url_miniatura ? (
          <img src={video.url_miniatura} alt={video.nombre} className="h-full w-full rounded-md object-cover" />
        ) : (
          <ImageIcon className="h-10 w-10 text-muted-foreground" />
        )}
      </div>

      <h3 className="mt-2 font-bold text-foreground">{video.nombre}</h3>
      <p className="line-clamp-1 text-sm text-muted-foreground">{video.descripcion}</p>
    </div>
  )
}
