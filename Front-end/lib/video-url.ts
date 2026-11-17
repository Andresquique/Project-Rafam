export type PlayableVideo =
  | { kind: "youtube"; embedUrl: string }
  | { kind: "vimeo"; embedUrl: string }
  | { kind: "file"; src: string }
  | { kind: "unavailable" }

// Armo el link de YouTube ya listo para poner en un iframe
function youtubeEmbed(id: string): PlayableVideo {
  return {
    kind: "youtube",
    embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`,
  }
}

// Recibo la URL que viene del back y la transformo en algo que el reproductor pueda mostrar
export function getPlayableVideo(url?: string | null): PlayableVideo {
  const trimmed = url?.trim()
  if (!trimmed) return { kind: "unavailable" }

  // esto lo saqué de la documentación pero funciona bien para los links cortos y los de /shorts
  try {
    const parsed = new URL(trimmed)
    const host = parsed.hostname.replace(/^www\./, "")

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0]
      return id ? youtubeEmbed(id) : { kind: "unavailable" }
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (parsed.pathname.startsWith("/embed/")) {
        const id = parsed.pathname.split("/")[2]
        return id ? youtubeEmbed(id) : { kind: "unavailable" }
      }
      if (parsed.pathname.startsWith("/shorts/")) {
        const id = parsed.pathname.split("/")[2]
        return id ? youtubeEmbed(id) : { kind: "unavailable" }
      }
      const id = parsed.searchParams.get("v")
      return id ? youtubeEmbed(id) : { kind: "unavailable" }
    }

    if (host === "vimeo.com" || host === "player.vimeo.com") {
      // el id siempre queda al final del path, por eso uso pop()
      const id = parsed.pathname.split("/").filter(Boolean).pop()
      if (!id) return { kind: "unavailable" }
      return {
        kind: "vimeo",
        embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1`,
      }
    }

    // si no es de YouTube ni de Vimeo lo trato como un archivo de video normal
    return { kind: "file", src: trimmed }
  } catch {
    // acá tuve que arreglar un bug: cuando la URL venía mal escrita, antes se rompía todo el catálogo
    return { kind: "unavailable" }
  }
}
