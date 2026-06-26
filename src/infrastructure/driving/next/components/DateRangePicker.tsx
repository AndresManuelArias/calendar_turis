"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import type { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface DateRangePickerProps {
  startDate: Date | null
  endDate: Date | null
  onChange: (start: Date | null, end: Date | null) => void
}

export function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)

  const range: DateRange = {
    from: startDate ?? undefined,
    to: endDate ?? undefined,
  }

  const handleSelect = (newRange: DateRange | undefined) => {
    if (!newRange) {
      onChange(null, null)
      return
    }
    onChange(newRange.from ?? null, newRange.to ?? null)
  }

  const handleClear = () => {
    onChange(null, null)
    setOpen(false)
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      if (startDate && !endDate) {
        onChange(null, null)
      }
    }
  }

  const hasSelection = startDate !== null && endDate !== null

  const displayText = hasSelection
    ? `${format(startDate!, "dd/MM/yyyy", { locale: es })} - ${format(endDate!, "dd/MM/yyyy", { locale: es })}`
    : "Filtrar por fechas"

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className={cn(
          "w-full justify-start text-left font-normal sm:w-[280px]",
          !hasSelection && "text-muted-foreground"
        )}
      >
        <CalendarIcon className="mr-2 size-4" />
        {displayText}
      </Button>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Seleccionar rango de fechas</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center">
          <Calendar
            mode="range"
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={es}
          />
        </div>
        <div className="flex justify-center gap-2">
          {hasSelection && (
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <X className="mr-1 size-3" />
              Limpiar filtros
            </Button>
          )}
          <Button size="sm" onClick={() => setOpen(false)}>
            Aplicar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
