import { Evento } from "../entities/Evento";
import { Actividad } from "../entities/Actividad";
import { Media } from "../entities/Media";
import { Participante } from "../entities/Participante";
import { Patrocinador } from "../entities/Patrocinador";
import { Ciudad } from "../entities/Ciudad";
import { Interes } from "../entities/Interes";

export interface FiltrosEvento {
  ciudadId: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  interesesIds?: string[];
}

export interface EventoDetalle {
  evento: Evento;
  actividades: Actividad[];
  media: Media[];
  participantes: Participante[];
  patrocinadores: Patrocinador[];
  intereses: Interes[];
  ciudad: Ciudad;
}

export interface IEventoRepository {
  obtenerEventosDelDia(ciudadId: string): Promise<Evento[]>;
  obtenerPorRangoFechas(ciudadId: string, inicio: Date, fin: Date): Promise<Evento[]>;
  obtenerPorIntereses(ciudadId: string, interesesIds: string[]): Promise<Evento[]>;
  obtenerPorFiltros(filtros: FiltrosEvento): Promise<Evento[]>;
  obtenerPorId(id: string): Promise<Evento | null>;
  obtenerDetallePorId(id: string): Promise<EventoDetalle | null>;
  guardar(evento: Evento): Promise<void>;
  guardarActividades(eventoId: string, actividades: Omit<Actividad, 'id'>[]): Promise<void>;
  guardarMedia(eventoId: string, mediaList: Omit<Media, 'id'>[]): Promise<void>;
  guardarParticipantes(eventoId: string, participantes: Omit<Participante, 'id'>[]): Promise<void>;
  guardarPatrocinadores(eventoId: string, patrocinadores: Omit<Patrocinador, 'id'>[]): Promise<void>;
  guardarIntereses(eventoId: string, interesesIds: string[]): Promise<void>;
  obtenerPorOrganizadorId(organizadorId: string): Promise<Evento[]>;
  obtenerCiudades(): Promise<Ciudad[]>;
  obtenerIntereses(): Promise<Interes[]>;
}
