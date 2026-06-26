"use client"

import { VideoIcon } from "lucide-react"
import type { MediaDto } from "@/application/dto/EventoResponse"

interface VideoEmbedProps {
  media: MediaDto[]
}

function getEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url)

    if (parsed.hostname.includes("youtube.com") || parsed.hostname.includes("youtu.be")) {
      let videoId: string | null = null

      if (parsed.hostname.includes("youtu.be")) {
        videoId = parsed.pathname.slice(1)
      } else if (parsed.pathname === "/watch") {
        videoId = parsed.searchParams.get("v")
      } else if (parsed.pathname.startsWith("/embed/")) {
        videoId = parsed.pathname.replace("/embed/", "")
      }

      if (videoId) {
        videoId = videoId.split("&")[0]
        return `https://www.youtube.com/embed/${videoId}`
      }
    }

    if (parsed.hostname.includes("vimeo.com")) {
      const videoId = parsed.pathname.replace("/", "")
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId}`
      }
    }

    return url
  } catch {
    return null
  }
}

export function VideoEmbed({ media }: VideoEmbedProps) {
  const videos = media.filter((m) => m.tipo === "VIDEO_EMBEDDED")

  if (videos.length === 0) return null

  return (
    <div>
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <VideoIcon className="size-5" />
        Videos
      </h3>
      <div className="space-y-4">
        {videos.map((vid) => {
          const embedUrl = getEmbedUrl(vid.urlArchivo)
          if (!embedUrl) return null

          return (
            <div key={vid.id} className="aspect-video overflow-hidden rounded-lg bg-muted">
              <iframe
                src={embedUrl}
                title="Video del evento"
                className="size-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
