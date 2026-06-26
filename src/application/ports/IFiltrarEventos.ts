import { EventoResponse } from "../dto/EventoResponse"
import { FiltrarEventosRequest } from "../dto/FiltrarEventosRequest"
import { Result } from "../../shared/result"

export interface IFiltrarEventos {
  execute(params: FiltrarEventosRequest): Promise<Result<EventoResponse[]>>
}
