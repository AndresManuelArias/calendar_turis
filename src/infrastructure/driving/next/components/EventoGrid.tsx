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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {eventos.map((evento) => (
        <EventoCard key={evento.id} evento={evento} />
      ))}
    </div>
  )
}
