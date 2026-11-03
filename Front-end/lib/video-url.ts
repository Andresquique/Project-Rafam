export type PlayableVideo =
  | { kind: "youtube"; embedUrl: string }
  | { kind: "vimeo"; embedUrl: string }
  | { kind: "file"; src: string }
  | { kind: "unavailable" }

function youtubeEmbed(id: string): PlayableVideo {
  return {
    kind: "youtube",
    embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`,
  }
}

export function getPlayableVideo(url?: string | null): PlayableVideo {
  const trimmed = url?.trim()
  if (!trimmed) return { kind: "unavailable" }

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
      const id = parsed.pathname.split("/").filter(Boolean).pop()
      if (!id) return { kind: "unavailable" }
      return {
        kind: "vimeo",
        embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1`,
      }
    }

    return { kind: "file", src: trimmed }
  } catch {
    return { kind: "unavailable" }
  }
}
