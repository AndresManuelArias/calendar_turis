"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Clock } from "lucide-react"
import type { ActividadDto } from "@/application/dto/EventoResponse"

interface ActividadListProps {
  actividades: ActividadDto[]
}

export function ActividadList({ actividades }: ActividadListProps) {
  if (actividades.length === 0) return null

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">Actividades</h3>
      <div className="divide-y rounded-lg border">
        {actividades.map((actividad) => {
          const horaInicio = format(new Date(actividad.horaInicio), "HH:mm", { locale: es })
          const horaFin = format(new Date(actividad.horaFin), "HH:mm", { locale: es })

          return (
            <div key={actividad.id} className="flex items-start gap-4 p-4">
              <div className="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="size-4" />
                <time>
                  {horaInicio} - {horaFin}
                </time>
              </div>
              <div className="min-w-0">
                <p className="font-medium">{actividad.nombre}</p>
                {actividad.descripcion && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {actividad.descripcion}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
