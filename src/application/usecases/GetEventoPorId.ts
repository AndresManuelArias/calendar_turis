import { z } from "zod"
import { IEventoRepository } from "../../domain/ports/IEventoRepository"
import { IGetEventoPorId } from "../ports/IGetEventoPorId"
import { EventoResponse } from "../dto/EventoResponse"
import { Result, success, failure } from "../../shared/result"

const idSchema = z.string().min(1, "ID requerido")

export class GetEventoPorId implements IGetEventoPorId {
  constructor(private readonly eventoRepository: IEventoRepository) {}

  async execute(id: string): Promise<Result<EventoResponse | null>> {
    try {
      idSchema.parse(id)

      const evento = await this.eventoRepository.obtenerPorId(id)

      if (!evento) {
        return success(null)
      }

      const response: EventoResponse = {
        id: evento.id,
        titulo: evento.titulo,
        objetivo: evento.objetivo,
        publicoObjetivo: evento.publicoObjetivo,
        descripcionItinerario: evento.descripcionItinerario,
        fechaInicio: evento.fechaInicio,
        fechaFin: evento.fechaFin,
        lugarDireccion: evento.lugarDireccion,
        costoEntrada: evento.costoEntrada,
        esGratuito: evento.esGratuito,
        urlTicketeraExterna: evento.urlTicketeraExterna || null,
        observaciones: evento.observaciones || null,
        ciudadId: evento.ciudadId,
        organizadorId: evento.organizadorId,
      }

      return success(response)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return failure(error.issues.map((i) => i.message).join(", "))
      }
      return failure(
        error instanceof Error ? error.message : "Error al obtener evento"
      )
    }
  }
}
