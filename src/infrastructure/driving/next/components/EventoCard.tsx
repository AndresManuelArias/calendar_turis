"use client"

import Link from "next/link"
import { ImageIcon } from "lucide-react"

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
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col">
        <div className="relative h-48 w-full bg-gray-200">
          {evento.imagenUrl ? (
            <img src={evento.imagenUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="size-12 text-gray-300" />
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow justify-between">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{evento.titulo}</h3>
          <p className="text-sm text-gray-500 mt-1">{evento.lugarDireccion}</p>
          <p className="text-xs text-indigo-600 font-medium mt-2">{fechaFormateada}</p>
          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
            <span className="font-bold text-gray-900">
              {evento.esGratuito ? 'Gratis' : `$${evento.costoEntrada.toLocaleString("es-CO")}`}
            </span>
            <span className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors inline-block">
              Ver Detalles
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
