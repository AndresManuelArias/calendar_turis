import { NextRequest, NextResponse } from "next/server"
import { container } from "@/infrastructure/config/container"
import { IEventoRepository } from "@/domain/ports/IEventoRepository"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ data: null, error: "No autorizado" }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const tokenParts = token.split("_")
    if (tokenParts.length < 3 || tokenParts[0] !== "token") {
      return NextResponse.json({ data: null, error: "Token inválido" }, { status: 401 })
    }

    const usuarioId = tokenParts[1]
    const timestamp = parseInt(tokenParts[2], 10)
    if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
      return NextResponse.json({ data: null, error: "Sesión expirada" }, { status: 401 })
    }

    const repo = container.resolve<IEventoRepository>("IEventoRepository")
    const eventos = await repo.obtenerPorOrganizadorId(usuarioId)

    const data = eventos.map((e) => ({
      id: e.id,
      titulo: e.titulo,
      fechaInicio: e.fechaInicio.toISOString(),
      fechaFin: e.fechaFin.toISOString(),
      lugarDireccion: e.lugarDireccion,
      esGratuito: e.esGratuito,
      costoEntrada: e.costoEntrada,
    }))

    return NextResponse.json({ data, error: null }, { status: 200 })
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
