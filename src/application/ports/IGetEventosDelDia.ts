import { EventoResponse } from "../dto/EventoResponse"
import { Result } from "../../shared/result"

export interface IGetEventosDelDia {
  execute(ciudadId: string): Promise<Result<EventoResponse[]>>
}
