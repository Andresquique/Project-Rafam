import Link from "next/link"
import { RafamHeader } from "@/components/rafam-header"

export default function AvisoPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background">
      <div className="flex w-full justify-center">
        <RafamHeader small />
      </div>

      <section className="mx-auto w-full max-w-3xl px-6 pb-10">
        <div className="rounded-xl border-2 border-rafam-yellow bg-card px-8 py-10 sm:px-12">
          <h1 className="text-balance text-center text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
            Bienvenido a la aplicacion de actividad fisica para adultos mayores.
          </h1>

          <div className="mt-8 flex flex-col gap-6 text-center text-lg leading-relaxed text-foreground sm:text-xl">
            <p className="text-pretty">
              A continuacion debera tomar un examen fisico que puede realizar desde su casa. El resultado del examen
              indicara el nivel de ejercicio adecuado para usted.
            </p>
            <p className="text-pretty">
              Si no puede realizar el examen en este momento, no se preocupe, podra tomarlo cuando usted desee.
            </p>
            <p className="text-pretty">
              La evaluacion fisica se podra realizar nuevamente 30 dias despues de realizarla.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/home"
            className="rounded-lg bg-rafam-blue px-16 py-4 text-2xl font-bold text-rafam-yellow transition-colors hover:bg-rafam-blue-dark focus:outline-none focus:ring-2 focus:ring-rafam-blue/40"
          >
            Continuar
          </Link>
        </div>
      </section>
    </main>
  )
}
