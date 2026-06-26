"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const [isAutenticado, setIsAutenticado] = useState<boolean | null>(null)

  useEffect(() => {
    const sesion = localStorage.getItem("agenda-lugar-sesion")
    if (!sesion) {
      router.replace("/auth/login")
    } else {
      try {
        const data = JSON.parse(sesion)
        if (data && data.token) {
          setIsAutenticado(true)
        } else {
          router.replace("/auth/login")
        }
      } catch {
        router.replace("/auth/login")
      }
    }
  }, [router])

  if (isAutenticado === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Verificando sesión...</p>
      </div>
    )
  }

  return <>{children}</>
}
