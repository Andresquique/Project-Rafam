import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Para juntar clases de Tailwind sin que se pisen, por ejemplo "p-2 p-4" se queda en "p-4"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
