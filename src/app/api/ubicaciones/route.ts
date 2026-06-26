import { NextResponse } from "next/server"
import { container } from "@/infrastructure/config/container"
import { ICiudadRepository } from "@/domain/ports/ICiudadRepository"

export async function GET() {
  try {
    const repo = container.resolve<ICiudadRepository>("ICiudadRepository")
    const ciudades = await repo.obtenerTodas()

    const paisesMap = new Map<string, Map<string, Array<{ id: string; nombre: string }>>>()

    for (const c of ciudades) {
      if (!paisesMap.has(c.pais)) {
        paisesMap.set(c.pais, new Map())
      }
      const estadosMap = paisesMap.get(c.pais)!
      if (!estadosMap.has(c.estado)) {
        estadosMap.set(c.estado, [])
      }
      estadosMap.get(c.estado)!.push({ id: c.id, nombre: c.nombre })
    }

    const data = Array.from(paisesMap.entries()).map(([paisNombre, estadosMap]) => ({
      nombre: paisNombre,
      estados: Array.from(estadosMap.entries()).map(([estadoNombre, ciudades]) => ({
        nombre: estadoNombre,
        ciudades,
      })),
    }))

    return NextResponse.json({ data, error: null })
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        error: error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 500 }
    )
  }
}
