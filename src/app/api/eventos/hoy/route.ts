import { NextRequest, NextResponse } from "next/server"
import { container } from "@/infrastructure/config/container"
import { IGetEventosDelDia } from "@/application/ports/IGetEventosDelDia"

export async function GET(request: NextRequest) {
  const ciudadId = request.nextUrl.searchParams.get("ciudadId")

  if (!ciudadId) {
    return NextResponse.json(
      { data: null, error: "El parámetro ciudadId es requerido" },
      { status: 400 }
    )
  }

  try {
    const useCase = container.resolve<IGetEventosDelDia>("IGetEventosDelDia")
    const result = await useCase.execute(ciudadId)

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
