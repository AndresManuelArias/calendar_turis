import { container } from "@/infrastructure/config/container"
import { ICiudadRepository } from "@/domain/ports/ICiudadRepository"
import { HomeClient } from "@/infrastructure/driving/next/components/HomeClient"

export const dynamic = "force-dynamic"

export default async function Home() {
  let ciudades: Array<{ id: string; nombre: string }> = []

  try {
    const ciudadRepo = container.resolve<ICiudadRepository>("ICiudadRepository")
    const ciudadesData = await ciudadRepo.obtenerTodas()
    ciudades = ciudadesData.map((c) => ({ id: c.id, nombre: c.nombre }))
  } catch (error) {
    console.error("Error al cargar ciudades:", error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Agenda Lugar</h1>
      <p className="mb-8 text-muted-foreground">
        Descubre los mejores eventos en tu ciudad
      </p>
      <HomeClient ciudades={ciudades} />
    </div>
  )
}
