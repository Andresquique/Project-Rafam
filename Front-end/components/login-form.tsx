"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/auth.store"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login, isLoading, error } = useAuthStore()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await login({ email, password })
      const { user } = useAuthStore.getState()
      if (user?.rol === 'admin' || user?.rol === 'Administrador') {
        router.push('/admin')
      } else {
        router.push('/home')
      }
    } catch {
      // error is already set in the store
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-sm flex-col gap-5">
      {error && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-center text-sm font-semibold text-destructive">
          {error}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-xl font-bold text-rafam-blue">
          Mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nombre@mail.com"
          required
          className="w-full rounded-full border-2 border-rafam-blue bg-card px-5 py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-rafam-blue/40"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-xl font-bold text-rafam-blue">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          required
          className="w-full rounded-full border-2 border-rafam-blue bg-card px-5 py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-rafam-blue/40"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mx-auto mt-2 rounded-lg bg-rafam-blue px-10 py-3 text-lg font-bold text-primary-foreground transition-colors hover:bg-rafam-blue-dark focus:outline-none focus:ring-2 focus:ring-rafam-blue/40 disabled:opacity-50"
      >
        {isLoading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  )
}
