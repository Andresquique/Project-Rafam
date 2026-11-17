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
  // updateExamen guarda el resultado del examen en el backend
  const { updateExamen } = useExamenStore()

  // controlo el aviso que aparece con el resultado final
  const [avisoOpen, setAvisoOpen] = useState(false)
  const [avisoMensaje, setAvisoMensaje] = useState("")

  // al cerrar el aviso mandamos al home para que vea el menú
  const cerrarAviso = () => {
    router.push("/home")
    setAvisoOpen(false)
  }

  // según los puntos saco el nombre del nivel que le toca al usuario
  const obtenerNivel = (puntos: number): string => {
    if (puntos < eNivel.MINIMO_REQUERIDO_INTERMEDIO) {
      return "Principiante"
    }

    // fijate que el corte de avanzado es 7, no 6
    if(puntos < eNivel.MINIMO_REQUERIDO_AVANZADO){
      return "Intermedio"
    }

    return "Avanzado"
  }

  // esto lo llama el formulario cuando termina, con el total de puntos
  const terminarFormularioFisico = async (data: number) => {
    const resultadoExamen: ResultadoExamenDto = {
      puntos: data,
    }

    try {
      await updateExamen(resultadoExamen)

      const nivel = obtenerNivel(data)

      // armo el mensaje con los puntos y el nivel calculado
      setAvisoMensaje(
        `Obtuviste una nota de ${data} puntos.
        El nivel de ejercicios a los que puede acceder es: ${nivel}.`
      )

      setAvisoOpen(true)
    } catch (error: any) {
      console.error("Error al guardar el examen físico:", error)

      // si falla el guardado igual le mostramos el error en el mismo aviso
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
        {/* título de la pantalla */}
        <div className="bg-rafam-yellow-soft py-6">
          <h1 className="text-center text-3xl font-extrabold text-rafam-blue sm:text-4xl">
            Formulario Físico
          </h1>
        </div>

        {/* el formulario es un componente aparte y avisa por onSubmit */}
        <Formulario onSubmit={terminarFormularioFisico} />

        <VolverPagPrincipal />

        {/* aviso con el resultado o con el error */}
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
