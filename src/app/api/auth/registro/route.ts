import { NextRequest, NextResponse } from "next/server"
import { container } from "@/infrastructure/config/container"
import { IRegistrarOrganizador } from "@/application/ports/IRegistrarOrganizador"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const useCase = container.resolve<IRegistrarOrganizador>("IRegistrarOrganizador")
    const result = await useCase.execute(body)

    if (!result.success) {
      return NextResponse.json(
        { data: null, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { data: { usuarioId: body.email, nombre: body.nombre, email: body.email }, error: null },
      { status: 201 }
    )
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
