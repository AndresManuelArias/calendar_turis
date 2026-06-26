"use client"

import { Building2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { PatrocinadorDto } from "@/application/dto/EventoResponse"

interface PatrocinadorListProps {
  patrocinadores: PatrocinadorDto[]
}

function nivelColor(nivel: string): "default" | "secondary" | "outline" {
  switch (nivel) {
    case "Oro":
      return "default"
    case "Plata":
      return "secondary"
    default:
      return "outline"
  }
}

export function PatrocinadorList({ patrocinadores }: PatrocinadorListProps) {
  if (patrocinadores.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2 className="size-4" />
          Patrocinadores
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {patrocinadores.map((patrocinador) => (
            <li key={patrocinador.id} className="flex items-center gap-3">
              {patrocinador.urlLogo ? (
                <div className="size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <img
                    src={patrocinador.urlLogo}
                    alt={patrocinador.nombreEmpresa}
                    className="size-full object-contain p-1"
                  />
                </div>
              ) : (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Building2 className="size-5 text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{patrocinador.nombreEmpresa}</p>
              </div>
              <Badge variant={nivelColor(patrocinador.nivelPatrocinio)}>
                {patrocinador.nivelPatrocinio}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
