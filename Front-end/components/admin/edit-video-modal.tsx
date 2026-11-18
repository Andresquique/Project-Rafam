// Modal para cargar o editar un video del catálogo.
// Si recibe un video, lo edita; si llega null, se usa para agregar uno nuevo.
// Recibe además las zonas musculares y los niveles para llenar los selects,
// y onSave, que es la función de la página que pega contra la API.
'use client'

import { useEffect, useState, FormEvent } from 'react'
import { X } from 'lucide-react'
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

  // los mensajes de error de cada input, igual que en el modal de usuarios
  const [nombreError, setNombreError] = useState('')
  const [descripcionError, setDescripcionError] = useState('')
  const [urlVideoError, setUrlVideoError] = useState('')
  const [urlMiniaturaError, setUrlMiniaturaError] = useState('')

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

    setNombreError('')
    setDescripcionError('')
    setUrlVideoError('')
    setUrlMiniaturaError('')
  }, [video, zonasMusculares, niveles])

  // modal cerrado, no dibujo nada
  if (!open) return null

  // validación simple, el back también exige que las URLs sean válidas
  const validarTexto = (value: string, campo: string) =>
    !value.trim() ? `El ${campo} es obligatorio.` : ''

  const validarUrl = (value: string, campo: string) => {
    if (!value.trim()) return `La URL de ${campo} es obligatoria.`
    try {
      new URL(value)
    } catch {
      return 'La URL no es válida.'
    }
    return ''
  }

  // submit del form: primero valido y recién entonces llamo a onSave
  const handleSave = (e: FormEvent) => {
    e.preventDefault()

    const newNombreError = validarTexto(nombre, 'nombre')
    const newDescripcionError = validarTexto(descripcion, 'descripción')
    const newUrlVideoError = validarUrl(urlVideo, 'video')
    const newUrlMiniaturaError = validarUrl(urlMiniatura, 'miniatura')

    setNombreError(newNombreError)
    setDescripcionError(newDescripcionError)
    setUrlVideoError(newUrlVideoError)
    setUrlMiniaturaError(newUrlMiniaturaError)

    if (newNombreError || newDescripcionError || newUrlVideoError || newUrlMiniaturaError) return

    // mando el id del video o null si es uno nuevo, y el objeto con todos los campos
    onSave(video?.id ?? null, {
      nombre,
      descripcion,
      url_video: urlVideo,
      url_miniatura: urlMiniatura,
      zona_muscular_id: zonaMuscularId,
      nivel_id: nivelId,
    })
  }

  const inputBase =
    'w-full rounded-full border-2 border-rafam-blue bg-card px-5 py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-rafam-blue/40'
  const labelBase = 'text-xl font-bold text-rafam-blue'

  return (
    // fondo oscuro que cubre la pantalla; se cierra con la X o con Cancelar, no afuera
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
      {/* my-auto centra el modal si entra, y si es más alto que la pantalla lo deja scrollear */}
      <div className="my-auto w-full max-w-md">
        <form
          onSubmit={handleSave}
          className="relative rounded-[24px] border-2 border-yellow-300 bg-white p-5 shadow-[0_12px_40px_rgba(22,66,128,0.08)] sm:p-6"
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 text-rafam-blue/60 transition-colors hover:text-rafam-blue"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="mb-4 pb-1 text-xl font-bold text-[#164280]">
            {/* el título cambia según si estamos editando o creando uno nuevo */}
            {video ? `Editar Video: ${video.nombre}` : 'Agregar Video'}
          </h2>

          <div className="mx-auto w-full">
            {/* Nombre */}
            <div className="mb-4 flex flex-col gap-2">
              <label htmlFor="edit-video-nombre" className={labelBase}>
                Nombre
              </label>
              <input
                id="edit-video-nombre"
                type="text"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value)
                  setNombreError('')
                }}
                placeholder="Nombre del ejercicio"
                className={`${inputBase} ${nombreError ? 'border-red-500' : ''}`}
                required
              />
              {nombreError && (
                <p className="text-sm italic text-red-500">{nombreError}</p>
              )}
            </div>

            {/* Descripción */}
            <div className="mb-4 flex flex-col gap-2">
              <label htmlFor="edit-video-descripcion" className={labelBase}>
                Descripción
              </label>
              <input
                id="edit-video-descripcion"
                type="text"
                value={descripcion}
                onChange={(e) => {
                  setDescripcion(e.target.value)
                  setDescripcionError('')
                }}
                placeholder="De qué trata el video"
                className={`${inputBase} ${descripcionError ? 'border-red-500' : ''}`}
                required
              />
              {descripcionError && (
                <p className="text-sm italic text-red-500">{descripcionError}</p>
              )}
            </div>

            {/* URL del video */}
            <div className="mb-4 flex flex-col gap-2">
              <label htmlFor="edit-video-url" className={labelBase}>
                URL Video
              </label>
              <input
                id="edit-video-url"
                type="url"
                value={urlVideo}
                onChange={(e) => {
                  setUrlVideo(e.target.value)
                  setUrlVideoError('')
                }}
                placeholder="https://..."
                className={`${inputBase} ${urlVideoError ? 'border-red-500' : ''}`}
                required
              />
              {urlVideoError && (
                <p className="text-sm italic text-red-500">{urlVideoError}</p>
              )}
            </div>

            {/* URL de la miniatura */}
            <div className="mb-4 flex flex-col gap-2">
              <label htmlFor="edit-video-miniatura" className={labelBase}>
                URL Miniatura
              </label>
              <input
                id="edit-video-miniatura"
                type="url"
                value={urlMiniatura}
                onChange={(e) => {
                  setUrlMiniatura(e.target.value)
                  setUrlMiniaturaError('')
                }}
                placeholder="https://..."
                className={`${inputBase} ${urlMiniaturaError ? 'border-red-500' : ''}`}
                required
              />
              {urlMiniaturaError && (
                <p className="text-sm italic text-red-500">{urlMiniaturaError}</p>
              )}
            </div>

            {/* Zona muscular */}
            <div className="mb-4 flex flex-col gap-2">
              <label htmlFor="edit-video-zona" className={labelBase}>
                Zona Muscular
              </label>
              {/* Number() porque el select siempre me devuelve un string */}
              <select
                id="edit-video-zona"
                value={zonaMuscularId}
                onChange={(e) => setZonaMuscularId(Number(e.target.value))}
                className={inputBase}
              >
                {zonasMusculares.map((z) => (
                  <option key={z.id} value={z.id}>{z.nombre}</option>
                ))}
              </select>
            </div>

            {/* Nivel */}
            <div className="mb-2 flex flex-col gap-2">
              <label htmlFor="edit-video-nivel" className={labelBase}>
                Nivel
              </label>
              {/* mismo caso que la zona, mapeo los niveles que vienen de la API */}
              <select
                id="edit-video-nivel"
                value={nivelId}
                onChange={(e) => setNivelId(Number(e.target.value))}
                className={inputBase}
              >
                {niveles.map((n) => (
                  <option key={n.id} value={n.id}>{n.nombre}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="mt-4 flex items-center justify-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-xl bg-[#164280] px-6 py-2.5 font-medium text-white shadow-md transition-colors hover:bg-[#0f2d57]"
            >
              Guardar Cambios
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-2 border-[#164280] bg-white px-6 py-2.5 font-medium text-[#164280] transition-colors hover:bg-[#164280]/5"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
