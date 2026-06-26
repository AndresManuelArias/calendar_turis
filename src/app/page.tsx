import { container } from "@/infrastructure/config/container"
import { ICiudadRepository } from "@/domain/ports/ICiudadRepository"
import { HomeClient } from "@/infrastructure/driving/next/components/HomeClient"

export const dynamic = "force-dynamic"

export default async function Home() {
  let ubicaciones: Array<{
    nombre: string
    estados: Array<{
      nombre: string
      ciudades: Array<{ id: string; nombre: string }>
    }>
  }> = []

  try {
    const ciudadRepo = container.resolve<ICiudadRepository>("ICiudadRepository")
    const ciudades = await ciudadRepo.obtenerTodas()

    const paisesMap = new Map<string, Map<string, Array<{ id: string; nombre: string }>>>()
    for (const c of ciudades) {
      if (!paisesMap.has(c.pais)) paisesMap.set(c.pais, new Map())
      const estadosMap = paisesMap.get(c.pais)!
      if (!estadosMap.has(c.estado)) estadosMap.set(c.estado, [])
      estadosMap.get(c.estado)!.push({ id: c.id, nombre: c.nombre })
    }

    ubicaciones = Array.from(paisesMap.entries()).map(([paisNombre, estadosMap]) => ({
      nombre: paisNombre,
      estados: Array.from(estadosMap.entries()).map(([estadoNombre, ciudades]) => ({
        nombre: estadoNombre,
        ciudades,
      })),
    }))
  } catch (error) {
    console.error("Error al cargar ubicaciones:", error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Agenda Lugar</h1>
      <p className="mb-8 text-muted-foreground">
        Descubre los mejores eventos en tu ciudad
      </p>
      <HomeClient ubicaciones={ubicaciones} />
    </div>
  )
}
