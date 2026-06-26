import { EventoResponse } from "../dto/EventoResponse"
import { Result } from "../../shared/result"

export interface IGetEventoPorId {
  execute(id: string): Promise<Result<EventoResponse | null>>
}
