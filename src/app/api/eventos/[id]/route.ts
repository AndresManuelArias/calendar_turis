import { NextRequest, NextResponse } from "next/server"
import { container } from "@/infrastructure/config/container"
import { IGetEventoPorId } from "@/application/ports/IGetEventoPorId"
import { IActualizarEvento } from "@/application/ports/IActualizarEvento"
import { supabase } from "@/infrastructure/config/supabaseClient"

function extraerSesion(request: NextRequest): { usuarioId: string } | null {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null

  const token = authHeader.slice(7)
  const tokenParts = token.split("_")
  if (tokenParts.length < 3 || tokenParts[0] !== "token") return null

  const usuarioId = tokenParts[1]
  const timestamp = parseInt(tokenParts[2], 10)
  const now = Date.now()
  const hourMs = 60 * 60 * 1000

  if (now - timestamp > 24 * hourMs) return null

  return { usuarioId }
}

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

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

    const { data: eventoExistente, error: evError } = await supabase
      .from("eventos")
      .select("id, organizador_id")
      .eq("id", id)
      .maybeSingle()

    if (evError || !eventoExistente) {
      return NextResponse.json(
        { data: null, error: "Evento no encontrado" },
        { status: 404 }
      )
    }

    if (eventoExistente.organizador_id !== sesion.usuarioId) {
      return NextResponse.json(
        { data: null, error: "No tienes permiso para editar este evento" },
        { status: 403 }
      )
    }

    const body = await request.json()

    const bodyConOrganizador = {
      ...body,
      id,
      organizadorId: sesion.usuarioId,
      fechaInicio: new Date(body.fechaInicio),
      fechaFin: new Date(body.fechaFin),
    }

    const useCase = container.resolve<IActualizarEvento>("IActualizarEvento")
    const result = await useCase.execute(bodyConOrganizador)

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
