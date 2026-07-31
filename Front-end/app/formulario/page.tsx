import Link from "next/link"
import { RafamHeader } from "@/components/rafam-header"
import { SiteFooter } from "@/components/site-footer"
import { Formulario } from "@/components/formulario"
import { VolverPagPrincipal } from "@/components/volverPagPrincipal"

export default function FormularioPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <RafamHeader />
      {/* Título */}
      <div className="bg-rafam-yellow-soft py-6">
        <h1 className="text-center text-3xl font-extrabold text-rafam-blue sm:text-4xl">Formulario Físico</h1>
      </div>

      <div className="flex flex-col gap-6">
        <Formulario />
        <VolverPagPrincipal />
        <SiteFooter />
      </div>

    </main>
  )
}
