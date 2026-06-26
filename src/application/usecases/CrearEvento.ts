import { randomUUID } from "crypto"
import { z } from "zod"
import { IEventoRepository } from "../../domain/ports/IEventoRepository"
import { Evento } from "../../domain/entities/Evento"
import { Actividad } from "../../domain/entities/Actividad"
import { Media } from "../../domain/entities/Media"
import { TipoMedia } from "../../domain/enums/TipoMedia"
import { Participante } from "../../domain/entities/Participante"
import { Patrocinador } from "../../domain/entities/Patrocinador"
import { ICrearEvento } from "../ports/ICrearEvento"
import { CrearEventoRequest, CrearEventoSchema } from "../dto/CrearEventoRequest"
import { EventoResponse } from "../dto/EventoResponse"
import { Result, success, failure } from "../../shared/result"

function timeStringToDate(timeStr: string): Date {
  const d = new Date()
  const parts = timeStr.split(":")
  if (parts.length >= 2) {
    d.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0, 0)
  }
  return d
}

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
        validParams.organizadorId,
        validParams.imagenUrl ?? ""
      )

      await this.eventoRepository.guardar(evento)

      const actividades = (validParams.actividades ?? []).map(
        (a) => new Actividad(
          randomUUID(),
          a.nombre,
          a.descripcion ?? "",
          timeStringToDate(a.horaInicio),
          timeStringToDate(a.horaFin),
          evento.id
        )
      )

      const mediaList = (validParams.media ?? []).map(
        (m) => new Media(
          randomUUID(),
          m.urlArchivo,
          m.tipo as TipoMedia,
          evento.id
        )
      )

      const participantes = (validParams.participantes ?? []).map(
        (p) => new Participante(
          randomUUID(),
          p.nombre,
          p.rolOPerfil,
          evento.id
        )
      )

      const patrocinadores = (validParams.patrocinadores ?? []).map(
        (p) => new Patrocinador(
          randomUUID(),
          p.nombre,
          p.descripcion ?? "",
          p.logoUrl ?? "",
          p.sitioWeb ?? "",
          evento.id
        )
      )

      await Promise.all([
        this.eventoRepository.guardarActividades(evento.id, actividades),
        this.eventoRepository.guardarMedia(evento.id, mediaList),
        this.eventoRepository.guardarParticipantes(evento.id, participantes),
        this.eventoRepository.guardarPatrocinadores(evento.id, patrocinadores),
        this.eventoRepository.guardarIntereses(evento.id, validParams.interesesIds ?? []),
      ])

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
        imagenUrl: evento.imagenUrl || null,
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
