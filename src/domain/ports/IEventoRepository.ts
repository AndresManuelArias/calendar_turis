import { Evento } from "../entities/Evento";
import { Ciudad } from "../entities/Ciudad";
import { Interes } from "../entities/Interes";

export interface FiltrosEvento {
  ciudadId: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  interesesIds?: string[];
}

export interface IEventoRepository {
  obtenerEventosDelDia(ciudadId: string): Promise<Evento[]>;
  obtenerPorRangoFechas(ciudadId: string, inicio: Date, fin: Date): Promise<Evento[]>;
  obtenerPorIntereses(ciudadId: string, interesesIds: string[]): Promise<Evento[]>;
  obtenerPorFiltros(filtros: FiltrosEvento): Promise<Evento[]>;
  obtenerPorId(id: string): Promise<Evento | null>;
  guardar(evento: Evento): Promise<void>;
  obtenerCiudades(): Promise<Ciudad[]>;
  obtenerIntereses(): Promise<Interes[]>;
}
