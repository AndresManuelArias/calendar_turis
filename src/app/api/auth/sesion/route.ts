import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { data: { autenticado: false }, error: null },
        { status: 200 }
      )
    }

    const token = authHeader.slice(7)

    const tokenParts = token.split("_")
    if (tokenParts.length < 3 || tokenParts[0] !== "token") {
      return NextResponse.json(
        { data: { autenticado: false }, error: null },
        { status: 200 }
      )
    }

    const usuarioId = tokenParts[1]
    const timestamp = parseInt(tokenParts[2], 10)
    const now = Date.now()
    const hourMs = 60 * 60 * 1000

    if (now - timestamp > 24 * hourMs) {
      return NextResponse.json(
        { data: { autenticado: false }, error: "Sesión expirada" },
        { status: 200 }
      )
    }

    return NextResponse.json(
      {
        data: {
          autenticado: true,
          usuario: {
            id: usuarioId,
            nombre: "",
            email: "",
          },
        },
        error: null,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        data: { autenticado: false },
        error: error instanceof Error ? error.message : "Error interno del servidor",
      },
      { status: 500 }
    )
  }
}
