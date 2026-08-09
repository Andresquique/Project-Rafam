"use client"

import Link from "next/link"
import { RafamHeader } from "@/components/rafam-header"
import { SiteFooter } from "@/components/site-footer"
import { Formulario } from "@/components/FormularioFisico/formulario"
import { VolverPagPrincipal } from "@/components/volverPagPrincipal"
import { useExamenStore } from '@/stores/examenFisico.store';
import { ResultadoExamenDto } from "@/types/examenFisico.types"

export default function FormularioPage() {
  const { updateExamen } = useExamenStore();
  const terminarFormularioFisico = async (data: number) => {
    const resultadoExamen: ResultadoExamenDto = {
      puntos: data,
    };
    await updateExamen(resultadoExamen);
  };
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <RafamHeader />
      {/* Título */}

      <div className="flex flex-col gap-6">
        <div className="bg-rafam-yellow-soft py-6">
          <h1 className="text-center text-3xl font-extrabold text-rafam-blue sm:text-4xl">Formulario Físico</h1>
        </div>
        <Formulario onSubmit={terminarFormularioFisico}/>
        <VolverPagPrincipal />
        <SiteFooter />
      </div>

    </main>
  )
}
