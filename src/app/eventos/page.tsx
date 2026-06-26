import { container } from "@/infrastructure/config/container"
import { ICiudadRepository } from "@/domain/ports/ICiudadRepository"
import { IEventoRepository } from "@/domain/ports/IEventoRepository"
import { SearchClient } from "@/infrastructure/driving/next/components/SearchClient"

export const dynamic = "force-dynamic"

export default async function EventosPage() {
  let ciudades: Array<{ id: string; nombre: string }> = []
  let intereses: Array<{ id: string; nombre: string }> = []

  try {
    const ciudadRepo = container.resolve<ICiudadRepository>("ICiudadRepository")
    const ciudadesData = await ciudadRepo.obtenerTodas()
    ciudades = ciudadesData.map((c) => ({ id: c.id, nombre: c.nombre }))
  } catch (error) {
    console.error("Error al cargar ciudades:", error)
  }

  try {
    const eventoRepo = container.resolve<IEventoRepository>("IEventoRepository")
    const interesesData = await eventoRepo.obtenerIntereses()
    intereses = interesesData.map((i) => ({ id: i.id, nombre: i.nombre }))
  } catch (error) {
    console.error("Error al cargar intereses:", error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Buscar Eventos</h1>
      <p className="mb-8 text-muted-foreground">
        Explora eventos por fecha, ciudad o intereses
      </p>
      <SearchClient ciudades={ciudades} intereses={intereses} />
    </div>
  )
}
