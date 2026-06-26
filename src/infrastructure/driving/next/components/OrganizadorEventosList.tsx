"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface EventoItem {
  id: string
  titulo: string
  fechaInicio: string
  fechaFin: string
  lugarDireccion: string
  esGratuito: boolean
  costoEntrada: number
  imagenUrl: string | null
}

export function OrganizadorEventosList() {
  const [eventos, setEventos] = useState<EventoItem[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function cargar() {
      try {
        const sesionRaw = localStorage.getItem("agenda-lugar-sesion")
        if (!sesionRaw) {
          setError("Debes iniciar sesión")
          setCargando(false)
          return
        }
        const sesion = JSON.parse(sesionRaw)
        const res = await fetch("/api/eventos/organizador", {
          headers: { Authorization: `Bearer ${sesion.token}` },
        })
        const json = await res.json()
        if (!res.ok) {
          setError(json.error || "Error al cargar eventos")
        } else {
          setEventos(json.data ?? [])
        }
      } catch {
        setError("Error de conexión")
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  if (cargando) {
    return <p className="text-gray-500">Cargando eventos...</p>
  }

  if (error) {
    return <p className="text-destructive">{error}</p>
  }

  if (eventos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 p-12 text-center">
        <p className="text-lg text-gray-500">Aún no tienes eventos creados.</p>
        <p className="mt-2 text-sm text-gray-400">
          Crea tu primer evento para comenzar.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {eventos.map((e) => (
        <div key={e.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col">
          {e.imagenUrl && (
            <div className="relative h-48 w-full">
              <img
                src={e.imagenUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-4 flex flex-col flex-grow justify-between">
            <Link href={`/eventos/${e.id}`}>
              <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{e.titulo}</h3>
              <p className="text-sm text-gray-500 mt-1">{e.lugarDireccion}</p>
              <p className="text-xs text-indigo-600 font-medium mt-2">
                {new Date(e.fechaInicio).toLocaleDateString("es-CO", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="mt-2 text-sm font-bold text-gray-900">
                {e.esGratuito ? 'Gratis' : `$${e.costoEntrada.toLocaleString("es-CO")}`}
              </p>
            </Link>
            <div className="mt-4 pt-3 border-t border-gray-50 flex justify-end">
              <Link href={`/organizador/eventos/${e.id}/editar`}>
                <span className="bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 rounded-xl px-4 py-2 text-sm font-medium transition-all cursor-pointer inline-block">
                  Editar
                </span>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
