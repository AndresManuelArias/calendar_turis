import { SupabaseClient } from "@supabase/supabase-js"
import { ICiudadRepository } from "../../../domain/ports/ICiudadRepository"
import { Ciudad } from "../../../domain/entities/Ciudad"

/**
 * Mapea una fila de la tabla `ciudades` (snake_case) a una entidad de dominio Ciudad (camelCase).
 */
function mapearCiudad(row: Record<string, unknown>): Ciudad {
  return new Ciudad(
    row.id as string,
    row.nombre as string,
    row.codigo_region as string,
    (row.pais as string) ?? "Colombia"
  )
}

export class SupabaseCiudadRepository implements ICiudadRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  /**
   * Obtiene todas las ciudades ordenadas por nombre.
   */
  async obtenerTodas(): Promise<Ciudad[]> {
    const { data, error } = await this.supabase
      .from("ciudades")
      .select("*")
      .order("nombre", { ascending: true })

    if (error) {
      throw new Error(`Error al obtener ciudades: ${error.message}`)
    }

    return (data ?? []).map(mapearCiudad)
  }

  /**
   * Obtiene una ciudad por su ID.
   */
  async obtenerPorId(id: string): Promise<Ciudad | null> {
    const { data, error } = await this.supabase
      .from("ciudades")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      throw new Error(`Error al obtener ciudad por ID: ${error.message}`)
    }

    return data ? mapearCiudad(data) : null
  }

  /**
   * Guarda una nueva ciudad.
   */
  async guardar(ciudad: Ciudad): Promise<void> {
    const payload = {
      id: ciudad.id,
      nombre: ciudad.nombre,
      codigo_region: ciudad.codigoRegion,
      pais: ciudad.pais,
    }

    const { error } = await this.supabase.from("ciudades").insert(payload)

    if (error) {
      throw new Error(`Error al guardar ciudad: ${error.message}`)
    }
  }
}
