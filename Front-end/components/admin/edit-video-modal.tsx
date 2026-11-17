// Modal para cargar o editar un video del catálogo.
// Si recibe un video, lo edita; si llega null, se usa para agregar uno nuevo.
// Recibe además las zonas musculares y los niveles para llenar los selects,
// y onSave, que es la función de la página que pega contra la API.
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
  // un estado por cada campo del formulario
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [urlVideo, setUrlVideo] = useState('')
  const [urlMiniatura, setUrlMiniatura] = useState('')
  const [zonaMuscularId, setZonaMuscularId] = useState<number>(zonasMusculares[0]?.id || 0)
  const [nivelId, setNivelId] = useState<number>(niveles[0]?.id || 0)

  // si hay video cargo sus datos para editar; si no, limpio todo y dejo
  // seleccionada la primera zona y el primer nivel de las listas
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

  // modal cerrado, no dibujo nada
  if (!open) return null

  // mando el id del video o null si es uno nuevo, y el objeto con todos los campos
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
    // overlay del modal; se cierra solo con los botones, el click afuera no hace nada
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
            {/* el título cambia según si estamos editando o creando uno nuevo */}
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
              {/* Number() porque el select siempre me devuelve un string */}
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
              {/* mismo caso que la zona, mapeo los niveles que vienen de la API */}
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
          {/* Guardar llama a handleSave y la página se encarga de cerrar y recargar */}
          <button
            onClick={handleSave}
            className="rounded-md bg-rafam-blue px-8 py-2.5 text-lg font-bold text-rafam-yellow transition-opacity hover:opacity-90"
          >
            Guardar
          </button>
          {/* Cancelar cierra sin tocar nada, por eso solo llama a onOpenChange(false) */}
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
