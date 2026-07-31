import Link from "next/link"
import { Tv, ListChecks, UserPen } from "lucide-react"
import { RafamHeader } from "@/components/rafam-header"
import { SiteFooter } from "@/components/site-footer"

const actions = [
  { label: "Ver videos", href: "/aviso2", Icon: Tv },
  { label: "Tomar examen", href: "/formulario", Icon: ListChecks },
  { label: "Mis datos", href: "#datos", Icon: UserPen },
]

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <RafamHeader />

      {/* Acciones principales */}
      <section className="border-y-2 border-rafam-yellow px-6 py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-3">
          {actions.map(({ label, href, Icon }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-4 rounded-lg py-4 text-rafam-blue transition-colors hover:text-rafam-blue-dark focus:outline-none focus:ring-2 focus:ring-rafam-blue/40"
            >
              <Icon className="h-16 w-16" strokeWidth={1.75} aria-hidden="true" />
              <span className="text-2xl font-bold">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Salir */}
      <section className="flex flex-1 items-start justify-center px-6 py-14">
        <Link
          href="/"
          className="rounded-lg bg-rafam-blue px-12 py-4 text-2xl font-bold text-rafam-yellow transition-colors hover:bg-rafam-blue-dark focus:outline-none focus:ring-2 focus:ring-rafam-blue/40"
        >
          Salir de la aplicacion
        </Link>
      </section>

      <SiteFooter />
    </main>
  )
}
