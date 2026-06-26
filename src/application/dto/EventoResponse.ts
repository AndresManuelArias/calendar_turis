import { z } from "zod"

export const ActividadSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  descripcion: z.string(),
  horaInicio: z.string(),
  horaFin: z.string(),
})

export const MediaSchema = z.object({
  id: z.string(),
  urlArchivo: z.string(),
  tipo: z.string(),
})

export const ParticipanteSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  rolOPerfil: z.string(),
})

export const PatrocinadorSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  descripcion: z.string().nullable(),
  logoUrl: z.string().nullable(),
  sitioWeb: z.string().nullable(),
})

export const InteresSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  descripcion: z.string(),
})

export const CiudadInfoSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  estado: z.string(),
  pais: z.string(),
})

export const EventoSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  objetivo: z.string(),
  publicoObjetivo: z.string(),
  descripcionItinerario: z.string(),
  fechaInicio: z.date(),
  fechaFin: z.date(),
  lugarDireccion: z.string(),
  costoEntrada: z.number(),
  esGratuito: z.boolean(),
  urlTicketeraExterna: z.string().nullable(),
  observaciones: z.string().nullable(),
  ciudadId: z.string(),
  organizadorId: z.string(),
  actividades: z.array(ActividadSchema).optional(),
  media: z.array(MediaSchema).optional(),
  participantes: z.array(ParticipanteSchema).optional(),
  patrocinadores: z.array(PatrocinadorSchema).optional(),
  intereses: z.array(InteresSchema).optional(),
  ciudad: CiudadInfoSchema.optional(),
})

export type EventoResponse = z.infer<typeof EventoSchema>
export type ActividadDto = z.infer<typeof ActividadSchema>
export type MediaDto = z.infer<typeof MediaSchema>
export type ParticipanteDto = z.infer<typeof ParticipanteSchema>
export type PatrocinadorDto = z.infer<typeof PatrocinadorSchema>
export type InteresDto = z.infer<typeof InteresSchema>
export type CiudadInfoDto = z.infer<typeof CiudadInfoSchema>
