"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthForm } from "@/infrastructure/driving/next/components/AuthForm"

export default function RegistroPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const sesion = localStorage.getItem("agenda-lugar-sesion")
    if (sesion) {
      try {
        const data = JSON.parse(sesion)
        if (data && data.token) {
          router.replace("/organizador/eventos")
          return
        }
      } catch {
        // ignore
      }
    }
    setChecking(false)
  }, [router])

  if (checking) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Verificando sesión...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <AuthForm mode="registro" />
    </div>
  )
}
