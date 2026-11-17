"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { SiteFooter } from "@/components/site-footer"
import SignInComponent from "@/components/signin-form.component"
import Aviso from "@/components/aviso.component"
import { useAuthStore } from "@/stores/auth.store"
import { RegisterDto } from "@/types/auth.types"

export default function Page() {
  const router = useRouter()
  // register es la acción del store que crea la cuenta
  const { register } = useAuthStore()

  // controla el modal de "Crear cuenta"
  const [crearCuentaOpen, setCrearCuentaOpen] = useState(false)
  // aviso de éxito o error después de registrarse
  const [avisoOpen, setAvisoOpen] = useState(false)
  const [avisoMensaje, setAvisoMensaje] = useState("")
  const [avisoTitulo, setAvisoTitulo] = useState("Crear Cuenta")
  // me sirve para saber si al cerrar el aviso tengo que mandarlo al home
  const [registroExitoso, setRegistroExitoso] = useState(false)

  // lo llama el modal de registro con los datos del formulario
  const handleCrearCuenta = async (data: RegisterDto): Promise<void> => {
    try {
      const resultado = await register(data)
      setCrearCuentaOpen(false)
      setAvisoTitulo("Cuenta creada")
      setAvisoMensaje("Tu cuenta se creó con éxito.")
      setRegistroExitoso(true)
      setAvisoOpen(true)
    } catch (error: any) {
      // si algo sale mal muestro el mensaje del backend y vuelvo a lanzar el error
      setAvisoTitulo("Error al crear la cuenta")
      setAvisoMensaje(error?.message ?? "No se pudo crear la cuenta.")
      setRegistroExitoso(false)
      setAvisoOpen(true)
      throw error
    }
  }

  // al cerrar el aviso, si el registro salió bien lo mando directo al home
  const cerrarAviso = () => {
    setAvisoOpen(false)
    if (registroExitoso) {
      router.push("/home")
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-background">
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

      <div className="bg-rafam-yellow-soft py-6">
        <h1 className="mx-auto max-w-4xl text-balance px-6 text-center text-3xl font-extrabold uppercase tracking-tight text-rafam-blue sm:text-4xl">
          Bienvenido a la aplicación de ejercicios
        </h1>
      </div>

      <section className="px-6 py-10">
        {/* el formulario de login ya maneja solo el submit y el redirect según el rol */}
        <LoginForm />
      </section>

      <div className="h-1.5 w-full bg-rafam-yellow" aria-hidden="true" />

      <section className="grid flex-1 grid-cols-1 gap-10 px-6 py-12 sm:grid-cols-2">
        {/* crear cuenta abre el modal de registro */}
        <div className="flex flex-col items-center gap-5">
          <h2 className="text-2xl font-bold text-rafam-blue">¿No tenes cuenta?</h2>
          <button
            type="button"
            onClick={() => setCrearCuentaOpen(true)}
            className="rounded-lg bg-rafam-blue px-10 py-3 text-lg font-bold text-rafam-yellow transition-colors hover:bg-rafam-blue-dark"
          >
            Crear Cuenta
          </button>
        </div>
        <div className="flex flex-col items-center gap-5">
          <h2 className="text-2xl font-bold text-rafam-blue">¿Olvidaste tu contraseña?</h2>
          {/* pendiente: recuperar contraseña todavía no está implementado, es solo un ancla */}
          
          <a href="#recuperar"
            className="rounded-lg bg-rafam-blue px-10 py-3 text-lg font-bold text-rafam-yellow transition-colors hover:bg-rafam-blue-dark"
          >
            Recuperar contraseña
          </a>
        </div>
      </section>

      <SiteFooter />

      {/* modal para registrarse; al enviar llama a handleCrearCuenta */}
      <SignInComponent
        isOpen={crearCuentaOpen}
        onClose={() => setCrearCuentaOpen(false)}
        onSubmit={handleCrearCuenta}
      />

      <Aviso
        isOpen={avisoOpen}
        onClose={cerrarAviso}
        title={avisoTitulo}
        message={avisoMensaje}
      />
    </main>
  )
}