"use client"

import { useState, useEffect, useCallback } from "react"
import { CitySelector } from "./CitySelector"
import { DateRangePicker } from "./DateRangePicker"
import { InterestFilter } from "./InterestFilter"
import { EventoGrid } from "./EventoGrid"

const CITY_STORAGE_KEY = "agenda-lugar-ciudad"

interface CiudadData {
  id: string
  nombre: string
}

interface InteresData {
  id: string
  nombre: string
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
  ciudadId: string
  organizadorId: string
}

interface SearchClientProps {
  ciudades: CiudadData[]
  intereses: InteresData[]
}

export function SearchClient({ ciudades, intereses }: SearchClientProps) {
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [selectedIntereses, setSelectedIntereses] = useState<string[]>([])
  const [eventos, setEventos] = useState<EventoData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchEventos = useCallback(async () => {
    if (!selectedCityId) {
      setEventos([])
      return
    }

    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("ciudadId", selectedCityId)

      if (startDate && endDate) {
        params.set("fechaInicio", startDate.toISOString())
        params.set("fechaFin", endDate.toISOString())
      }

      if (selectedIntereses.length > 0) {
        params.set("intereses", selectedIntereses.join(","))
      }

      const res = await fetch(`/api/eventos/filtrar?${params.toString()}`)
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
  }, [selectedCityId, startDate, endDate, selectedIntereses])

  useEffect(() => {
    const savedCityId = localStorage.getItem(CITY_STORAGE_KEY)
    if (savedCityId && ciudades.some((c) => c.id === savedCityId)) {
      setSelectedCityId(savedCityId)
    }
  }, [ciudades])

  useEffect(() => {
    fetchEventos()
  }, [fetchEventos])

  const handleCitySelect = (ciudadId: string) => {
    setSelectedCityId(ciudadId)
    localStorage.setItem(CITY_STORAGE_KEY, ciudadId)
  }

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start)
    setEndDate(end)
  }

  const handleInteresesChange = (ids: string[]) => {
    setSelectedIntereses(ids)
  }

  const hasFilters = startDate !== null || selectedIntereses.length > 0

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <CitySelector
          ciudades={ciudades}
          selectedCityId={selectedCityId}
          onSelect={handleCitySelect}
        />
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={handleDateChange}
        />
      </div>

      <InterestFilter
        intereses={intereses}
        selectedIds={selectedIntereses}
        onChange={handleInteresesChange}
      />

      <section>
        <h2 className="mb-6 text-2xl font-semibold">
          {hasFilters ? "Resultados de búsqueda" : "Eventos de Hoy"}
        </h2>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <p className="text-muted-foreground">Cargando eventos...</p>
          </div>
        )}

        {!isLoading && selectedCityId && eventos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg text-muted-foreground">
              No se encontraron eventos con los filtros seleccionados.
            </p>
            <p className="mt-2 text-muted-foreground">
              Intenta ajustar las fechas o intereses para ver más opciones.
            </p>
          </div>
        )}

        {!isLoading && !selectedCityId && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg text-muted-foreground">
              Selecciona una ciudad para explorar eventos.
            </p>
          </div>
        )}

        {eventos.length > 0 && <EventoGrid eventos={eventos} />}
      </section>
    </div>
  )
}
