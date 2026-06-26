"use client"

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
      <span className="text-sm font-medium text-gray-500">
        Intereses:
      </span>
      {intereses.map((interes) => {
        const isSelected = selectedIds.includes(interes.id)
        return (
          <button
            key={interes.id}
            onClick={() => handleToggle(interes.id)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all cursor-pointer ${
              isSelected
                ? "bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600"
                : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            {interes.nombre}
          </button>
        )
      })}
      {selectedIds.length > 0 && (
        <button
          onClick={() => onChange([])}
          className="text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600 transition-colors"
        >
          Limpiar
        </button>
      )}
    </div>
  )
}
