import { z } from "zod"
import { IUsuarioRepository } from "../../domain/ports/IUsuarioRepository"
import { IIniciarSesion } from "../ports/IIniciarSesion"
import { LoginRequest, LoginSchema } from "../dto/LoginRequest"
import { SessionResponse } from "../dto/SessionResponse"
import { Result, success, failure } from "../../shared/result"

export class IniciarSesion implements IIniciarSesion {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async execute(request: LoginRequest): Promise<Result<SessionResponse>> {
    try {
      const validParams = LoginSchema.parse(request)

      const usuario = await this.usuarioRepository.obtenerPorEmail(validParams.email)
      if (!usuario) {
        return failure("Credenciales inválidas")
      }

      const sesionValida = usuario.iniciarSesion(validParams.contrasenia)
      if (!sesionValida) {
        return failure("Credenciales inválidas")
      }

      const response: SessionResponse = {
        usuarioId: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        token: `token-${usuario.id}-${Date.now()}`,
      }

      return success(response)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return failure(error.issues.map((i) => i.message).join(", "))
      }
      return failure(
        error instanceof Error ? error.message : "Error al iniciar sesión"
      )
    }
  }
}
