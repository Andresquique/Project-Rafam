// Header simple con el logo de la fundación.
// La prop small sirve para achicarlo un poco en algunas pantallas.
import Image from "next/image"

export function RafamHeader({ small = false }: { small?: boolean }) {
  return (
    <header className="flex px-6 pt-8 pb-2">
      {/* priority para que el logo cargue primero, es lo primero que se ve */}
      <Image
        src="/rafam-logo.png"
        alt="Fundación Rafam - Red de Actividad Física para Adultos Mayores"
        width={420}
        height={200}
        priority
        className={small ? "h-auto w-48 object-contain" : "h-auto w-56 object-contain"}
      />
    </header>
  )
}
