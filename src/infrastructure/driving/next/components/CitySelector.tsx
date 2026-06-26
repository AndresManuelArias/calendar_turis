"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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

interface CitySelectorProps {
  ubicaciones: PaisData[]
  selectedCityId: string | null
  onSelect: (ciudadId: string) => void
}

export function CitySelector({ ubicaciones, selectedCityId, onSelect }: CitySelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPais, setSelectedPais] = useState<string>("")
  const [selectedEstado, setSelectedEstado] = useState<string>("")

  const todasLasCiudades = useMemo(
    () => ubicaciones.flatMap((p) => p.estados.flatMap((e) => e.ciudades)),
    [ubicaciones]
  )

  useEffect(() => {
    const savedCityId = localStorage.getItem(CITY_STORAGE_KEY)
    if (!savedCityId || !todasLasCiudades.some((c) => c.id === savedCityId)) {
      setIsDialogOpen(true)
    }
  }, [todasLasCiudades])

  const estadosDisponibles = useMemo(
    () => ubicaciones.find((p) => p.nombre === selectedPais)?.estados ?? [],
    [ubicaciones, selectedPais]
  )

  const ciudadesDisponibles = useMemo(
    () => estadosDisponibles.find((e) => e.nombre === selectedEstado)?.ciudades ?? [],
    [estadosDisponibles, selectedEstado]
  )

  const selectedCiudad = todasLasCiudades.find((c) => c.id === selectedCityId)
  const paisDeCiudad = selectedCiudad
    ? ubicaciones.find((p) => p.estados.some((e) => e.ciudades.some((c) => c.id === selectedCiudad.id)))
    : null
  const estadoDeCiudad = selectedCiudad
    ? paisDeCiudad?.estados.find((e) => e.ciudades.some((c) => c.id === selectedCiudad.id))
    : null

  const handleSelect = (ciudadId: string) => {
    localStorage.setItem(CITY_STORAGE_KEY, ciudadId)
    onSelect(ciudadId)
    setIsDialogOpen(false)
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Bienvenido a Agenda Lugar</DialogTitle>
            <DialogDescription>
              Selecciona tu ubicación para descubrir eventos cercanos.
            </DialogDescription>
          </DialogHeader>

          {!selectedPais ? (
            <div className="grid gap-2 pt-2">
              {ubicaciones.map((pais) => (
                <button
                  key={pais.nombre}
                  className="w-full justify-start border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors px-4 py-2 text-sm font-medium text-left"
                  onClick={() => setSelectedPais(pais.nombre)}
                >
                  {pais.nombre}
                </button>
              ))}
            </div>
          ) : !selectedEstado ? (
            <div className="space-y-3 pt-2">
              <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors" onClick={() => setSelectedPais("")}>
                ← Volver a países
              </button>
              <div className="grid gap-2">
                {estadosDisponibles.map((estado) => (
                  <button
                    key={estado.nombre}
                    className="w-full justify-start border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors px-4 py-2 text-sm font-medium text-left"
                    onClick={() => setSelectedEstado(estado.nombre)}
                  >
                    {estado.nombre}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors" onClick={() => { setSelectedEstado(""); setSelectedPais("") }}>
                ← Volver a países
              </button>
              <div className="grid gap-2">
                {ciudadesDisponibles.map((ciudad) => (
                  <button
                    key={ciudad.id}
                    className="w-full justify-start bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors px-4 py-2 text-sm font-medium text-left"
                    onClick={() => handleSelect(ciudad.id)}
                  >
                    {ciudad.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm font-medium text-gray-500">Ubicación:</label>
        <Select value={selectedCityId ?? ""} onValueChange={(v) => v && onSelect(v)}>
          <SelectTrigger className="w-[220px] bg-white border-gray-200 rounded-xl">
            <SelectValue placeholder="Seleccionar ubicación">
              {selectedCiudad && paisDeCiudad && estadoDeCiudad
                ? `${selectedCiudad.nombre}, ${estadoDeCiudad.nombre}, ${paisDeCiudad.nombre}`
                : selectedCiudad?.nombre}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {ubicaciones.map((pais) =>
              pais.estados.map((estado) =>
                estado.ciudades.map((ciudad) => (
                  <SelectItem key={ciudad.id} value={ciudad.id}>
                    {ciudad.nombre}, {estado.nombre}, {pais.nombre}
                  </SelectItem>
                ))
              )
            )}
          </SelectContent>
        </Select>
      </div>
    </>
  )
}
