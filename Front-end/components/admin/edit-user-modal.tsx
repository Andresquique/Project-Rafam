
'use client'

import { useEffect, useState, FormEvent } from 'react'
import { X } from 'lucide-react'
import { PerfilAdmin, UpdatePerfilAdminDto } from '@/types/perfilAdmin.types'

const roles = ['admin', 'user']

interface EditUserModalProps {
  user: PerfilAdmin | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (id: number, data: UpdatePerfilAdminDto) => void
}

export function EditUserModal({ user, open, onOpenChange, onSave }: EditUserModalProps) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [rol, setRol] = useState('user')

  const [nombreError, setNombreError] = useState('')
  const [emailError, setEmailError] = useState('')

  useEffect(() => {
    if (user) {
      setNombre(user.nombre || '')
      setEmail(user.credencial?.email || '')
      setRol(user.rol)
    } else {
      setNombre('')
      setEmail('')
      setRol('user')
    }

    setNombreError('')
    setEmailError('')
  }, [user])

  if (!open) return null

  const validateNombre = (value: string) =>
    !value.trim() ? 'El nombre es obligatorio.' : ''

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!value.trim()) return 'El email es obligatorio.'
    if (!emailRegex.test(value)) return 'El formato del email no es válido.'

    return ''
  }

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    if (!user) return

    const newNombreError = validateNombre(nombre)
    const newEmailError = validateEmail(email)

    setNombreError(newNombreError)
    setEmailError(newEmailError)

    if (newNombreError || newEmailError) return

    onSave(user.credencialesId, {
      nombre,
      credencial: { email },
    })
  }

  const inputBase =
    'w-full rounded-full border-2 border-rafam-blue bg-card px-5 py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-rafam-blue/40'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSave}
          className="relative rounded-[24px] border-2 border-yellow-300 bg-white p-5 shadow-[0_12px_40px_rgba(22,66,128,0.08)] sm:p-6"
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 text-rafam-blue/60 transition-colors hover:text-rafam-blue"
          >
            <X className="h-5 w-5" />
          </button>

          <h2 className="mb-1 pb-1 text-xl font-bold text-[#164280]">
            Editar Usuario
          </h2>

          <p className="mb-4 text-base text-foreground">
            <span className="font-bold text-rafam-blue">Nivel físico:</span>{' '}
            {user?.nivel_actual?.nombre || 'Sin nivel asignado'}
          </p>

          <div className="mx-auto w-full">
            {/* Nombre */}
            <div className="mb-4 flex flex-col gap-2">
              <label htmlFor="edit-nombre" className="text-xl font-bold text-rafam-blue">
                Nombre
              </label>

              <input
                id="edit-nombre"
                type="text"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value)
                  setNombreError('')
                }}
                placeholder="Nombre del usuario"
                className={`${inputBase} ${nombreError ? 'border-red-500' : ''}`}
                required
              />

              {nombreError && (
                <p className="text-sm italic text-red-500">{nombreError}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4 flex flex-col gap-2">
              <label htmlFor="edit-email" className="text-xl font-bold text-rafam-blue">
                Email
              </label>

              <input
                id="edit-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailError('')
                }}
                placeholder="nombre@mail.com"
                className={`${inputBase} ${emailError ? 'border-red-500' : ''}`}
                required
              />

              {emailError && (
                <p className="text-sm italic text-red-500">{emailError}</p>
              )}
            </div>

            {/* Rol */}
            <div className="mb-2 flex flex-col gap-2">
              <label htmlFor="edit-rol" className="text-xl font-bold text-rafam-blue">
                Rol
              </label>

              <select
                id="edit-rol"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className={inputBase}
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="mt-4 flex items-center justify-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-xl bg-[#164280] px-6 py-2.5 font-medium text-white shadow-md transition-colors hover:bg-[#0f2d57]"
            >
              Guardar Cambios
            </button>

            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-2 border-[#164280] bg-white px-6 py-2.5 font-medium text-[#164280] transition-colors hover:bg-[#164280]/5"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
