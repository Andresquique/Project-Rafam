'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Video, CreateVideoDto } from '@/types/videos.types'
import { ZonaMuscular } from '@/api/admin/zonas-musculares.api'
import { Nivel } from '@/api/admin/niveles.api'

interface EditVideoModalProps {
  video: Video | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (id: number | null, data: Partial<CreateVideoDto>) => void
  zonasMusculares: ZonaMuscular[]
  niveles: Nivel[]
}

export function EditVideoModal({ video, open, onOpenChange, onSave, zonasMusculares, niveles }: EditVideoModalProps) {
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [urlVideo, setUrlVideo] = useState('')
  const [urlMiniatura, setUrlMiniatura] = useState('')
  const [zonaMuscularId, setZonaMuscularId] = useState<number>(zonasMusculares[0]?.id || 0)
  const [nivelId, setNivelId] = useState<number>(niveles[0]?.id || 0)

  useEffect(() => {
    if (video) {
      setNombre(video.nombre)
      setDescripcion(video.descripcion)
      setUrlVideo(video.url_video)
      setUrlMiniatura(video.url_miniatura)
      setZonaMuscularId(video.zona_muscular_id)
      setNivelId(video.nivel_id)
    } else {
      setNombre('')
      setDescripcion('')
      setUrlVideo('')
      setUrlMiniatura('')
      setZonaMuscularId(zonasMusculares[0]?.id || 0)
      setNivelId(niveles[0]?.id || 0)
    }
  }, [video, zonasMusculares, niveles])

  if (!open) return null

  const handleSave = () => {
    onSave(video?.id ?? null, {
      nombre,
      descripcion,
      url_video: urlVideo,
      url_miniatura: urlMiniatura,
      zona_muscular_id: zonaMuscularId,
      nivel_id: nivelId,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center pb-3">
          <Image
            src="/rafam-logo.png"
            alt="Fundación Rafam"
            width={160}
            height={56}
            className="h-auto w-[150px]"
          />
        </div>
        <div className="rounded-lg border-4 border-rafam-yellow bg-white p-6 shadow-lg">
          <h2 className="mb-4 border-b pb-3 text-lg font-extrabold text-foreground">
            {video ? `Editar Video: ${video.nombre}` : 'Agregar Video'}
          </h2>

          <div className="space-y-3">
            <div className="grid grid-cols-[110px_1fr] items-center gap-3">
              <label className="font-bold text-foreground">Nombre:</label>
              <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="h-10 rounded-md border border-input bg-white px-3 text-sm text-foreground" />
            </div>
            <div className="grid grid-cols-[110px_1fr] items-center gap-3">
              <label className="font-bold text-foreground">Descripción:</label>
              <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="h-10 rounded-md border border-input bg-white px-3 text-sm text-foreground" />
            </div>
            <div className="grid grid-cols-[110px_1fr] items-center gap-3">
              <label className="font-bold text-foreground">URL Video:</label>
              <input value={urlVideo} onChange={(e) => setUrlVideo(e.target.value)} className="h-10 rounded-md border border-input bg-white px-3 text-sm text-foreground" />
            </div>
            <div className="grid grid-cols-[110px_1fr] items-center gap-3">
              <label className="font-bold text-foreground">URL Miniatura:</label>
              <input value={urlMiniatura} onChange={(e) => setUrlMiniatura(e.target.value)} className="h-10 rounded-md border border-input bg-white px-3 text-sm text-foreground" />
            </div>
            <div className="grid grid-cols-[110px_1fr] items-center gap-3">
              <label className="font-bold text-foreground">Zona Muscular:</label>
              <select
                value={zonaMuscularId}
                onChange={(e) => setZonaMuscularId(Number(e.target.value))}
                className="h-10 rounded-md border border-input bg-white px-3 text-sm text-foreground"
              >
                {zonasMusculares.map((z) => (
                  <option key={z.id} value={z.id}>{z.nombre}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-[110px_1fr] items-center gap-3">
              <label className="font-bold text-foreground">Nivel:</label>
              <select
                value={nivelId}
                onChange={(e) => setNivelId(Number(e.target.value))}
                className="h-10 rounded-md border border-input bg-white px-3 text-sm text-foreground"
              >
                {niveles.map((n) => (
                  <option key={n.id} value={n.id}>{n.nombre}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-center gap-4">
          <button
            onClick={handleSave}
            className="rounded-md bg-rafam-blue px-8 py-2.5 text-lg font-bold text-rafam-yellow transition-opacity hover:opacity-90"
          >
            Guardar
          </button>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md bg-rafam-blue px-8 py-2.5 text-lg font-bold text-rafam-yellow transition-opacity hover:opacity-90"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
