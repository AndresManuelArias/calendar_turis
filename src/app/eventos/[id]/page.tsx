import { container } from "@/infrastructure/config/container"
import { IGetEventoPorId } from "@/application/ports/IGetEventoPorId"
import { EventoDetail } from "@/infrastructure/driving/next/components/EventoDetail"
import { ImageGallery } from "@/infrastructure/driving/next/components/ImageGallery"
import { VideoEmbed } from "@/infrastructure/driving/next/components/VideoEmbed"
import { ActividadList } from "@/infrastructure/driving/next/components/ActividadList"
import { ParticipanteList } from "@/infrastructure/driving/next/components/ParticipanteList"
import { PatrocinadorList } from "@/infrastructure/driving/next/components/PatrocinadorList"
import type { EventoResponse } from "@/application/dto/EventoResponse"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EventoDetailPage({ params }: PageProps) {
  const { id } = await params

  let evento: EventoResponse | null = null
  let error: string | null = null

  try {
    const useCase = container.resolve<IGetEventoPorId>("IGetEventoPorId")
    const result = await useCase.execute(id)

    if (!result.success) {
      error = result.error
    } else if (!result.data) {
      error = "Evento no encontrado"
    } else {
      evento = result.data
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Error al cargar el evento"
  }

  if (error || !evento) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-muted-foreground">
          {error || "Evento no encontrado"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          El evento que buscas no existe o ha sido eliminado.
        </p>
        <a
          href="/"
          className="mt-6 inline-block text-sm text-primary underline underline-offset-4 hover:text-primary/80"
        >
          Volver al inicio
        </a>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <EventoDetail evento={evento} />

          <ImageGallery media={evento.media ?? []} />

          <VideoEmbed media={evento.media ?? []} />

          <ActividadList actividades={evento.actividades ?? []} />
        </div>

        <aside className="space-y-8">
          <ParticipanteList participantes={evento.participantes ?? []} />

          <PatrocinadorList patrocinadores={evento.patrocinadores ?? []} />
        </aside>
      </div>
    </div>
  )
}
