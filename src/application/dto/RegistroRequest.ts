import { z } from "zod"

export const RegistroSchema = z.object({
  nombre: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  contrasenia: z.string().min(6, "Mínimo 6 caracteres"),
  nitORut: z.string().optional(),
  telefonoContacto: z.string().optional(),
  sitioWeb: z.string().url().optional().nullable(),
})

export type RegistroRequest = z.infer<typeof RegistroSchema>
