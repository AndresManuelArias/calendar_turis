"use client"

import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, DollarSign, ImageIcon } from "lucide-react"

interface EventoData {
  id: string
  titulo: string
  fechaInicio: string
  fechaFin: string
  lugarDireccion: string
  costoEntrada: number
  esGratuito: boolean
  imagenUrl?: string | null
}

interface EventoCardProps {
  evento: EventoData
}

export function EventoCard({ evento }: EventoCardProps) {
  const fecha = new Date(evento.fechaInicio)
  const fechaFormateada = new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
  }).format(fecha)

  return (
    <Link href={`/eventos/${evento.id}`} className="block">
      <Card className="h-full cursor-pointer transition-shadow hover:shadow-lg">
        {evento.imagenUrl ? (
          <div className="aspect-[16/9] w-full overflow-hidden">
            <img
              src={evento.imagenUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex aspect-[16/9] items-center justify-center bg-muted">
            <ImageIcon className="size-12 text-muted-foreground/40" />
          </div>
        )}
        <CardHeader>
          <CardTitle className="line-clamp-2">{evento.titulo}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="size-4 shrink-0" />
            <span className="capitalize">{fechaFormateada}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4 shrink-0" />
            <span className="line-clamp-1">{evento.lugarDireccion}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="size-4 shrink-0 text-muted-foreground" />
            {evento.esGratuito ? (
              <Badge variant="secondary">Gratuito</Badge>
            ) : (
              <span className="font-medium">
                ${evento.costoEntrada.toLocaleString("es-CO")}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
