'use client'

import { Pencil, FileX, UserRound } from 'lucide-react'
import { PerfilAdmin } from '@/types/perfilAdmin.types'

interface UserAdminRowProps {
  user: PerfilAdmin
  onEdit: (user: PerfilAdmin) => void
  onDelete: (id: number) => void
}

export function UserAdminRow({ user, onEdit, onDelete }: UserAdminRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-rafam-blue/40 px-4 py-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
        <UserRound className="h-6 w-6" />
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-x-8 gap-y-1">
        <span className="font-bold text-foreground">Nombre: {user.nombre || 'Sin nombre'}</span>
        <span className="font-bold text-foreground">Mail: {user.credencial?.email || '—'}</span>
        <span className="font-bold text-foreground">Rol: {user.rol}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          aria-label={`Editar ${user.nombre || 'usuario'}`}
          onClick={() => onEdit(user)}
          className="rounded-md bg-rafam-blue p-2 text-white transition-opacity hover:opacity-90"
        >
          <Pencil className="h-5 w-5" />
        </button>
        <button
          aria-label={`Eliminar ${user.nombre || 'usuario'}`}
          onClick={() => onDelete(user.credencialesId)}
          className="rounded-md bg-destructive p-2 text-destructive-foreground transition-opacity hover:opacity-90"
        >
          <FileX className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
