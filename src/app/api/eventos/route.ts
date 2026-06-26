import { NextRequest, NextResponse } from "next/server"
import { container } from "@/infrastructure/config/container"
import { ICrearEvento } from "@/application/ports/ICrearEvento"
import { supabase } from "@/infrastructure/config/supabaseClient"

function extraerSesion(request: NextRequest): { usuarioId: string } | null {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null

  const token = authHeader.slice(7)
  const tokenParts = token.split("-")
  if (tokenParts.length < 3 || tokenParts[0] !== "token") return null

  const usuarioId = tokenParts[1]
  const timestamp = parseInt(tokenParts[2], 10)
  const now = Date.now()
  const hourMs = 60 * 60 * 1000

  if (now - timestamp > 24 * hourMs) return null

  return { usuarioId }
}

export async function POST(request: NextRequest) {
  try {
    const sesion = extraerSesion(request)
    if (!sesion) {
      return NextResponse.json(
        { data: null, error: "No autorizado" },
        { status: 401 }
      )
    }

    const { data: organizador, error: orgError } = await supabase
      .from("organizadores")
      .select("id")
      .eq("id", sesion.usuarioId)
      .maybeSingle()

    if (orgError || !organizador) {
      return NextResponse.json(
        { data: null, error: "Organizador no encontrado" },
        { status: 401 }
      )
    }

    const body = await request.json()

    const bodyConOrganizador = {
      ...body,
      organizadorId: sesion.usuarioId,
      fechaInicio: new Date(body.fechaInicio),
      fechaFin: new Date(body.fechaFin),
    }

    const useCase = container.resolve<ICrearEvento>("ICrearEvento")
    const result = await useCase.execute(bodyConOrganizador)

    if (!result.success) {
      return NextResponse.json(
        { data: null, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ data: result.data, error: null }, { status: 201 })
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
