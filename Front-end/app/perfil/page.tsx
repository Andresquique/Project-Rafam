/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, FormEvent } from "react"
import { Eye, EyeOff } from "lucide-react"
import { RafamHeader } from "@/components/rafam-header"
import { SiteFooter } from "@/components/site-footer"
import { VolverPagPrincipal } from "@/components/volverPagPrincipal"
import Aviso from "@/components/aviso.component"
import { usePerfilUserStore } from "@/stores/perfilUser.store"
import { UpdatePerfilUserDto } from "@/types/perfilUser.types"

/**
 * Normaliza la respuesta del backend por si viene envuelta en { data: {...} }
 * o con nombres de campos alternativos.
 */
function normalizeProfile(raw: any) {
  if (!raw) return null
  const p = raw.data ?? raw
  const credencial = p.credencial ?? p.credenciales ?? {}

  return {
    nombre: p.nombre ?? p.name ?? "",
    fecha_nacimiento: p.fecha_nacimiento ?? p.fechaNacimiento ?? "",
    email: credencial.email ?? p.email ?? "",
  }
}

function toDateInputValue(value?: string | null): string {
  if (!value) return ""

  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10)
  }

  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (match) {
    const [, dd, mm, yyyy] = match
    return `${yyyy}-${mm}-${dd}`
  }

  return ""
}

