"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { MapPin, Calendar, DollarSign, Target, Users, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { EventoResponse } from "@/application/dto/EventoResponse"

interface EventoDetailProps {
  evento: EventoResponse
}

export function EventoDetail({ evento }: EventoDetailProps) {
  const fechaInicio = format(new Date(evento.fechaInicio), "PPPp", { locale: es })
  const fechaFin = format(new Date(evento.fechaFin), "PPPp", { locale: es })

  return (
    <Card>
      {evento.imagenUrl && (
        <div className="w-full overflow-hidden rounded-t-xl">
          <img
            src={evento.imagenUrl}
            alt={evento.titulo}
            className="w-full rounded-xl object-cover max-h-96"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">{evento.titulo}</CardTitle>
            {evento.intereses && evento.intereses.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {evento.intereses.map((interes) => (
                  <Badge key={interes.id} variant="secondary">
                    {interes.nombre}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="shrink-0">
            {evento.esGratuito ? (
              <Badge variant="secondary" className="text-base px-4 py-1.5">
                Gratuito
              </Badge>
            ) : (
              <span className="text-2xl font-bold text-primary">
                ${evento.costoEntrada.toLocaleString("es-CO")}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-2 text-sm">
            <Calendar className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-medium">Inicio</p>
              <p className="text-muted-foreground capitalize">{fechaInicio}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Calendar className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-medium">Fin</p>
              <p className="text-muted-foreground capitalize">{fechaFin}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-medium">Ubicación</p>
              <p className="text-muted-foreground">{evento.lugarDireccion}</p>
              {evento.ciudad && (
                <p className="text-muted-foreground">{evento.ciudad.nombre}</p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <DollarSign className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-medium">Costo</p>
              {evento.esGratuito ? (
                <Badge variant="secondary">Gratuito</Badge>
              ) : (
                <p className="text-muted-foreground">
                  ${evento.costoEntrada.toLocaleString("es-CO")}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Target className="size-4" />
              Objetivo
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{evento.objetivo}</p>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Eye className="size-4" />
              Descripción del Itinerario
            </h3>
            <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">
              {evento.descripcionItinerario}
            </p>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <Users className="size-4" />
              Público Objetivo
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{evento.publicoObjetivo}</p>
          </div>

          {evento.observaciones && (
            <div>
              <h3 className="text-sm font-semibold">Observaciones</h3>
              <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">
                {evento.observaciones}
              </p>
            </div>
          )}
        </div>

        {!evento.esGratuito && evento.urlTicketeraExterna && (
          <div className="pt-2">
            <a
              href={evento.urlTicketeraExterna}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
            >
              Comprar Entrada
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
