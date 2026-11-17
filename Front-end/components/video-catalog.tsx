// Catálogo de videos para el usuario común: filtros por parte del cuerpo y dificultad,
// buscador, paginación de 3 en 3 y un modal para reproducir cada video.
// Todo lo que es datos lo maneja el store useVideoUserStore.
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ImageIcon } from "lucide-react"
import { useVideoUserStore } from "@/stores/videoUser.store"
import type { Video } from "@/types/videos.types"
import { VideoPlayerModal } from "@/components/video-player-modal"
import { VideoPlayOverlay } from "@/components/video-play-overlay"

// estos mapas traducen lo que muestra la interfaz a los ids que usa el back
const ZONE_MAP: Record<string, number | undefined> = {
  TODAS: undefined,
  BRAZOS: 1,
  PIERNAS: 2,
  ESPALDA: 3,
}

const LEVEL_MAP: Record<string, number | undefined> = {
  TODAS: undefined,
  FACIL: 1,
  MEDIA: 2,
  AVANZADA: 3,
}

// y estos son al revés, para mostrar el nombre cuando el video ya viene con el id
const ZONE_LABEL: Record<number, string> = {
  1: "BRAZOS",
  2: "PIERNAS",
  3: "ESPALDA",
}

const LEVEL_LABEL: Record<number, string> = {
  1: "FACIL",
  2: "MEDIA",
  3: "AVANZADA",
}

const bodyParts = ["TODAS", "BRAZOS", "PIERNAS", "ESPALDA"] as const
const difficulties = ["TODAS", "FACIL", "MEDIA", "AVANZADA"] as const

type BodyPart = (typeof bodyParts)[number]
type Difficulty = (typeof difficulties)[number]

const capitalize = (s: string) => s.charAt(0) + s.slice(1).toLowerCase()

// cantidad de videos por página, lo dejé en 3 para que no quede tan larga la pantalla
const PAGE_SIZE = 3

export function VideoCatalog() {
  // del store saco los videos, el estado de carga y las acciones de filtrado
  const { videos, loading, fetchVideos, filterByZone, filterByLevel, searchVideos, clearFilters } =
    useVideoUserStore()

  // estos estados son solo de la pantalla: filtros seleccionados, texto buscado y página actual
  const [part, setPart] = useState<BodyPart>("TODAS")
  const [difficulty, setDifficulty] = useState<Difficulty>("TODAS")
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)

  // la primera vez que se monta pido los videos a la API
  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  // calculo el total de páginas y recorto el array para mostrar solo las de esta página
  const totalPages = Math.max(1, Math.ceil(videos.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visible = videos.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handlePartChange(option: string) {
    // cada vez que cambio un filtro vuelvo a la página 1
    const val = option as BodyPart
    setPart(val)
    setPage(1)
    filterByZone(ZONE_MAP[val])
  }

  function handleDifficultyChange(option: string) {
    // lo mismo que el filtro de zona pero con el nivel
    const val = option as Difficulty
    setDifficulty(val)
    setPage(1)
    filterByLevel(LEVEL_MAP[val])
  }

  function handleSearch() {
    // trim para que no busque espacios de más
    setPage(1)
    searchVideos(query.trim())
  }

  function handleClearSearch() {
    // limpiar deja todo como al principio: texto, filtros y página
    setQuery("")
    setPart("TODAS")
    setDifficulty("TODAS")
    setPage(1)
    clearFilters()
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-6 py-8 lg:flex-row">
      {/* Barra lateral de filtros */}
      <aside className="w-full shrink-0 lg:w-56">
        <FilterGroup
          title="Parte del cuerpo"
          options={bodyParts}
          selected={part}
          onSelect={handlePartChange}
        />
        <FilterGroup
          title="Dificultad del ejercicio"
          options={difficulties}
          selected={difficulty}
          onSelect={handleDifficultyChange}
          className="mt-8"
        />
      </aside>

      {/* Contenido */}
      <div className="flex flex-1 flex-col gap-6">
        {/* Búsqueda */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-full border-2 border-rafam-blue bg-card px-5 py-2.5">
            <Search className="h-5 w-5 shrink-0 text-rafam-blue" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                // esto lo saqué de la documentación: el isComposing y el 229 son para que
                // no busque mientras se está escribiendo con el teclado en otro idioma
                if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) handleSearch()
              }}
              placeholder="Que estas buscando?"
              aria-label="Buscar ejercicios"
              className="w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button
            onClick={handleSearch}
            className="rounded-lg bg-rafam-blue px-6 py-2.5 text-base font-bold text-primary-foreground transition-colors hover:bg-rafam-blue-dark"
          >
            Buscar
          </button>
          <button
            onClick={handleClearSearch}
            className="rounded-lg bg-muted px-6 py-2.5 text-base font-bold text-foreground transition-colors hover:bg-muted/70"
          >
            Limpiar busqueda
          </button>
        </div>

        {/* Resultados */}
        <div className="rounded-xl border-2 border-rafam-yellow p-4 sm:p-6">
          {/* mientras el store carga muestro el cartelito de carga */}
          {loading ? (
            <p className="py-12 text-center text-lg text-muted-foreground">Cargando ejercicios...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {visible.length === 0 ? (
                  <p className="col-span-full py-12 text-center text-lg text-muted-foreground">
                    No se encontraron ejercicios.
                  </p>
                ) : (
                  visible.map((v) => <VideoCard key={v.id} video={v} />)
                )}
              </div>

              {/* Paginación */}
              {/* Anterior y Siguiente se deshabilitan en los extremos y el número activo queda pintado */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg bg-muted px-5 py-2 font-bold text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50"
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const n = i + 1
                  const active = n === currentPage
                  return (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      aria-current={active ? "page" : undefined}
                      className={`h-10 w-10 rounded-lg font-bold transition-colors ${
                        active
                          ? "bg-rafam-blue text-primary-foreground"
                          : "bg-muted text-foreground hover:bg-muted/70"
                      }`}
                    >
                      {n}
                    </button>
                  )
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg bg-rafam-blue px-5 py-2 font-bold text-primary-foreground transition-colors hover:bg-rafam-blue-dark disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </>
          )}
        </div>

        {/* Volver */}
        <div className="flex justify-center pt-2">
          <Link
            href="/home"
            className="rounded-lg bg-rafam-blue px-8 py-3 text-lg font-bold text-primary-foreground transition-colors hover:bg-rafam-blue-dark"
          >
            Volver a la pantalla principal
          </Link>
        </div>
      </div>
    </div>
  )
}