export default function PerfilPage() {
  const {
    myProfile,
    isLoadingMyProfile,
    myProfileError,
    fetchMyProfile,
    updateMyProfile,
  } = usePerfilUserStore()

  const [name, setName] = useState<string>("")
  const [dob, setDob] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const [editingPassword, setEditingPassword] = useState<boolean>(false)

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const [hasFetched, setHasFetched] = useState<boolean>(false)

  const [nameError, setNameError] = useState<string>("")
  const [dobError, setDobError] = useState<string>("")
  const [emailError, setEmailError] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")

  const [avisoOpen, setAvisoOpen] = useState(false)
  const [avisoMensaje, setAvisoMensaje] = useState("")
  const [avisoTitulo, setAvisoTitulo] = useState("Mi Perfil")

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        await fetchMyProfile()
      } catch (error) {
        console.error("Error al cargar el perfil:", error)
      } finally {
        if (!cancelled) setHasFetched(true)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    console.log("myProfile:", myProfile)

    const profile = normalizeProfile(myProfile)
    if (profile) {
      setName(profile.nombre)
      setDob(toDateInputValue(profile.fecha_nacimiento))
      setEmail(profile.email)
      setPassword("")
    }
  }, [myProfile])

  const validateName = (value: string) => {
    if (!value.trim()) {
      return "El nombre es obligatorio."
    }
    return ""
  }

  const validateDob = (value: string) => {
    if (!value) {
      return "La fecha de nacimiento es obligatoria."
    }
    const today = new Date()
    const birthDate = new Date(value)
    if (birthDate > today) {
      return "La fecha de nacimiento no puede ser en el futuro."
    }
    return ""
  }

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!value.trim()) {
      return "El email es obligatorio."
    } else if (!emailRegex.test(value)) {
      return "El formato del email no es válido."
    }
    return ""
  }

  const validatePassword = (value: string) => {
    if (editingPassword && value.length > 0 && value.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres."
    }
    return ""
  }

  const handleSaveClick = async (e: FormEvent) => {
    e.preventDefault()

    const newNameError = validateName(name)
    const newDobError = validateDob(dob)
    const newEmailError = validateEmail(email)
    const newPasswordError = validatePassword(password)

    setNameError(newNameError)
    setDobError(newDobError)
    setEmailError(newEmailError)
    setPasswordError(newPasswordError)

    if (newNameError || newDobError || newEmailError || newPasswordError) {
      return
    }

    const updateData: UpdatePerfilUserDto = {
      nombre: name,
      fecha_nacimiento: dob,
    }

    const originalEmail = normalizeProfile(myProfile)?.email ?? ""
    const emailChanged = email !== originalEmail
    const passwordChanged = editingPassword && password.length > 0

    if (emailChanged || passwordChanged) {
      updateData.credencial = {}
      if (emailChanged) {
        updateData.credencial.email = email
      }
      if (passwordChanged) {
        updateData.credencial.password = password
      }
    }

    try {
      await updateMyProfile(updateData)
      setAvisoTitulo("Perfil actualizado")
      setAvisoMensaje("Perfil actualizado con éxito.")
      setAvisoOpen(true)
      setEditingPassword(false)
      setPassword("")
    } catch (error: any) {
      const detalle =
        error?.response?.data?.message ??
        error?.message ??
        (typeof error === "string" ? error : "Error desconocido")

      setAvisoTitulo("Error al actualizar")
      setAvisoMensaje(
        "Error de actualización de datos: " +
          (Array.isArray(detalle) ? detalle.join(", ") : detalle)
      )
      setAvisoOpen(true)
    }
  }

  const showLoading = !myProfile && !myProfileError && (isLoadingMyProfile || !hasFetched)
  const showError = !myProfile && !!myProfileError
  const showEmpty = !myProfile && !myProfileError && hasFetched && !isLoadingMyProfile

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <RafamHeader />

      <div className="flex flex-col gap-6">
        <div className="bg-rafam-yellow-soft py-6">
          <h1 className="text-center text-3xl font-extrabold text-rafam-blue sm:text-4xl">
            Mi Perfil
          </h1>
        </div>

        <div className="w-full max-w-4xl px-4 py-4 mx-auto flex justify-center">
          <div className="w-full h-auto rounded-[24px] bg-white border-2 border-yellow-300 p-5 sm:p-6 shadow-[0_12px_40px_rgba(22,66,128,0.08)]">
            {showLoading ? (
              <p className="text-center text-xl text-[#164280]">
                Cargando perfil...
              </p>
            ) : showError ? (
              <div className="flex flex-col items-center gap-4">
                <p className="text-center text-xl text-red-500">
                  Error: {myProfileError}
                </p>
                <button
                  type="button"
                  onClick={() => fetchMyProfile()}
                  className="rounded-xl bg-[#164280] px-6 py-2.5 text-white font-medium hover:bg-[#0f2d57] transition-colors shadow-md"
                >
                  Reintentar
                </button>
              </div>
            ) : showEmpty ? (
              <div className="flex flex-col items-center gap-4">
                <p className="text-center text-xl text-[#164280]">
                  No se pudieron obtener los datos del perfil.
                </p>
                <button
                  type="button"
                  onClick={() => fetchMyProfile()}
                  className="rounded-xl bg-[#164280] px-6 py-2.5 text-white font-medium hover:bg-[#0f2d57] transition-colors shadow-md"
                >
                  Reintentar
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveClick}>
                <section className="flex flex-col w-full mx-auto">
                  <h3 className="text-xl font-bold text-[#164280] pb-1 flex items-center mb-2">
                    Datos personales
                  </h3>
                  <div className="w-full max-w-xl mx-auto">
                    <div className="mb-4 flex flex-col gap-2">
                      <label
                        htmlFor="name"
                        className="text-xl font-bold text-rafam-blue"
                      >
                        Nombre
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value)
                          setNameError("")
                        }}
                        className={`w-full rounded-full border-2 border-rafam-blue bg-card px-5 py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-rafam-blue/40 ${
                          nameError ? "border-red-500" : ""
                        }`}
                        placeholder="Tu nombre"
                        required
                      />
                      {nameError && (
                        <p className="text-sm italic text-red-500">
                          {nameError}
                        </p>
                      )}
                    </div>

                    <div className="mb-4 flex flex-col gap-2">
                      <label
                        htmlFor="dob"
                        className="text-xl font-bold text-rafam-blue"
                      >
                        Fecha de Nacimiento
                      </label>
                      <input
                        type="date"
                        id="dob"
                        name="dob"
                        value={dob}
                        onChange={(e) => {
                          setDob(e.target.value)
                          setDobError("")
                        }}
                        className={`w-full rounded-full border-2 border-rafam-blue bg-card px-5 py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-rafam-blue/40 ${
                          dobError ? "border-red-500" : ""
                        }`}
                        required
                      />
                      {dobError && (
                        <p className="text-sm italic text-red-500">
                          {dobError}
                        </p>
                      )}
                    </div>

                    <div className="mb-4 flex flex-col gap-2">
                      <label
                        htmlFor="email"
                        className="text-xl font-bold text-rafam-blue"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          setEmailError("")
                        }}
                        className={`w-full rounded-full border-2 border-rafam-blue bg-card px-5 py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-rafam-blue/40 ${
                          emailError ? "border-red-500" : ""
                        }`}
                        placeholder="nombre@mail.com"
                        required
                      />
                      {emailError && (
                        <p className="text-sm italic text-red-500">
                          {emailError}
                        </p>
                      )}
                    </div>

                    <div className="mb-2 flex flex-col gap-2">
                      <label
                        htmlFor="password"
                        className="text-xl font-bold text-rafam-blue"
                      >
                        Contraseña
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            setPasswordError("")
                          }}
                          className={`w-full rounded-full border-2 border-rafam-blue bg-card px-5 py-2.5 pr-12 text-base text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-rafam-blue/40 ${
                            passwordError ? "border-red-500" : ""
                          }`}
                          placeholder={
                            editingPassword
                              ? "Nueva contraseña (opcional)"
                              : "Clic para cambiar contraseña"
                          }
                          onFocus={() => setEditingPassword(true)}
                          minLength={
                            editingPassword && password.length > 0 ? 6 : undefined
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-0 flex items-center pr-4 text-rafam-blue/60 hover:text-rafam-blue"
                          aria-label={
                            showPassword
                              ? "Ocultar contraseña"
                              : "Mostrar contraseña"
                          }
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {passwordError && (
                        <p className="text-sm italic text-red-500">
                          {passwordError}
                        </p>
                      )}
                    </div>
                  </div>

                  {myProfileError && (
                    <div className="mb-4 mt-2 rounded-xl border border-red-400 bg-red-100 p-3 text-red-700">
                      {myProfileError}
                    </div>
                  )}

                  <div className="flex justify-center items-center mt-4 pt-2">
                    <button
                      type="submit"
                      className="rounded-xl bg-[#164280] px-6 py-2.5 text-white font-medium hover:bg-[#0f2d57] transition-colors shadow-md disabled:opacity-50"
                      disabled={isLoadingMyProfile}
                    >
                      {isLoadingMyProfile ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </div>
                </section>
              </form>
            )}
          </div>
        </div>

        <VolverPagPrincipal />

        <Aviso
          isOpen={avisoOpen}
          onClose={() => setAvisoOpen(false)}
          title={avisoTitulo}
          message={avisoMensaje}
        />

        <SiteFooter />
      </div>
    </main>
  )
}
