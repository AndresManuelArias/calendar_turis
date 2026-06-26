import { z } from "zod"

export const CrearEventoSchema = z.object({
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
  ciudadId: z.string().min(1, "Ciudad requerida"),
  organizadorId: z.string().min(1, "Organizador requerido"),
})

export type CrearEventoRequest = z.infer<typeof CrearEventoSchema>
