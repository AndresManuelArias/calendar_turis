"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AuthFormProps {
  mode: "login" | "registro"
  onSuccess?: () => void
}

type FormErrors = Partial<Record<string, string>>

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [contrasenia, setContrasenia] = useState("")
  const [confirmarContrasenia, setConfirmarContrasenia] = useState("")
  const [nitORut, setNitORut] = useState("")
  const [telefonoContacto, setTelefonoContacto] = useState("")
  const [sitioWeb, setSitioWeb] = useState("")

  function validate(): boolean {
    const newErrors: FormErrors = {}

    if (mode === "registro") {
      if (!nombre || nombre.length < 2) {
        newErrors.nombre = "El nombre debe tener al menos 2 caracteres"
      }
    }

    if (!email) {
      newErrors.email = "El email es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email inválido"
    }

    if (!contrasenia) {
      newErrors.contrasenia = "La contraseña es requerida"
    } else if (contrasenia.length < 6) {
      newErrors.contrasenia = "Mínimo 6 caracteres"
    }

    if (mode === "registro" && contrasenia !== confirmarContrasenia) {
      newErrors.confirmarContrasenia = "Las contraseñas no coinciden"
    }

    if (mode === "registro" && sitioWeb && sitioWeb.trim() !== "") {
      try {
        new URL(sitioWeb)
      } catch {
        newErrors.sitioWeb = "URL inválida"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setServerError(null)

    if (!validate()) return

    setIsLoading(true)

    try {
      if (mode === "registro") {
        const body: Record<string, string> = {
          nombre,
          email,
          contrasenia,
        }
        if (nitORut) body.nitORut = nitORut
        if (telefonoContacto) body.telefonoContacto = telefonoContacto
        if (sitioWeb) body.sitioWeb = sitioWeb

        const res = await fetch("/api/auth/registro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })

        const json = await res.json()

        if (!res.ok) {
          setServerError(json.error || "Error al registrarse")
          return
        }

        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, contrasenia }),
        })

        const loginJson = await loginRes.json()

        if (!loginRes.ok) {
          router.push("/auth/login")
          return
        }

        if (loginJson.data) {
          localStorage.setItem(
            "agenda-lugar-sesion",
            JSON.stringify({
              usuarioId: loginJson.data.usuarioId,
              nombre: loginJson.data.nombre,
              email: loginJson.data.email,
              token: loginJson.data.token,
            })
          )
        }

        onSuccess?.()
        router.push("/organizador/eventos")
      } else {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, contrasenia }),
        })

        const json = await res.json()

        if (!res.ok) {
          setServerError(json.error || "Credenciales inválidas")
          return
        }

        if (json.data) {
          localStorage.setItem(
            "agenda-lugar-sesion",
            JSON.stringify({
              usuarioId: json.data.usuarioId,
              nombre: json.data.nombre,
              email: json.data.email,
              token: json.data.token,
            })
          )
        }

        onSuccess?.()
        router.push("/organizador/eventos")
      }
    } catch {
      setServerError("Error de conexión. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
        </CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Ingresa tus credenciales para acceder al panel"
            : "Regístrate como organizador para publicar eventos"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {serverError && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {serverError}
            </div>
          )}

          {mode === "registro" && (
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                placeholder="Tu nombre completo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                aria-invalid={!!errors.nombre}
              />
              {errors.nombre && (
                <p className="text-xs text-destructive">{errors.nombre}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contrasenia">Contraseña</Label>
            <Input
              id="contrasenia"
              type="password"
              placeholder={mode === "registro" ? "Mínimo 6 caracteres" : "Tu contraseña"}
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              aria-invalid={!!errors.contrasenia}
            />
            {errors.contrasenia && (
              <p className="text-xs text-destructive">{errors.contrasenia}</p>
            )}
          </div>

          {mode === "registro" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="confirmarContrasenia">Confirmar Contraseña</Label>
                <Input
                  id="confirmarContrasenia"
                  type="password"
                  placeholder="Repite la contraseña"
                  value={confirmarContrasenia}
                  onChange={(e) => setConfirmarContrasenia(e.target.value)}
                  aria-invalid={!!errors.confirmarContrasenia}
                />
                {errors.confirmarContrasenia && (
                  <p className="text-xs text-destructive">{errors.confirmarContrasenia}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nitORut">
                  NIT o RUT <span className="text-muted-foreground">(opcional)</span>
                </Label>
                <Input
                  id="nitORut"
                  placeholder="NIT o RUT"
                  value={nitORut}
                  onChange={(e) => setNitORut(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefonoContacto">
                  Teléfono de Contacto <span className="text-muted-foreground">(opcional)</span>
                </Label>
                <Input
                  id="telefonoContacto"
                  placeholder="+57 300 123 4567"
                  value={telefonoContacto}
                  onChange={(e) => setTelefonoContacto(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sitioWeb">
                  Sitio Web <span className="text-muted-foreground">(opcional)</span>
                </Label>
                <Input
                  id="sitioWeb"
                  placeholder="https://tusitio.com"
                  value={sitioWeb}
                  onChange={(e) => setSitioWeb(e.target.value)}
                  aria-invalid={!!errors.sitioWeb}
                />
                {errors.sitioWeb && (
                  <p className="text-xs text-destructive">{errors.sitioWeb}</p>
                )}
              </div>
            </>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? "Procesando..."
              : mode === "login"
                ? "Iniciar Sesión"
                : "Crear Cuenta"}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                ¿No tienes cuenta?{" "}
                <Link href="/auth/registro" className="text-primary hover:underline">
                  Regístrate
                </Link>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <Link href="/auth/login" className="text-primary hover:underline">
                  Inicia Sesión
                </Link>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
