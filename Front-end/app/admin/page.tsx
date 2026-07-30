'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Tv, UserPen } from 'lucide-react'
import Image from 'next/image'
import { useAuthStore } from '@/stores/auth.store'

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isInitialized, logout } = useAuthStore()

  useEffect(() => {
    if (isInitialized && (!isAuthenticated || (user?.rol !== 'admin' && user?.rol !== 'Administrador'))) {
      router.push('/')
    }
  }, [isInitialized, isAuthenticated, user, router])

  if (!isInitialized || !isAuthenticated) return null

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex px-6 pt-8 pb-2">
        <Image
          src="/rafam-logo.png"
          alt="Fundación Rafam - Red de Actividad Física para Adultos Mayores"
          width={260}
          height={90}
          priority
          className="h-auto w-[200px] object-contain md:w-[240px]"
        />
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6">
        <div className="rounded-lg border-2 border-rafam-yellow p-8 md:p-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <Link
              href="/admin/videos"
              className="group flex flex-col items-center gap-4 rounded-lg p-6 transition-colors hover:bg-muted"
            >
              <Tv className="h-20 w-20 text-rafam-blue" strokeWidth={1.75} />
              <span className="text-2xl font-extrabold text-rafam-blue md:text-3xl">Editar Videos</span>
            </Link>

            <Link
              href="/admin/usuarios"
              className="group flex flex-col items-center gap-4 rounded-lg p-6 transition-colors hover:bg-muted"
            >
              <UserPen className="h-20 w-20 text-rafam-blue" strokeWidth={1.75} />
              <span className="text-2xl font-extrabold text-rafam-blue md:text-3xl">Editar Usuarios</span>
            </Link>
          </div>
        </div>

        <div className="flex justify-center py-12">
          <button
            onClick={() => { logout(); router.push('/') }}
            className="rounded-lg bg-rafam-blue px-10 py-4 text-2xl font-extrabold text-rafam-yellow transition-opacity hover:opacity-90"
          >
            Salir de la aplicacion
          </button>
        </div>
      </main>

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
