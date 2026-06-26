"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import type { DateRange } from "react-day-picker"
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
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "bg-white border border-gray-200 text-gray-700 hover:border-indigo-300 rounded-xl px-4 py-2 text-sm font-medium transition-all w-full justify-start text-left sm:w-[280px] flex items-center",
          !hasSelection && "text-gray-500"
        )}
      >
        <CalendarIcon className="mr-2 size-4" />
        {displayText}
      </button>
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
            className="[&_.rdp-day_selected]:bg-indigo-600 [&_.rdp-day_selected]:text-white [&_.rdp-day_today]:text-indigo-600 [&_.rdp-button:hover]:border-indigo-300"
          />
        </div>
        <div className="flex justify-center gap-2">
          {hasSelection && (
            <button onClick={handleClear} className="text-sm text-gray-500 hover:text-gray-700 transition-colors px-3 py-1.5">
              <X className="mr-1 size-3 inline" />
              Limpiar filtros
            </button>
          )}
          <button onClick={() => setOpen(false)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors">
            Aplicar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
