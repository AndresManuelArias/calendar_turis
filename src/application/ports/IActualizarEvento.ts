import { EventoResponse } from "../dto/EventoResponse"
import { ActualizarEventoRequest } from "../dto/ActualizarEventoRequest"
import { Result } from "../../shared/result"

export interface IActualizarEvento {
  execute(request: ActualizarEventoRequest): Promise<Result<EventoResponse>>
}
