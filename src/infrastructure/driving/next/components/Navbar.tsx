"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

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
    <header className="border-b">
      <div className="container mx-auto flex h-14 items-center gap-6 px-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight hover:text-muted-foreground"
        >
          Agenda Lugar
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Inicio
          </Link>
          <Link
            href="/eventos"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Buscar
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {sesion ? (
            <>
              <Link
                href="/organizador/eventos"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Mis Eventos
              </Link>
              <span className="text-sm text-muted-foreground">{sesion.nombre}</span>
              <Button variant="outline" size="sm" onClick={handleCerrarSesion}>
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <Link href="/auth/login">
              <Button variant="default" size="sm">
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
