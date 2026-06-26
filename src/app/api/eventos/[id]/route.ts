import { NextRequest, NextResponse } from "next/server"
import { container } from "@/infrastructure/config/container"
import { IGetEventoPorId } from "@/application/ports/IGetEventoPorId"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const useCase = container.resolve<IGetEventoPorId>("IGetEventoPorId")
    const result = await useCase.execute(id)

    if (!result.success) {
      return NextResponse.json(
        { data: null, error: result.error },
        { status: 400 }
      )
    }

    if (!result.data) {
      return NextResponse.json(
        { data: null, error: "Evento no encontrado" },
        { status: 404 }
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
