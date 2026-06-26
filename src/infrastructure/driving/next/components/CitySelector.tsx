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
import { Button } from "@/components/ui/button"

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
                <Button
                  key={pais.nombre}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setSelectedPais(pais.nombre)}
                >
                  {pais.nombre}
                </Button>
              ))}
            </div>
          ) : !selectedEstado ? (
            <div className="space-y-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setSelectedPais("")}>
                ← Volver a países
              </Button>
              <div className="grid gap-2">
                {estadosDisponibles.map((estado) => (
                  <Button
                    key={estado.nombre}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setSelectedEstado(estado.nombre)}
                  >
                    {estado.nombre}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => { setSelectedEstado(""); setSelectedPais("") }}>
                ← Volver a países
              </Button>
              <div className="grid gap-2">
                {ciudadesDisponibles.map((ciudad) => (
                  <Button
                    key={ciudad.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleSelect(ciudad.id)}
                  >
                    {ciudad.nombre}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm font-medium">Ubicación:</label>
        <Select value={selectedCityId || undefined} onValueChange={(v) => v && onSelect(v)}>
          <SelectTrigger className="w-[220px]">
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
