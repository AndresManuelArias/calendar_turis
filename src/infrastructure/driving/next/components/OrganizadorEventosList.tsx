"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface EventoItem {
  id: string
  titulo: string
  fechaInicio: string
  fechaFin: string
  lugarDireccion: string
  esGratuito: boolean
  costoEntrada: number
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
    return <p className="text-muted-foreground">Cargando eventos...</p>
  }

  if (error) {
    return <p className="text-destructive">{error}</p>
  }

  if (eventos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <p className="text-lg text-muted-foreground">Aún no tienes eventos creados.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Crea tu primer evento para comenzar.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {eventos.map((e) => (
        <div key={e.id} className="rounded-xl border p-4 transition-colors hover:bg-muted/50">
          <Link href={`/eventos/${e.id}`}>
            <h3 className="font-semibold">{e.titulo}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{e.lugarDireccion}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(e.fechaInicio).toLocaleDateString("es-CO", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="mt-2 text-xs">
              {e.esGratuito ? (
                <span className="text-green-600">Gratuito</span>
              ) : (
                <span>$ {e.costoEntrada.toLocaleString("es-CO")}</span>
              )}
            </p>
          </Link>
          <div className="mt-3 flex justify-end">
            <Link href={`/organizador/eventos/${e.id}/editar`}>
              <Button type="button" variant="outline" size="sm">
                Editar
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
