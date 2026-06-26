import { LoginRequest } from "../dto/LoginRequest"
import { SessionResponse } from "../dto/SessionResponse"
import { Result } from "../../shared/result"

export interface IIniciarSesion {
  execute(request: LoginRequest): Promise<Result<SessionResponse>>
}
