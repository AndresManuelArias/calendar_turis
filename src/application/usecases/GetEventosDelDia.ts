import { z } from "zod"
import { IEventoRepository } from "../../domain/ports/IEventoRepository"
import { IGetEventosDelDia } from "../ports/IGetEventosDelDia"
import { EventoResponse } from "../dto/EventoResponse"
import { Result, success, failure } from "../../shared/result"

const ciudadIdSchema = z.string().min(1, "Ciudad requerida")

export class GetEventosDelDia implements IGetEventosDelDia {
  constructor(private readonly eventoRepository: IEventoRepository) {}

  async execute(ciudadId: string): Promise<Result<EventoResponse[]>> {
    try {
      ciudadIdSchema.parse(ciudadId)

      const eventos = await this.eventoRepository.obtenerEventosDelDia(ciudadId)

      const response: EventoResponse[] = eventos.map((e) => ({
        id: e.id,
        titulo: e.titulo,
        objetivo: e.objetivo,
        publicoObjetivo: e.publicoObjetivo,
        descripcionItinerario: e.descripcionItinerario,
        fechaInicio: e.fechaInicio,
        fechaFin: e.fechaFin,
        lugarDireccion: e.lugarDireccion,
        costoEntrada: e.costoEntrada,
        esGratuito: e.esGratuito,
        urlTicketeraExterna: e.urlTicketeraExterna || null,
        observaciones: e.observaciones || null,
        imagenUrl: e.imagenUrl || null,
        ciudadId: e.ciudadId,
        organizadorId: e.organizadorId,
      }))

      return success(response)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return failure(error.issues.map((i) => i.message).join(", "))
      }
      return failure(
        error instanceof Error ? error.message : "Error al obtener eventos del día"
      )
    }
  }
}
