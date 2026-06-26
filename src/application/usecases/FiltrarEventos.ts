import { z } from "zod"
import { IEventoRepository } from "../../domain/ports/IEventoRepository"
import { IFiltrarEventos } from "../ports/IFiltrarEventos"
import { FiltrarEventosRequest, FiltrarEventosSchema } from "../dto/FiltrarEventosRequest"
import { EventoResponse } from "../dto/EventoResponse"
import { Result, success, failure } from "../../shared/result"

export class FiltrarEventos implements IFiltrarEventos {
  constructor(private readonly eventoRepository: IEventoRepository) {}

  async execute(params: FiltrarEventosRequest): Promise<Result<EventoResponse[]>> {
    try {
      const validParams = FiltrarEventosSchema.parse(params)

      const tieneFechas = validParams.fechaInicio !== undefined && validParams.fechaFin !== undefined
      const tieneIntereses = validParams.interesesIds !== undefined && validParams.interesesIds.length > 0

      let eventos

      if (tieneFechas || tieneIntereses) {
        eventos = await this.eventoRepository.obtenerPorFiltros({
          ciudadId: validParams.ciudadId,
          fechaInicio: validParams.fechaInicio,
          fechaFin: validParams.fechaFin,
          interesesIds: validParams.interesesIds,
        })
      } else {
        eventos = await this.eventoRepository.obtenerEventosDelDia(validParams.ciudadId)
      }

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
        ciudadId: e.ciudadId,
        organizadorId: e.organizadorId,
      }))

      return success(response)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return failure(error.issues.map((i) => i.message).join(", "))
      }
      return failure(
        error instanceof Error ? error.message : "Error al filtrar eventos"
      )
    }
  }
}
