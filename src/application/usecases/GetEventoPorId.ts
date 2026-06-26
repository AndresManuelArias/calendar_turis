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

      const detalle = await this.eventoRepository.obtenerDetallePorId(id)

      if (!detalle) {
        return success(null)
      }

      const { evento, actividades, media, participantes, patrocinadores, intereses, ciudad } = detalle

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
        actividades: actividades.map((a) => ({
          id: a.id,
          nombre: a.nombre,
          descripcion: a.descripcion,
          horaInicio: a.horaInicio.toISOString(),
          horaFin: a.horaFin.toISOString(),
        })),
        media: media.map((m) => ({
          id: m.id,
          urlArchivo: m.urlArchivo,
          tipo: m.tipo,
        })),
        participantes: participantes.map((p) => ({
          id: p.id,
          nombre: p.nombre,
          rolOPerfil: p.rolOPerfil,
        })),
        patrocinadores: patrocinadores.map((p) => ({
          id: p.id,
          nombreEmpresa: p.nombreEmpresa,
          urlLogo: p.urlLogo || null,
          nivelPatrocinio: p.nivelPatrocinio,
        })),
        intereses: intereses.map((i) => ({
          id: i.id,
          nombre: i.nombre,
          descripcion: i.descripcion,
        })),
        ciudad: {
          id: ciudad.id,
          nombre: ciudad.nombre,
          codigoRegion: ciudad.codigoRegion,
          pais: ciudad.pais,
        },
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
