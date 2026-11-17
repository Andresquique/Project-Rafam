import { RafamHeader } from "@/components/rafam-header"
import { SiteFooter } from "@/components/site-footer"
import { VideoCatalog } from "@/components/video-catalog"

export default function VideoPage() {
  // pantalla del catálogo: el listado y los filtros viven en VideoCatalog
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <RafamHeader />

      {/* Título */}
      <div className="bg-rafam-yellow-soft py-6">
        <h1 className="text-center text-3xl font-extrabold text-rafam-blue sm:text-4xl">Catalogo de ejercicios</h1>
      </div>

      {/* este componente se encarga de pedir los videos y de los filtros */}
      <VideoCatalog />

      <SiteFooter />
    </main>
  )
}
