import Image from "next/image"
import { LoginForm } from "@/components/login-form"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      {/* Logo */}
      <header className="flex justify-center px-6 pt-8 pb-2">
        <Image
          src="/rafam-logo.png"
          alt="Fundación Rafam - Red de Actividad Física para Adultos Mayores"
          width={420}
          height={200}
          priority
          className="h-auto w-64 object-contain sm:w-80"
        />
      </header>

      {/* Título de bienvenida */}
      <div className="bg-rafam-yellow-soft py-6">
        <h1 className="mx-auto max-w-4xl text-balance px-6 text-center text-3xl font-extrabold uppercase tracking-tight text-rafam-blue sm:text-4xl">
          Bienvenido a la aplicación de ejercicios
        </h1>
      </div>

      {/* Formulario */}
      <section className="px-6 py-10">
        <LoginForm />
      </section>

      {/* Divisor amarillo */}
      <div className="h-1.5 w-full bg-rafam-yellow" aria-hidden="true" />

      {/* Acciones secundarias */}
      <section className="grid flex-1 grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2">
        <div className="flex flex-col items-center gap-5">
          <h2 className="text-2xl font-bold text-rafam-blue">¿No tenes cuenta?</h2>
          <a
            href="#crear-cuenta"
            className="rounded-lg bg-rafam-blue px-10 py-3 text-lg font-bold text-rafam-yellow transition-colors hover:bg-rafam-blue-dark"
          >
            Crear Cuenta
          </a>
        </div>
        <div className="flex flex-col items-center gap-5">
          <h2 className="text-2xl font-bold text-rafam-blue">¿Olvidaste tu contraseña?</h2>
          <a
            href="#recuperar"
            className="rounded-lg bg-rafam-blue px-10 py-3 text-lg font-bold text-rafam-yellow transition-colors hover:bg-rafam-blue-dark"
          >
            Recuperar contraseña
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
