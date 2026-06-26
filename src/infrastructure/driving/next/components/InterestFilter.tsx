"use client"

import { Badge } from "@/components/ui/badge"

interface InteresData {
  id: string
  nombre: string
}

interface InterestFilterProps {
  intereses: InteresData[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
}

export function InterestFilter({ intereses, selectedIds, onChange }: InterestFilterProps) {
  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  if (intereses.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">
        Intereses:
      </span>
      {intereses.map((interes) => {
        const isSelected = selectedIds.includes(interes.id)
        return (
          <button
            key={interes.id}
            onClick={() => handleToggle(interes.id)}
            className="cursor-pointer"
          >
            <Badge
              variant={isSelected ? "default" : "outline"}
              className="select-none transition-colors hover:opacity-80"
            >
              {interes.nombre}
            </Badge>
          </button>
        )
      })}
      {selectedIds.length > 0 && (
        <button
          onClick={() => onChange([])}
          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Limpiar
        </button>
      )}
    </div>
  )
}
