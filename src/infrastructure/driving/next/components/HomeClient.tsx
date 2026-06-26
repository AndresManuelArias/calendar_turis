"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { CitySelector } from "./CitySelector"
import { EventoGrid } from "./EventoGrid"
import { Calendar, MapPin } from "lucide-react"

const CITY_STORAGE_KEY = "agenda-lugar-ciudad"

interface CiudadData {
  id: string
  nombre: string
}

interface EstadoData {
  nombre: string
  ciudades: CiudadData[]
}

interface PaisData {
  nombre: string
  estados: EstadoData[]
}

interface EventoData {
  id: string
  titulo: string
  objetivo: string
  publicoObjetivo: string
  descripcionItinerario: string
  fechaInicio: string
  fechaFin: string
  lugarDireccion: string
  costoEntrada: number
  esGratuito: boolean
  urlTicketeraExterna: string | null
  observaciones: string | null
  imagenUrl?: string | null
  ciudadId: string
  organizadorId: string
}

interface HomeClientProps {
  ubicaciones: PaisData[]
}

export function HomeClient({ ubicaciones }: HomeClientProps) {
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null)
  const [eventos, setEventos] = useState<EventoData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const todasLasCiudades = useMemo(
    () => ubicaciones.flatMap((p) => p.estados.flatMap((e) => e.ciudades)),
    [ubicaciones]
  )

  const fetchEventos = useCallback(async (ciudadId: string) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/eventos/hoy?ciudadId=${ciudadId}`)
      const json = await res.json()
      if (json.data) {
        setEventos(json.data)
      } else {
        setEventos([])
      }
    } catch {
      setEventos([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const savedCityId = localStorage.getItem(CITY_STORAGE_KEY)
    if (savedCityId && todasLasCiudades.some((c) => c.id === savedCityId)) {
      setSelectedCityId(savedCityId)
      fetchEventos(savedCityId)
    } else {
      setIsLoading(false)
    }
  }, [todasLasCiudades, fetchEventos])

  const handleCitySelect = (ciudadId: string) => {
    setSelectedCityId(ciudadId)
    fetchEventos(ciudadId)
  }

  return (
    <>
      <CitySelector
        ubicaciones={ubicaciones}
        selectedCityId={selectedCityId}
        onSelect={handleCitySelect}
      />

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Eventos de Hoy</h2>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-500">Cargando eventos...</p>
          </div>
        )}

        {!isLoading && selectedCityId && eventos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Calendar className="size-8 text-gray-400" />
            </div>
            <p className="text-lg text-gray-500">
              No hay eventos para hoy.
            </p>
            <p className="mt-2 text-gray-400">
              Explora el calendario para encontrar más opciones.
            </p>
          </div>
        )}

        {!isLoading && !selectedCityId && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <MapPin className="size-8 text-gray-400" />
            </div>
            <p className="text-lg text-gray-500">
              Selecciona una ciudad para ver los eventos de hoy.
            </p>
          </div>
        )}

        {eventos.length > 0 && <EventoGrid eventos={eventos} />}
      </section>
    </>
  )
}
