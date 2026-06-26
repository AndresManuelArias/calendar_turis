import { NextResponse } from "next/server"
import { container } from "@/infrastructure/config/container"
import { ICiudadRepository } from "@/domain/ports/ICiudadRepository"

export async function GET() {
  try {
    const repo = container.resolve<ICiudadRepository>("ICiudadRepository")
    const ciudades = await repo.obtenerTodas()

    const data = ciudades.map((c) => ({ id: c.id, nombre: c.nombre, pais: c.pais }))

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
