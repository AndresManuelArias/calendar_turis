import { randomUUID } from "crypto"
import { z } from "zod"
import { IEventoRepository } from "../../domain/ports/IEventoRepository"
import { Evento } from "../../domain/entities/Evento"
import { ICrearEvento } from "../ports/ICrearEvento"
import { CrearEventoRequest, CrearEventoSchema } from "../dto/CrearEventoRequest"
import { EventoResponse } from "../dto/EventoResponse"
import { Result, success, failure } from "../../shared/result"

export class CrearEvento implements ICrearEvento {
  constructor(private readonly eventoRepository: IEventoRepository) {}

  async execute(request: CrearEventoRequest): Promise<Result<EventoResponse>> {
    try {
      const validParams = CrearEventoSchema.parse(request)

      const evento = new Evento(
        randomUUID(),
        validParams.titulo,
        validParams.objetivo,
        validParams.publicoObjetivo,
        validParams.descripcionItinerario ?? "",
        validParams.fechaInicio,
        validParams.fechaFin,
        validParams.lugarDireccion,
        validParams.costoEntrada,
        validParams.esGratuito,
        validParams.urlTicketeraExterna ?? "",
        validParams.observaciones ?? "",
        validParams.ciudadId,
        validParams.organizadorId
      )

      await this.eventoRepository.guardar(evento)

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
        error instanceof Error ? error.message : "Error al crear evento"
      )
    }
  }
}
