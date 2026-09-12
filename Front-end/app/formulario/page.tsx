"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { RafamHeader } from "@/components/rafam-header"
import { SiteFooter } from "@/components/site-footer"
import { Formulario } from "@/components/FormularioFisico/formulario"
import { VolverPagPrincipal } from "@/components/volverPagPrincipal"
import Aviso from "@/components/aviso.component"
import { useExamenStore } from "@/stores/examenFisico.store"
import { ResultadoExamenDto } from "@/types/examenFisico.types"
import { eNivel } from "../enums/eNivel"

export default function FormularioPage() {
  const router = useRouter()
  const { updateExamen } = useExamenStore()

  const [avisoOpen, setAvisoOpen] = useState(false)
  const [avisoMensaje, setAvisoMensaje] = useState("")

  const cerrarAviso = () => {
    router.push("/home")
    setAvisoOpen(false)
  }

  const obtenerNivel = (puntos: number): string => {
    if (puntos < eNivel.MINIMO_REQUERIDO_INTERMEDIO) {
      return "Principiante"
    }

    if(puntos < eNivel.MINIMO_REQUERIDO_AVANZADO){
      return "Intermedio"
    }

    return "Avanzado"
  }

  const terminarFormularioFisico = async (data: number) => {
    const resultadoExamen: ResultadoExamenDto = {
      puntos: data,
    }

    try {
      await updateExamen(resultadoExamen)

      const nivel = obtenerNivel(data)

      setAvisoMensaje(
        `Obtuviste una nota de ${data} puntos.
        El nivel de ejercicios a los que puede acceder es: ${nivel}.`
      )

      setAvisoOpen(true)
    } catch (error: any) {
      console.error("Error al guardar el examen físico:", error)

      setAvisoMensaje(
        error?.message ?? "No se pudo guardar el resultado del examen."
      )

      setAvisoOpen(true)
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <RafamHeader />

      <div className="flex flex-col gap-6">
        <div className="bg-rafam-yellow-soft py-6">
          <h1 className="text-center text-3xl font-extrabold text-rafam-blue sm:text-4xl">
            Formulario Físico
          </h1>
        </div>

        <Formulario onSubmit={terminarFormularioFisico} />

        <VolverPagPrincipal />

        <Aviso
          isOpen={avisoOpen}
          onClose={cerrarAviso}
          title="Resultado del examen físico"
          message={avisoMensaje}
        />

        <SiteFooter />
      </div>
    </main>
  )
}
