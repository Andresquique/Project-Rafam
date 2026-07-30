import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { RafamHeader } from "@/components/rafam-header"

export default function Aviso2Page() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background">
      <div className="flex w-full justify-center">
        <RafamHeader small />
      </div>

      <section className="mx-auto w-full max-w-3xl px-6 pb-10">
        <div className="flex flex-col items-center rounded-xl border-2 border-rafam-yellow bg-card px-8 py-12 sm:px-12">
          <span
            className="flex h-40 w-40 items-center justify-center rounded-3xl bg-[oklch(0.7_0.19_50)] text-primary-foreground"
            aria-hidden="true"
          >
            <AlertTriangle className="h-24 w-24" strokeWidth={2.25} fill="currentColor" stroke="var(--card)" />
          </span>

          <h1 className="mt-8 text-center text-3xl font-extrabold text-foreground sm:text-4xl">
            Falta realizar examen fisico.
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-center text-lg leading-relaxed text-foreground sm:text-xl">
            Para poder mostrarle ejercicios adecuados a su estado fisico debera tomar el examen de aptitud fisica.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/video"
            className="rounded-lg bg-rafam-blue px-16 py-4 text-2xl font-bold text-rafam-yellow transition-colors hover:bg-rafam-blue-dark focus:outline-none focus:ring-2 focus:ring-rafam-blue/40"
          >
            Continuar
          </Link>
        </div>
      </section>
    </main>
  )
}
