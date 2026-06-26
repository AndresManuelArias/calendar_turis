import { RegistroRequest } from "../dto/RegistroRequest"
import { Result } from "../../shared/result"

export interface IRegistrarOrganizador {
  execute(request: RegistroRequest): Promise<Result<void>>
}
