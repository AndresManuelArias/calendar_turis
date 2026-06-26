import { NextRequest, NextResponse } from "next/server"
import { container } from "@/infrastructure/config/container"
import { IIniciarSesion } from "@/application/ports/IIniciarSesion"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const useCase = container.resolve<IIniciarSesion>("IIniciarSesion")
    const result = await useCase.execute(body)

    if (!result.success) {
      return NextResponse.json(
        { data: null, error: result.error },
        { status: 401 }
      )
    }

    return NextResponse.json({ data: result.data, error: null }, { status: 200 })
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