function FilterGroup({
  title,
  options,
  selected,
  onSelect,
  className = "",
}: {
  // este componente chiquito arma una lista de botones para filtrar, lo uso dos veces
  title: string
  options: readonly string[]
  selected: string
  onSelect: (option: string) => void
  className?: string
}) {
  return (
    <div className={className}>
      <h2 className="mb-3 text-center text-2xl font-bold text-rafam-blue">{title}</h2>
      <ul className="overflow-hidden rounded-md border border-rafam-blue">
        {options.map((option) => {
          const active = option === selected
          return (
            <li key={option}>
              <button
                onClick={() => onSelect(option)}
                className={`w-full border-b border-rafam-blue px-4 py-2.5 text-center font-bold transition-colors last:border-b-0 ${
                  active ? "bg-rafam-blue text-primary-foreground" : "bg-card text-foreground hover:bg-rafam-yellow-soft"
                }`}
              >
                {option}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function VideoCard({ video }: { video: Video }) {
  // cada tarjeta maneja su propio estado para abrir el reproductor
  const [playing, setPlaying] = useState(false)
  // si el id no está en el mapa muestro un texto genérico en vez de romper
  const zoneLabel = ZONE_LABEL[video.zona_muscular_id] ?? `Zona ${video.zona_muscular_id}`
  const levelLabel = LEVEL_LABEL[video.nivel_id] ?? `Nivel ${video.nivel_id}`

  return (
    <article className="flex flex-col gap-3 rounded-xl border-2 border-rafam-blue bg-card p-4">
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={`Reproducir ${video.nombre}`}
        className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-md bg-muted focus:outline-none focus:ring-2 focus:ring-rafam-blue/40"
      >
        {video.url_miniatura ? (
          // next/image necesita fill porque el contenedor ya define el tamaño
          <Image
            src={video.url_miniatura}
            alt=""
            fill
            className="rounded-md object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        ) : (
          <ImageIcon className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
        )}
        <span className="absolute left-2 top-2 z-10 rounded-md border border-rafam-blue bg-card px-2 py-0.5 text-xs font-bold text-rafam-blue">
          Dificultad: {capitalize(levelLabel)}
        </span>
        <span className="absolute right-2 top-2 z-10 rounded-md border border-rafam-blue bg-card px-2 py-0.5 text-xs font-bold text-rafam-blue">
          Parte: {capitalize(zoneLabel)}
        </span>
        <VideoPlayOverlay />
      </button>
      <div>
        <h3 className="text-lg font-bold text-foreground">{video.nombre}</h3>
        <p className="text-sm text-muted-foreground">{video.descripcion}</p>
      </div>
      {/* el modal se abre con playing; al cerrar vuelve a false y no se renderiza nada */}
      <VideoPlayerModal
        open={playing}
        title={video.nombre}
        url={video.url_video}
        onClose={() => setPlaying(false)}
      />
    </article>
  )
}
