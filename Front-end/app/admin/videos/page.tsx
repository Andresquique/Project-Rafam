'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search } from 'lucide-react'
import Image from 'next/image'
import { useAuthStore } from '@/stores/auth.store'
import { useVideoAdminStore } from '@/stores/videoAdmin.store'
import { zonasMuscularesApi, ZonaMuscular } from '@/api/admin/zonas-musculares.api'
import { nivelesApi, Nivel } from '@/api/admin/niveles.api'
import { Video, CreateVideoDto } from '@/types/videos.types'
import { PageTitleBand } from '@/components/admin/page-title-band'
import { VideoAdminCard } from '@/components/admin/video-admin-card'
import { EditVideoModal } from '@/components/admin/edit-video-modal'

export default function AdminVideosPage() {
  const router = useRouter()
  const { user, isAuthenticated, isInitialized } = useAuthStore()
  // el store de admin maneja el listado y el alta/edición/baja de videos
  const { videos, loading, fetchVideos, createVideo, editVideo, deleteVideo } = useVideoAdminStore()

  // igual que en usuarios: search es lo que se escribe y query lo que se filtra
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  // los filtros del costado, null significa "todos"
  const [filterNivel, setFilterNivel] = useState<number | null>(null)
  const [filterZona, setFilterZona] = useState<number | null>(null)

  // video que se está editando (null = alta nueva) y estado del modal
  const [editing, setEditing] = useState<Video | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // niveles y zonas los traigo aparte para llenar los select del modal y los filtros
  const [zonasMusculares, setZonasMusculares] = useState<ZonaMuscular[]>([])
  const [niveles, setNiveles] = useState<Nivel[]>([])

  // si el rol no es admin lo mando de vuelta al inicio
  useEffect(() => {
    if (isInitialized && (!isAuthenticated || (user?.rol !== 'admin' && user?.rol !== 'Administrador'))) {
      router.push('/')
    }
  }, [isInitialized, isAuthenticated, user, router])

  // al montar con sesión válida traigo videos, zonas y niveles en paralelo
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      fetchVideos()
      // si fallan las zonas o los niveles no bloqueo la pantalla, solo quedan vacíos
      zonasMuscularesApi.fetchAll().then(setZonasMusculares).catch(() => {})
      nivelesApi.fetchAll().then(setNiveles).catch(() => {})
    }
  }, [isInitialized, isAuthenticated])

  // el filtrado se hace todo del lado del cliente con los tres criterios a la vez
  const filtered = useMemo(() => {
    return videos.filter((v) => {
      const matchesQuery =
        !query ||
        v.nombre.toLowerCase().includes(query.toLowerCase()) ||
        v.descripcion.toLowerCase().includes(query.toLowerCase())
      const matchesNivel = filterNivel === null || v.nivel_id === filterNivel
      const matchesZona = filterZona === null || v.zona_muscular_id === filterZona
      return matchesQuery && matchesNivel && matchesZona
    })
  }, [videos, query, filterNivel, filterZona])

  // guardo el video elegido y abro el modal en modo edición
  const openEdit = (video: Video) => {
    setEditing(video)
    setModalOpen(true)
  }

  // sirve para alta y edición: si viene id edito, si no, creo uno nuevo
  const handleSave = async (id: number | null, data: Partial<CreateVideoDto>) => {
    try {
      if (id) {
        await editVideo(id, data)
      } else {
        await createVideo(data)
      }
      setModalOpen(false)
      setEditing(null)
    } catch {
      // error handled in store
    }
  }

  // confirmo antes de eliminar para no borrar de gusto
  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este video?')) {
      await deleteVideo(id)
    }
  }

  // abro el modal con editing en null para que sepa que es un alta
  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  // limpio el texto del buscador y el filtro aplicado
  const clearSearch = () => {
    setSearch('')
    setQuery('')
  }

  if (!isInitialized || !isAuthenticated) return null

  // clase de los botones de filtro según si están seleccionados o no
  const filterButton = (active: boolean) =>
    `w-full border border-rafam-blue/30 px-4 py-2 text-sm font-bold transition-colors ${
      active ? 'bg-rafam-blue text-primary-foreground' : 'bg-white text-rafam-blue hover:bg-muted'
    }`

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex px-6 pt-8 pb-2">
        <Image
          src="/rafam-logo.png"
          alt="Fundación Rafam"
          width={260}
          height={90}
          priority
          className="h-auto w-[200px] object-contain md:w-[240px]"
        />
      </header>
      <PageTitleBand title="Edicion de ejercicios" />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[200px_1fr]">
          {/* barra lateral con los dos grupos de filtros */}
          <aside className="space-y-6">
            <div>
              <h2 className="mb-2 text-center text-xl font-extrabold text-rafam-blue">Nivel</h2>
              <div className="overflow-hidden rounded-md">
                {/* "TODOS" limpia el filtro de nivel */}
                <button onClick={() => setFilterNivel(null)} className={filterButton(filterNivel === null)}>
                  TODOS
                </button>
                {niveles.map((n) => (
                  <button key={n.id} onClick={() => setFilterNivel(n.id)} className={filterButton(filterNivel === n.id)}>
                    {n.nombre.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="mb-2 text-center text-xl font-extrabold text-rafam-blue">Zona Muscular</h2>
              <div className="overflow-hidden rounded-md">
                {/* acá igual, "TODAS" deja pasar cualquier zona */}
                <button onClick={() => setFilterZona(null)} className={filterButton(filterZona === null)}>
                  TODAS
                </button>
                {zonasMusculares.map((z) => (
                  <button key={z.id} onClick={() => setFilterZona(z.id)} className={filterButton(filterZona === z.id)}>
                    {z.nombre.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <section>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <div className="relative min-w-[220px] flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-rafam-blue" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) setQuery(search)
                  }}
                  placeholder="Buscar video"
                  className="w-full rounded-full border-2 border-rafam-blue py-2 pl-11 pr-4 text-rafam-blue placeholder:text-rafam-blue/60 outline-none focus:outline-none"
                />
              </div>
              <button
                onClick={() => setQuery(search)}
                className="rounded-md bg-rafam-blue px-6 py-2 font-bold text-primary-foreground hover:opacity-90"
              >
                Buscar
              </button>
              <button
                onClick={clearSearch}
                className="rounded-md border border-border bg-muted px-6 py-2 font-bold text-foreground hover:opacity-90"
              >
                Limpiar busqueda
              </button>
              <button
                onClick={openCreate}
                className="rounded-md bg-rafam-blue px-6 py-2 font-bold text-primary-foreground hover:opacity-90"
              >
                Agregar
              </button>
            </div>

            <div className="rounded-lg border-2 border-rafam-yellow p-5">
              {/* otra vez los tres estados: cargando, vacío o grilla de tarjetas */}
              {loading ? (
                <p className="py-10 text-center text-muted-foreground">Cargando videos...</p>
              ) : filtered.length === 0 ? (
                <p className="py-10 text-center text-muted-foreground">No se encontraron videos.</p>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((video) => (
                    <VideoAdminCard key={video.id} video={video} onEdit={openEdit} onDelete={handleDelete} />
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-center py-8">
              <Link
                href="/admin"
                className="rounded-md bg-rafam-blue px-6 py-3 text-lg font-bold text-primary-foreground hover:opacity-90"
              >
                Volver a la pantalla principal
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* el modal necesita también las listas para los selects */}
      <EditVideoModal
        video={editing}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSave}
        zonasMusculares={zonasMusculares}
        niveles={niveles}
      />

      <footer className="mt-auto bg-rafam-lightblue">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-4 px-6 py-6 md:grid-cols-3">
          <ul className="space-y-1 text-sm font-bold text-foreground">
            <li>Contacto</li>
            <li>Telefono</li>
            <li>Email</li>
          </ul>
          <div className="flex justify-center">
            <div className="rounded-md bg-card px-4 py-2">
              <Image
                src="/rafam-logo.png"
                alt="Fundación Rafam"
                width={160}
                height={56}
                className="h-auto w-[150px] object-contain"
              />
            </div>
          </div>
          <div className="hidden md:block" />
        </div>
      </footer>
    </div>
  )
}
