'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search } from 'lucide-react'
import Image from 'next/image'
import { useAuthStore } from '@/stores/auth.store'
import { usePerfilAdminStore } from '@/stores/perfilAdmin.store'
import { PerfilAdmin, UpdatePerfilAdminDto } from '@/types/perfilAdmin.types'
import { PageTitleBand } from '@/components/admin/page-title-band'
import { UserAdminRow } from '@/components/admin/user-admin-row'
import { EditUserModal } from '@/components/admin/edit-user-modal'

// las columnas por las que se puede ordenar la tabla
type SortKey = 'nombre' | 'email' | 'rol'

export default function AdminUsuariosPage() {
  const router = useRouter()
  // de auth saco el usuario logueado y si ya terminó de inicializar la sesión
  const { user, isAuthenticated, isInitialized } = useAuthStore()
  // el store de admin ya trae los perfiles y las acciones de ABM
  const { perfiles, isLoadingPerfiles, fetchAllPerfiles, updatePerfil, deletePerfil } = usePerfilAdminStore()

  // search es lo que se escribe y query lo que realmente se filtra (recién al apretar Buscar o Enter)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('nombre')

  // editing guarda el usuario que se está por editar y modalOpen controla el modal
  const [editing, setEditing] = useState<PerfilAdmin | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // protección de la ruta: si no sos admin te manda de vuelta al login
  useEffect(() => {
    if (isInitialized && (!isAuthenticated || (user?.rol !== 'admin' && user?.rol !== 'Administrador'))) {
      router.push('/')
    }
  }, [isInitialized, isAuthenticated, user, router])

  // recién cuando hay sesión válida pedimos todos los perfiles al backend
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      fetchAllPerfiles()
    }
  }, [isInitialized, isAuthenticated])

  // filtro y orden los resuelvo en el cliente, así no vuelvo a pegarle a la API por cada tecla
  const visible = useMemo(() => {
    const filtered = perfiles.filter((u) => {
      if (!query) return true
      const q = query.toLowerCase()
      const email = u.credencial?.email || ''
      return (
        (u.nombre || '').toLowerCase().includes(q) ||
        email.toLowerCase().includes(q) ||
        u.rol.toLowerCase().includes(q)
      )
    })

    return [...filtered].sort((a, b) => {
      const getVal = (p: PerfilAdmin, key: SortKey): string => {
        if (key === 'email') return p.credencial?.email || ''
        if (key === 'rol') return p.rol
        return p.nombre || ''
      }
      return getVal(a, sortKey).localeCompare(getVal(b, sortKey))
    })
  }, [perfiles, query, sortKey])

  // abro el modal con el usuario seleccionado ya cargado
  const openEdit = (user: PerfilAdmin) => {
    setEditing(user)
    setModalOpen(true)
  }

  // si guarda bien cierro el modal; si falla el store ya se encarga del error
  const handleSave = async (id: number, data: UpdatePerfilAdminDto) => {
    try {
      await updatePerfil(id, data)
      setModalOpen(false)
      setEditing(null)
    } catch {
      // error handled in store
    }
  }

  // confirmación rápida antes de borrar, por las dudas
  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      await deletePerfil(id)
    }
  }

  // limpio los dos estados porque si no queda el filtro anterior aplicado
  const clearSearch = () => {
    setSearch('')
    setQuery('')
  }

  // mientras no sepamos si hay sesión no mostramos nada así no parpadea la pantalla
  if (!isInitialized || !isAuthenticated) return null

  // devuelvo las clases según cuál orden está activo
  const sortButton = (active: boolean) =>
    `font-bold transition-colors ${active ? 'text-rafam-blue underline' : 'text-rafam-blue/70 hover:text-rafam-blue'}`

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
      <PageTitleBand title="Edicion de usuarios" />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-6">
        {/* buscador: Enter también dispara la búsqueda sin tocar el botón */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-rafam-blue" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) setQuery(search)
              }}
              placeholder="Buscar usuario"
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
        </div>

        <div className="rounded-lg border-2 border-rafam-yellow p-5">
          {/* botones para cambiar el criterio de orden */}
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <span className="text-lg font-extrabold text-foreground">Ordenar:</span>
            <button onClick={() => setSortKey('nombre')} className={sortButton(sortKey === 'nombre')}>
              Nombre
            </button>
            <button onClick={() => setSortKey('email')} className={sortButton(sortKey === 'email')}>
              Mail
            </button>
            <button onClick={() => setSortKey('rol')} className={sortButton(sortKey === 'rol')}>
              Rol
            </button>
          </div>

          <div className="space-y-3">
            {/* tres estados posibles: cargando, sin resultados o la lista */}
            {isLoadingPerfiles ? (
              <p className="py-10 text-center text-muted-foreground">Cargando usuarios...</p>
            ) : visible.length === 0 ? (
              <p className="py-10 text-center text-muted-foreground">No se encontraron usuarios.</p>
            ) : (
              visible.map((p) => (
                <UserAdminRow key={p.id} user={p} onEdit={openEdit} onDelete={handleDelete} />
              ))
            )}
          </div>
        </div>

        <div className="flex justify-center py-8">
          <Link
            href="/admin"
            className="rounded-md bg-rafam-blue px-6 py-3 text-lg font-bold text-primary-foreground hover:opacity-90"
          >
            Volver a la pantalla principal
          </Link>
        </div>
      </main>

      {/* el modal recibe el usuario en edición y avisa cuando se cierra */}
      <EditUserModal user={editing} open={modalOpen} onOpenChange={setModalOpen} onSave={handleSave} />

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
