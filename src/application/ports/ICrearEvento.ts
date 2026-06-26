import { EventoResponse } from "../dto/EventoResponse"
import { CrearEventoRequest } from "../dto/CrearEventoRequest"
import { Result } from "../../shared/result"

export interface ICrearEvento {
  execute(request: CrearEventoRequest): Promise<Result<EventoResponse>>
}
