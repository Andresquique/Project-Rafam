export function PageTitleBand({ title }: { title: string }) {
  return (
    <div className="w-full bg-gradient-to-r from-transparent via-rafam-yellow-soft to-transparent py-6">
      <h1 className="text-center text-3xl font-extrabold text-rafam-blue md:text-4xl">{title}</h1>
    </div>
  )
}
