import { z } from "zod"

export const FiltrarEventosSchema = z.object({
  ciudadId: z.string().min(1, "Ciudad requerida"),
  fechaInicio: z.date().optional(),
  fechaFin: z.date().optional(),
  interesesIds: z.array(z.string()).optional(),
})

export type FiltrarEventosRequest = z.infer<typeof FiltrarEventosSchema>
