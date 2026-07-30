'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
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
  }, [user])

  if (!open) return null

  const handleSave = () => {
    if (!user) return
    onSave(user.credencialesId, {
      nombre,
      credencial: { email },
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center pb-3">
          <Image
            src="/rafam-logo.png"
            alt="Fundación Rafam"
            width={160}
            height={56}
            className="h-auto w-[150px]"
          />
        </div>
        <div className="rounded-lg border-4 border-rafam-yellow bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-foreground">Editar Usuario</h2>
            <button
              aria-label="Cerrar"
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>

          <p className="mb-4 text-sm text-muted-foreground">
            <span className="font-bold text-foreground">Usuario:</span> {user?.nombre || 'Sin nombre'}
          </p>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-bold text-foreground">
                Nombre <span className="text-destructive">*</span>
              </label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-foreground">
                Email <span className="text-destructive">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-foreground">
                Rol <span className="text-destructive">*</span>
              </label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm text-foreground"
                disabled
              >
                {roles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-center gap-4">
          <button
            onClick={handleSave}
            className="rounded-md bg-rafam-blue px-8 py-2.5 text-lg font-bold text-rafam-yellow transition-opacity hover:opacity-90"
          >
            Guardar
          </button>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md bg-rafam-blue px-8 py-2.5 text-lg font-bold text-rafam-yellow transition-opacity hover:opacity-90"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
