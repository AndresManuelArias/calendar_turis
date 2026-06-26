"use client"

import { User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ParticipanteDto } from "@/application/dto/EventoResponse"

interface ParticipanteListProps {
  participantes: ParticipanteDto[]
}

export function ParticipanteList({ participantes }: ParticipanteListProps) {
  if (participantes.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <User className="size-4" />
          Participantes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {participantes.map((participante) => (
            <li key={participante.id} className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                {participante.nombre.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">{participante.nombre}</p>
                <p className="text-xs text-muted-foreground">{participante.rolOPerfil}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
