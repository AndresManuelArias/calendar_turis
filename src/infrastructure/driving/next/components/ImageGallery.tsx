"use client"

import { ImageIcon } from "lucide-react"
import type { MediaDto } from "@/application/dto/EventoResponse"

interface ImageGalleryProps {
  media: MediaDto[]
}

export function ImageGallery({ media }: ImageGalleryProps) {
  const imagenes = media.filter((m) => m.tipo === "IMAGEN")

  if (imagenes.length === 0) return null

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">Galería de Imágenes</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {imagenes.map((img) => (
          <a
            key={img.id}
            href={img.urlArchivo}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-video overflow-hidden rounded-lg bg-muted"
          >
            <img
              src={img.urlArchivo}
              alt=""
              className="size-full object-cover transition-transform group-hover:scale-105"
              onError={(e) => {
                const target = e.currentTarget
                target.style.display = "none"
                const fallback = target.nextElementSibling as HTMLElement | null
                if (fallback) fallback.style.display = "flex"
              }}
            />
            <div
              className="hidden absolute inset-0 flex-col items-center justify-center text-muted-foreground"
              aria-hidden
            >
              <ImageIcon className="size-8" />
              <span className="mt-1 text-xs">Imagen no disponible</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
