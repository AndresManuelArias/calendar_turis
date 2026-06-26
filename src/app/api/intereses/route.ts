import { NextResponse } from "next/server"
import { container } from "@/infrastructure/config/container"
import { IEventoRepository } from "@/domain/ports/IEventoRepository"

export async function GET() {
  try {
    const repo = container.resolve<IEventoRepository>("IEventoRepository")
    const intereses = await repo.obtenerIntereses()

    const data = intereses.map((i) => ({
      id: i.id,
      nombre: i.nombre,
      descripcion: i.descripcion,
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
