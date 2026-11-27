"use client"

import { Suspense, useState, type FormEvent } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import { AlertTriangle, Check, Eye, EyeOff, KeyRound } from "lucide-react"
import apiClient from "@/api/axios.client"
import { RafamHeader } from "@/components/rafam-header"
import { SiteFooter } from "@/components/site-footer"

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message
    if (Array.isArray(message)) return message.join(" ")
    if (typeof message === "string" && message.trim()) return message
  }

  return "No se pudo restablecer la contraseña. Intentá nuevamente."
}

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")?.trim() ?? ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  if (!token) {
    return (
      <section className="w-full max-w-3xl">
        <div className="flex flex-col items-center rounded-xl border-2 border-rafam-yellow bg-card px-8 py-12 sm:px-12">
          <span
            className="flex h-40 w-40 items-center justify-center rounded-3xl bg-[oklch(0.7_0.19_50)] text-primary-foreground"
            aria-hidden="true"
          >
            <AlertTriangle className="h-24 w-24" strokeWidth={2.25} stroke="var(--card)" />
          </span>

          <h1 className="mt-8 text-center text-3xl font-extrabold text-foreground sm:text-4xl">
            Enlace inválido
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-center text-lg leading-relaxed text-foreground sm:text-xl">
            El enlace de recuperación está incompleto o no es válido. Solicitá un nuevo enlace desde la pantalla de
            inicio.
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="rounded-lg bg-rafam-blue px-16 py-4 text-2xl font-bold text-rafam-yellow transition-colors hover:bg-rafam-blue-dark focus:outline-none focus:ring-2 focus:ring-rafam-blue/40"
          >
            Volver al inicio
          </Link>
        </div>
      </section>
    )
  }

  if (successMessage) {
    return (
      <section className="w-full max-w-3xl">
        <div className="flex flex-col items-center rounded-xl border-2 border-rafam-yellow bg-card px-8 py-12 sm:px-12">
          <span
            className="flex h-40 w-40 items-center justify-center rounded-3xl bg-[oklch(0.7_0.19_50)] text-primary-foreground"
            aria-hidden="true"
          >
            <Check className="h-24 w-24" strokeWidth={2.5} stroke="var(--card)" />
          </span>

          <h1 className="mt-8 text-center text-3xl font-extrabold text-foreground sm:text-4xl">
            Contraseña actualizada
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-center text-lg leading-relaxed text-foreground sm:text-xl">
            {successMessage}
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="rounded-lg bg-rafam-blue px-16 py-4 text-2xl font-bold text-rafam-yellow transition-colors hover:bg-rafam-blue-dark focus:outline-none focus:ring-2 focus:ring-rafam-blue/40"
          >
            Ir al inicio de sesión
          </Link>
        </div>
      </section>
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setServerError("")

    const passwordValidationMessage = !password
      ? "La contraseña es obligatoria."
      : password.length < 6
        ? "La contraseña debe tener al menos 6 caracteres."
        : ""

    const confirmPasswordValidationMessage = !confirmPassword
      ? "Confirmar contraseña es obligatorio."
      : password !== confirmPassword
        ? "Las contraseñas no coinciden."
        : ""

    setPasswordError(passwordValidationMessage)
    setConfirmPasswordError(confirmPasswordValidationMessage)

    if (passwordValidationMessage || confirmPasswordValidationMessage) {
      return
    }

    try {
      setIsSubmitting(true)
      const response = await apiClient.post<{ message: string }>("/auth/reset-password", {
        token,
        newPassword: password,
      })
      setSuccessMessage(response.data?.message ?? "La contraseña se actualizó correctamente.")
    } catch (error) {
      setServerError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="w-full max-w-3xl">
      <form onSubmit={handleSubmit} data-testid="form-reset-password">
        <div className="flex flex-col items-center rounded-xl border-2 border-rafam-yellow bg-card px-8 py-12 sm:px-12">
          <span
            className="flex h-40 w-40 items-center justify-center rounded-3xl bg-[oklch(0.7_0.19_50)] text-primary-foreground"
            aria-hidden="true"
          >
            <KeyRound className="h-24 w-24" strokeWidth={2.25} stroke="var(--card)" />
          </span>

          <h1 className="mt-8 text-center text-3xl font-extrabold text-foreground sm:text-4xl">
            Restablecer Contraseña
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-center text-lg leading-relaxed text-foreground sm:text-xl">
            Ingresá y confirmá tu nueva contraseña para recuperar el acceso a tu cuenta.
          </p>

          <div className="mt-8 w-full max-w-xl">
            {serverError && (
              <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-center text-sm font-semibold text-destructive">
                {serverError}
              </div>
            )}

            <div className="mb-4 flex flex-col gap-2">
              <label htmlFor="newPassword" className="text-xl font-bold text-rafam-blue">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setPasswordError("")
                    setConfirmPasswordError(
                      confirmPassword && e.target.value !== confirmPassword ? "Las contraseñas no coinciden." : "",
                    )
                  }}
                  className={`w-full rounded-full border-2 border-rafam-blue bg-card px-5 py-2.5 pr-12 text-base text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-rafam-blue/40 ${passwordError ? "border-red-500" : ""}`}
                  placeholder="********"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-rafam-blue/60 hover:text-rafam-blue"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {passwordError && <p className="text-sm italic text-red-500">{passwordError}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmNewPassword" className="text-xl font-bold text-rafam-blue">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setConfirmPasswordError("")
                  }}
                  className={`w-full rounded-full border-2 border-rafam-blue bg-card px-5 py-2.5 pr-12 text-base text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-rafam-blue/40 ${confirmPasswordError ? "border-red-500" : ""}`}
                  placeholder="********"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-rafam-blue/60 hover:text-rafam-blue"
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {confirmPasswordError && <p className="text-sm italic text-red-500">{confirmPasswordError}</p>}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-muted px-10 py-4 text-xl font-bold text-foreground transition-colors hover:bg-muted/70 focus:outline-none focus:ring-2 focus:ring-rafam-blue/40"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-rafam-blue px-16 py-4 text-2xl font-bold text-rafam-yellow transition-colors hover:bg-rafam-blue-dark focus:outline-none focus:ring-2 focus:ring-rafam-blue/40 disabled:opacity-50"
          >
            {isSubmitting ? "Guardando..." : "Guardar contraseña"}
          </button>
        </div>
      </form>
    </section>
  )
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <div className="flex w-full justify-center">
        <RafamHeader small />
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <Suspense
          fallback={
            <p className="text-center text-lg font-semibold text-rafam-blue">Cargando...</p>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>

      <SiteFooter />
    </main>
  )
}
