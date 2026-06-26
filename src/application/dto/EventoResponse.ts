import { z } from "zod"

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
})

export type EventoResponse = z.infer<typeof EventoSchema>
