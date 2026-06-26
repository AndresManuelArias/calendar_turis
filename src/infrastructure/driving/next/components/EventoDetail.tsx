"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { MapPin, Calendar, DollarSign, Target, Users, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { EventoResponse } from "@/application/dto/EventoResponse"

interface EventoDetailProps {
  evento: EventoResponse
}

export function EventoDetail({ evento }: EventoDetailProps) {
  const fechaInicio = format(new Date(evento.fechaInicio), "PPPp", { locale: es })
  const fechaFin = format(new Date(evento.fechaFin), "PPPp", { locale: es })

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {evento.imagenUrl && (
        <div className="w-full overflow-hidden">
          <img
            src={evento.imagenUrl}
            alt={evento.titulo}
            className="w-full max-h-96 object-cover"
          />
        </div>
      )}
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">{evento.titulo}</h2>
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
              <Badge className="bg-green-100 text-green-700 text-base px-4 py-1.5 border-0">
                Gratuito
              </Badge>
            ) : (
              <span className="text-2xl font-bold text-gray-900">
                ${evento.costoEntrada.toLocaleString("es-CO")}
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-2 text-sm">
            <Calendar className="mt-0.5 size-4 shrink-0 text-gray-500" />
            <div>
              <p className="font-medium text-gray-700">Inicio</p>
              <p className="text-gray-600 capitalize">{fechaInicio}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <Calendar className="mt-0.5 size-4 shrink-0 text-gray-500" />
            <div>
              <p className="font-medium text-gray-700">Fin</p>
              <p className="text-gray-600 capitalize">{fechaFin}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 size-4 shrink-0 text-gray-500" />
            <div>
              <p className="font-medium text-gray-700">Ubicación</p>
              <p className="text-gray-600">{evento.lugarDireccion}</p>
              {evento.ciudad && (
                <p className="text-gray-600">{evento.ciudad.nombre}</p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <DollarSign className="mt-0.5 size-4 shrink-0 text-gray-500" />
            <div>
              <p className="font-medium text-gray-700">Costo</p>
              {evento.esGratuito ? (
                <Badge className="bg-green-100 text-green-700 border-0">Gratuito</Badge>
              ) : (
                <p className="text-gray-600">
                  ${evento.costoEntrada.toLocaleString("es-CO")}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 border-t border-gray-100 pt-4">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Target className="size-4" />
              Objetivo
            </h3>
            <p className="mt-1 text-sm text-gray-600">{evento.objetivo}</p>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Eye className="size-4" />
              Descripción del Itinerario
            </h3>
            <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">
              {evento.descripcionItinerario}
            </p>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Users className="size-4" />
              Público Objetivo
            </h3>
            <p className="mt-1 text-sm text-gray-600">{evento.publicoObjetivo}</p>
          </div>

          {evento.observaciones && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Observaciones</h3>
              <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">
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
              className="inline-flex h-10 items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 text-sm font-medium transition-colors"
            >
              Comprar Entrada
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
