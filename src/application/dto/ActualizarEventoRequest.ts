import { z } from "zod"

const ActividadInputSchema = z.object({
  nombre: z.string().min(1, "Nombre de actividad requerido"),
  descripcion: z.string().optional(),
  horaInicio: z.string().regex(/^\d{2}:\d{2}$/, "Hora inicio debe tener formato HH:mm"),
  horaFin: z.string().regex(/^\d{2}:\d{2}$/, "Hora fin debe tener formato HH:mm"),
})

const MediaInputSchema = z.object({
  urlArchivo: z.string().min(1, "URL de archivo requerida"),
  tipo: z.enum(["IMAGEN", "VIDEO_EMBEDDED"]),
})

const ParticipanteInputSchema = z.object({
  nombre: z.string().min(1, "Nombre de participante requerido"),
  rolOPerfil: z.string().min(1, "Rol o perfil requerido"),
})

const PatrocinadorInputSchema = z.object({
  nombre: z.string().min(1, "Nombre del patrocinador requerido"),
  descripcion: z.string().optional(),
  logoUrl: z.string().url("Logo URL debe ser válida").optional().or(z.literal("")),
  sitioWeb: z.string().url("Sitio web debe ser válida").optional().or(z.literal("")),
})

export const ActualizarEventoSchema = z.object({
  id: z.string().min(1, "ID requerido"),
  titulo: z.string().min(3, "Título debe tener al menos 3 caracteres"),
  objetivo: z.string().min(1, "Objetivo requerido"),
  publicoObjetivo: z.string().min(1, "Público objetivo requerido"),
  descripcionItinerario: z.string().optional(),
  fechaInicio: z.date(),
  fechaFin: z.date(),
  lugarDireccion: z.string().min(1, "Lugar requerido"),
  costoEntrada: z.number().min(0),
  esGratuito: z.boolean(),
  urlTicketeraExterna: z.string().url().nullable().optional(),
  observaciones: z.string().nullable().optional(),
  imagenUrl: z.string().optional(),
  ciudadId: z.string().min(1, "Ciudad requerida"),
  organizadorId: z.string().min(1, "Organizador requerido"),
  actividades: z.array(ActividadInputSchema).optional(),
  media: z.array(MediaInputSchema).optional(),
  participantes: z.array(ParticipanteInputSchema).optional(),
  patrocinadores: z.array(PatrocinadorInputSchema).optional(),
  interesesIds: z.array(z.string()).optional(),
})

export type ActualizarEventoRequest = z.infer<typeof ActualizarEventoSchema>
