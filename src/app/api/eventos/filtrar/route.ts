import { NextRequest, NextResponse } from "next/server"
import { container } from "@/infrastructure/config/container"
import { IFiltrarEventos } from "@/application/ports/IFiltrarEventos"

export async function GET(request: NextRequest) {
  const ciudadId = request.nextUrl.searchParams.get("ciudadId")
  const fechaInicioRaw = request.nextUrl.searchParams.get("fechaInicio")
  const fechaFinRaw = request.nextUrl.searchParams.get("fechaFin")
  const interesesRaw = request.nextUrl.searchParams.get("intereses")

  if (!ciudadId) {
    return NextResponse.json(
      { data: null, error: "El parámetro ciudadId es requerido" },
      { status: 400 }
    )
  }

  const fechaInicio = fechaInicioRaw ? new Date(fechaInicioRaw) : undefined
  const fechaFin = fechaFinRaw ? new Date(fechaFinRaw) : undefined
  const interesesIds = interesesRaw
    ? interesesRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : undefined

  if (fechaInicio && isNaN(fechaInicio.getTime())) {
    return NextResponse.json(
      { data: null, error: "fechaInicio no es una fecha válida" },
      { status: 400 }
    )
  }

  if (fechaFin && isNaN(fechaFin.getTime())) {
    return NextResponse.json(
      { data: null, error: "fechaFin no es una fecha válida" },
      { status: 400 }
    )
  }

  try {
    const useCase = container.resolve<IFiltrarEventos>("IFiltrarEventos")
    const result = await useCase.execute({
      ciudadId,
      fechaInicio,
      fechaFin,
      interesesIds,
    })

    if (!result.success) {
      return NextResponse.json(
        { data: null, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ data: result.data, error: null })
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
