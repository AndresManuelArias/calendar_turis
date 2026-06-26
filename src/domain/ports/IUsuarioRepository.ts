import { Usuario } from "../entities/Usuario";

export interface IUsuarioRepository {
  obtenerPorEmail(email: string): Promise<Usuario | null>;
  obtenerPorId(id: string): Promise<Usuario | null>;
  guardar(usuario: Usuario): Promise<void>;
}
