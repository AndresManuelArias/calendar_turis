import { Ciudad } from "../entities/Ciudad";

export interface ICiudadRepository {
  obtenerTodas(): Promise<Ciudad[]>;
  obtenerPorId(id: string): Promise<Ciudad | null>;
  guardar(ciudad: Ciudad): Promise<void>;
}
