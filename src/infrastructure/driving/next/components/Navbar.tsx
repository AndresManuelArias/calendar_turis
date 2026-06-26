"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

interface SesionData {
  usuarioId: string
  nombre: string
  email: string
  token: string
}

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [sesion, setSesion] = useState<SesionData | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem("agenda-lugar-sesion")
    if (raw) {
      try {
        setSesion(JSON.parse(raw))
        return
      } catch {
        // ignore
      }
    }
    setSesion(null)
  }, [pathname])

  function handleCerrarSesion() {
    localStorage.removeItem("agenda-lugar-sesion")
    setSesion(null)
    router.push("/")
  }

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="container mx-auto flex h-14 items-center gap-6 px-4">
        <Link
          href="/"
          className="text-indigo-600 font-bold text-lg transition-colors"
        >
          Agenda Lugar
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className={`transition-colors ${pathname === "/" ? "text-indigo-600 font-medium" : "text-gray-500 hover:text-indigo-600"}`}
          >
            Inicio
          </Link>
          <Link
            href="/eventos"
            className={`transition-colors ${pathname === "/eventos" ? "text-indigo-600 font-medium" : "text-gray-500 hover:text-indigo-600"}`}
          >
            Buscar
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {sesion ? (
            <>
              <Link
                href="/organizador/eventos"
                className={`text-sm transition-colors ${pathname === "/organizador/eventos" ? "text-indigo-600 font-medium" : "text-gray-500 hover:text-indigo-600"}`}
              >
                Mis Eventos
              </Link>
              <span className="text-sm text-indigo-600 font-medium">{sesion.nombre}</span>
              <button
                onClick={handleCerrarSesion}
                className="border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors px-4 py-2 text-sm font-medium"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link href="/auth/login">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors px-4 py-2 text-sm font-medium">
                Iniciar Sesión
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
