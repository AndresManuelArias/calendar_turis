import { randomUUID } from "crypto"
import { z } from "zod"
import { IUsuarioRepository } from "../../domain/ports/IUsuarioRepository"
import { Organizador } from "../../domain/entities/Organizador"
import { IRegistrarOrganizador } from "../ports/IRegistrarOrganizador"
import { RegistroRequest, RegistroSchema } from "../dto/RegistroRequest"
import { Result, success, failure } from "../../shared/result"

export class RegistrarOrganizador implements IRegistrarOrganizador {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(request: RegistroRequest): Promise<Result<void>> {
    try {
      const validParams = RegistroSchema.parse(request)

      const existente = await this.usuarioRepository.obtenerPorEmail(validParams.email)
      if (existente) {
        return failure("El email ya está registrado")
      }

      const organizador = new Organizador(
        randomUUID(),
        validParams.nombre,
        validParams.email,
        validParams.contrasenia,
        new Date(),
        validParams.nitORut ?? "",
        validParams.telefonoContacto ?? "",
        validParams.sitioWeb ?? ""
      )

      await this.usuarioRepository.guardar(organizador)

      return success(undefined)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return failure(error.issues.map((i) => i.message).join(", "))
      }
      return failure(
        error instanceof Error ? error.message : "Error al registrar organizador"
      )
    }
  }
}
