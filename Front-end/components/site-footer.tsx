// Footer de la app. Por ahora tiene datos de contacto de ejemplo
// y el logo, no recibe props ni maneja estado.
import Image from "next/image"

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-rafam-lightblue">
      <div className="mx-auto grid grid-cols-1 items-center gap-6 px-8 py-6 sm:grid-cols-2">
        <ul className="flex flex-col gap-2 font-bold text-foreground">
          {/* pendiente: cambiar estos textos por los datos reales de contacto */}
          <li>Contacto</li>
          <li>Telefono</li>
          <li>Email</li>
        </ul>
        <div className="flex justify-center sm:justify-end">
          <div className="rounded-md bg-card p-3">
            <Image
              src="/rafam-logo.png"
              alt="Fundación Rafam"
              width={280}
              height={130}
              className="h-auto w-40 object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
