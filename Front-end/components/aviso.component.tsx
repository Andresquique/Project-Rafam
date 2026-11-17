// Aviso grande a pantalla completa que le aparece al usuario cuando todavía
// no hizo el examen físico. Recibe si está abierto, la función para cerrarlo
// y opcionalmente un título y un mensaje (si no vienen, usa los de por defecto).
"use client"

import { AlertTriangle, X } from "lucide-react"
// el X quedó importado de antes, ahora el cierre es con el botón de abajo

interface AvisoProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
}

export default function Aviso({
  isOpen,
  onClose,
  title = "Falta realizar examen fisico.",
  message = "Para poder mostrarle ejercicios adecuados a su estado fisico debera tomar el examen de aptitud fisica.",
}: AvisoProps) {
  // si está cerrado no dibujo nada
  if (!isOpen) return null

  return (
    // ojo que hacé click en cualquier lado del fondo y se cierra
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white px-6"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      {/* freno la propagación para que tocar el cartel no lo cierre */}
      <section
        className="relative mx-auto w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center rounded-xl border-2 border-rafam-yellow bg-card px-8 py-12 sm:px-12">

          <span
            className="flex h-40 w-40 items-center justify-center rounded-3xl bg-[oklch(0.7_0.19_50)] text-primary-foreground"
            aria-hidden="true"
          >
            <AlertTriangle
              className="h-24 w-24"
              strokeWidth={2.25}
              fill="currentColor"
              stroke="var(--card)"
            />
          </span>

          <h1 className="mt-8 text-center text-3xl font-extrabold text-foreground sm:text-4xl">
            {title}
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-center text-lg leading-relaxed text-foreground sm:text-xl">
            {message}
          </p>
        </div>
        
        <div className="mt-8 flex justify-center">
          {/* el botón y el click en el fondo hacen lo mismo: llaman a onClose */}
          <button
            onClick={onClose}
            className="rounded-lg bg-rafam-blue px-16 py-4 text-2xl font-bold text-rafam-yellow transition-colors hover:bg-rafam-blue-dark focus:outline-none focus:ring-2 focus:ring-rafam-blue/40"
          >
            Cerrar
          </button>
        </div>
      </section>
    </div>
  )
}