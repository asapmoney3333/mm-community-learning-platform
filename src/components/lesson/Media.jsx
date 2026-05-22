function normalizeYouTubeUrl(url) {
  try {
    const parsed = new URL(url)

    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1)
    }

    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v")
      }

      const shortsMatch = parsed.pathname.match(/^\/shorts\/([^/?]+)/)
      if (shortsMatch) {
        return shortsMatch[1]
      }

      const embedMatch = parsed.pathname.match(/^\/embed\/([^/?]+)/)
      if (embedMatch) {
        return embedMatch[1]
      }
    }
  } catch {
    return ""
  }

  return ""
}

export function ExternalImage({
  src,
  alt,
  caption,
  rounded = true,
}) {
  return (
    <figure className="my-8 overflow-hidden">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        className={`w-full border border-white/10 bg-slate-900/60 object-cover shadow-[0_20px_55px_rgba(0,0,0,0.2)] ${rounded ? "rounded-[1.5rem]" : "rounded-none"}`}
      />
      {caption ? (
        <figcaption className="mt-3 text-sm leading-6 text-slate-400">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

export function YouTubeEmbed({
  id,
  url,
  title,
  caption,
  start,
}) {
  const videoId = id || normalizeYouTubeUrl(url)

  if (!videoId) {
    return (
      <div className="my-8 rounded-[1.5rem] border border-rose-300/20 bg-rose-300/10 p-5 text-sm text-rose-100">
        Invalid YouTube video reference.
      </div>
    )
  }

  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
  })

  if (start) {
    params.set("start", String(start))
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`

  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/75 shadow-[0_20px_55px_rgba(0,0,0,0.24)]">
        <div className="aspect-video w-full">
          <iframe
            src={embedUrl}
            title={title || "YouTube video"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-3 text-sm leading-6 text-slate-400">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
