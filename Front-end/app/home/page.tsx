"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Tv, ListChecks, UserPen } from "lucide-react"
import { RafamHeader } from "@/components/rafam-header"
import { SiteFooter } from "@/components/site-footer"
import { useAuthStore } from "@/stores/auth.store"
import { usePerfilUserStore } from "@/stores/perfilUser.store"
import Aviso from "@/components/aviso.component"

export default function HomePage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { getExamenFecha } = usePerfilUserStore()

  const [avisoOpen, setAvisoOpen] = useState(false)
  const [avisoMensaje, setAvisoMensaje] = useState("")

  const cerrarAviso = () => setAvisoOpen(false)

  const intentarTomarExamen = async () => {
    try {
      await getExamenFecha(user)
      router.push("/formulario")
    } catch (error: any) {
      console.log("error examen fisico: ", error)

      setAvisoMensaje(error.message)
      setAvisoOpen(true)
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <RafamHeader />

      <section className="border-y-2 border-rafam-yellow px-6 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-3">
          <button
            onClick={intentarTomarExamen}
            className="flex flex-col items-center gap-4 rounded-lg py-4 text-rafam-blue transition-colors hover:text-rafam-blue-dark focus:outline-none focus:ring-2 focus:ring-rafam-blue/40 cursor-pointer"
          >
            <ListChecks
              className="h-16 w-16"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span className="text-2xl font-bold">Tomar examen</span>
          </button>

          <Link
            href="/aviso2"
            className="flex flex-col items-center gap-4 rounded-lg py-4 text-rafam-blue transition-colors hover:text-rafam-blue-dark focus:outline-none focus:ring-2 focus:ring-rafam-blue/40"
          >
            <Tv
              className="h-16 w-16"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span className="text-2xl font-bold">Ver videos</span>
          </Link>

          <Link
            href="/perfil"
            className="flex flex-col items-center gap-4 rounded-lg py-4 text-rafam-blue transition-colors hover:text-rafam-blue-dark focus:outline-none focus:ring-2 focus:ring-rafam-blue/40"
          >
            <UserPen
              className="h-16 w-16"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span className="text-2xl font-bold">Mis datos</span>
          </Link>
        </div>
      </section>

      <section className="flex flex-1 items-start justify-center px-6 py-14">
        <Link
          href="/"
          className="rounded-lg bg-rafam-blue px-12 py-4 text-2xl font-bold text-rafam-yellow transition-colors hover:bg-rafam-blue-dark focus:outline-none focus:ring-2 focus:ring-rafam-blue/40"
        >
          Salir de la aplicacion
        </Link>
      </section>

      <Aviso
        isOpen={avisoOpen}
        onClose={cerrarAviso}
        title="No se puede realizar el examen"
        message={avisoMensaje}
      />

      <SiteFooter />
    </main>
  )
}