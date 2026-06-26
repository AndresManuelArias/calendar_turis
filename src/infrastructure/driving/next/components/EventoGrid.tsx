import { EventoCard } from "./EventoCard"

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

interface EventoGridProps {
  eventos: EventoData[]
}

export function EventoGrid({ eventos }: EventoGridProps) {
  if (eventos.length === 0) {
    return null
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {eventos.map((evento) => (
        <EventoCard key={evento.id} evento={evento} />
      ))}
    </div>
  )
}
