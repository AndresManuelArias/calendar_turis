"use client"

import { useState, useEffect } from "react"
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

interface CitySelectorProps {
  ciudades: CiudadData[]
  selectedCityId: string | null
  onSelect: (ciudadId: string) => void
}

export function CitySelector({ ciudades, selectedCityId, onSelect }: CitySelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const savedCityId = localStorage.getItem(CITY_STORAGE_KEY)
    if (!savedCityId || !ciudades.some((c) => c.id === savedCityId)) {
      setIsDialogOpen(true)
    }
  }, [ciudades])

  const handleSelect = (ciudadId: string | null) => {
    if (!ciudadId) return
    localStorage.setItem(CITY_STORAGE_KEY, ciudadId)
    onSelect(ciudadId)
    setIsDialogOpen(false)
  }

  const selectedCiudad = ciudades.find((c) => c.id === selectedCityId)

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Bienvenido a Agenda Lugar</DialogTitle>
            <DialogDescription>
              Selecciona tu ciudad para descubrir los eventos de hoy.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 pt-2">
            {ciudades.map((ciudad) => (
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
        </DialogContent>
      </Dialog>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Ciudad:</label>
        <Select value={selectedCityId || undefined} onValueChange={handleSelect}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Seleccionar ciudad">
              {selectedCiudad?.nombre}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {ciudades.map((ciudad) => (
              <SelectItem key={ciudad.id} value={ciudad.id}>
                {ciudad.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  )
}
