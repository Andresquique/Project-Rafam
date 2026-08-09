import Link from "next/link";

export function VolverPagPrincipal() {
  return (
    <div className="flex justify-center pt-2">
        <Link
        href="/home"
        className="rounded-lg bg-rafam-blue px-8 py-3 text-lg font-bold text-primary-foreground transition-colors hover:bg-rafam-blue-dark"
        >
        Volver a la pantalla principal
        </Link>
    </div>
  )
}