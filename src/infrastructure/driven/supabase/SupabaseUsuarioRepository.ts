import { SupabaseClient } from "@supabase/supabase-js"
import { IUsuarioRepository } from "../../../domain/ports/IUsuarioRepository"
import { Usuario } from "../../../domain/entities/Usuario"
import { Organizador } from "../../../domain/entities/Organizador"

/**
 * Tipo que representa la unión de las tablas usuarios + organizadores.
 */
type UsuarioOrganizadorRow = Record<string, unknown>

/**
 * Determina si una fila corresponde a un organizador (tiene datos de organizador)
 * y construye la entidad de dominio apropiada.
 */
function mapearUsuario(row: UsuarioOrganizadorRow): Usuario {
  const id = row.id as string
  const nombre = row.nombre as string
  const email = row.email as string
  const contraseniaHash = row.contrasenia_hash as string
  const fechaRegistro = new Date(row.fecha_registro as string)

  // Verificar si tiene datos de organizador (nit_o_rut no nulo)
  const nitORut = row.nit_o_rut as string | null

  if (nitORut != null) {
    return new Organizador(
      id,
      nombre,
      email,
      contraseniaHash,
      fechaRegistro,
      nitORut,
      (row.telefono_contacto as string) ?? "",
      (row.sitio_web as string) ?? ""
    )
  }

  return new Usuario(id, nombre, email, contraseniaHash, fechaRegistro)
}

export class SupabaseUsuarioRepository implements IUsuarioRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  /**
   * Obtiene un usuario por su email, incluyendo datos de organizador si aplica.
   */
  async obtenerPorEmail(email: string): Promise<Usuario | null> {
    const { data, error } = await this.supabase
      .from("usuarios")
      .select(
        `
        *,
        organizadores!left (
          nit_o_rut,
          telefono_contacto,
          sitio_web
        )
      `
      )
      .eq("email", email)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      throw new Error(
        `Error al obtener usuario por email: ${error.message}`
      )
    }

    if (!data) return null

    return mapearUsuario(this._aplanarRow(data))
  }

  /**
   * Obtiene un usuario por su ID, incluyendo datos de organizador si aplica.
   */
  async obtenerPorId(id: string): Promise<Usuario | null> {
    const { data, error } = await this.supabase
      .from("usuarios")
      .select(
        `
        *,
        organizadores!left (
          nit_o_rut,
          telefono_contacto,
          sitio_web
        )
      `
      )
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      throw new Error(
        `Error al obtener usuario por ID: ${error.message}`
      )
    }

    if (!data) return null

    return mapearUsuario(this._aplanarRow(data))
  }

  /**
   * Guarda un usuario (o usuario + organizador si es instancia de Organizador).
   */
  async guardar(usuario: Usuario): Promise<void> {
    const usuarioPayload = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      contrasenia_hash: usuario.contraseniaHash,
      fecha_registro: usuario.fechaRegistro.toISOString(),
    }

    const { error: errorUsuario } = await this.supabase
      .from("usuarios")
      .insert(usuarioPayload)

    if (errorUsuario) {
      throw new Error(`Error al guardar usuario: ${errorUsuario.message}`)
    }

    // Si es un organizador, guardar también en la tabla organizadores
    if (usuario instanceof Organizador) {
      const organizadorPayload = {
        id: usuario.id,
        nit_o_rut: usuario.nitORut || null,
        telefono_contacto: usuario.telefonoContacto || null,
        sitio_web: usuario.sitioWeb || null,
      }

      const { error: errorOrganizador } = await this.supabase
        .from("organizadores")
        .insert(organizadorPayload)

      if (errorOrganizador) {
        throw new Error(
          `Error al guardar organizador: ${errorOrganizador.message}`
        )
      }
    }
  }

  /**
   * Aplana la fila devuelta por Supabase cuando se usa LEFT JOIN.
   * Convierte: { ..., organizadores: { nit_o_rut: "...", ... } }
   * En:       { ..., nit_o_rut: "...", telefono_contacto: "...", sitio_web: "..." }
   */
  private _aplanarRow(data: Record<string, unknown>): UsuarioOrganizadorRow {
    const { organizadores, ...resto } = data as {
      organizadores: Record<string, unknown> | null
      [key: string]: unknown
    }

    if (organizadores) {
      return { ...resto, ...organizadores }
    }

    return resto
  }
}
