// Banda con el título que uso arriba de cada pantalla del panel de admin.
// Solo recibe el texto por props, no tiene estado ni nada más.
export function PageTitleBand({ title }: { title: string }) {
  return (
    // el degradado de los costados lo hice con from-transparent y via-rafam-yellow-soft
    <div className="w-full bg-gradient-to-r from-transparent via-rafam-yellow-soft to-transparent py-6">
      <h1 className="text-center text-3xl font-extrabold text-rafam-blue md:text-4xl">{title}</h1>
    </div>
  )
}
