import { SupabaseClient } from "@supabase/supabase-js"
import { IEventoRepository } from "../../../domain/ports/IEventoRepository"
import { Evento } from "../../../domain/entities/Evento"
import { Ciudad } from "../../../domain/entities/Ciudad"

/**
 * Mapea una fila de la tabla `eventos` (snake_case) a una entidad de dominio Evento (camelCase).
 */
function mapearEvento( row: Record<string, unknown> ): Evento {
  return new Evento(
    row.id as string,
    row.titulo as string,
    row.objetivo as string,
    row.publico_objetivo as string,
    (row.descripcion_itinerario as string) ?? "",
    new Date(row.fecha_inicio as string),
    new Date(row.fecha_fin as string),
    row.lugar_direccion as string,
    Number(row.costo_entrada ?? 0),
    row.es_gratuito as boolean,
    (row.url_ticketera_externa as string) ?? "",
    (row.observaciones as string) ?? "",
    row.ciudad_id as string,
    row.organizador_id as string
  )
}

/**
 * Mapea una fila de la tabla `ciudades` a una entidad de dominio Ciudad.
 */
function mapearCiudad(row: Record<string, unknown>): Ciudad {
  return new Ciudad(
    row.id as string,
    row.nombre as string,
    row.codigo_region as string
  )
}

export class SupabaseEventoRepository implements IEventoRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  /**
   * Obtiene los eventos cuyo fecha_inicio coincide con la fecha actual
   * y pertenecen a la ciudad especificada.
   */
  async obtenerEventosDelDia(ciudadId: string): Promise<Evento[]> {
    const { data, error } = await this.supabase
      .from("eventos")
      .select("*")
      .gte("fecha_inicio", this._inicioDelDia())
      .lt("fecha_inicio", this._inicioDelDiaSiguiente())
      .eq("ciudad_id", ciudadId)
      .order("fecha_inicio", { ascending: true })

    if (error) {
      throw new Error(`Error al obtener eventos del día: ${error.message}`)
    }

    return (data ?? []).map(mapearEvento)
  }

  /**
   * Obtiene eventos en un rango de fechas para una ciudad.
   */
  async obtenerPorRangoFechas(
    ciudadId: string,
    inicio: Date,
    fin: Date
  ): Promise<Evento[]> {
    const { data, error } = await this.supabase
      .from("eventos")
      .select("*")
      .gte("fecha_inicio", inicio.toISOString())
      .lte("fecha_fin", fin.toISOString())
      .eq("ciudad_id", ciudadId)
      .order("fecha_inicio", { ascending: true })

    if (error) {
      throw new Error(
        `Error al obtener eventos por rango de fechas: ${error.message}`
      )
    }

    return (data ?? []).map(mapearEvento)
  }

  /**
   * Obtiene eventos filtrados por ciudad y lista de intereses.
   * Realiza JOIN con la tabla pivote evento_interes.
   */
  async obtenerPorIntereses(
    ciudadId: string,
    interesesIds: string[]
  ): Promise<Evento[]> {
    if (interesesIds.length === 0) {
      return []
    }

    const { data, error } = await this.supabase
      .from("eventos")
      .select("*, evento_interes!inner(*)")
      .eq("ciudad_id", ciudadId)
      .in("evento_interes.interes_id", interesesIds)
      .order("fecha_inicio", { ascending: true })

    if (error) {
      throw new Error(
        `Error al obtener eventos por intereses: ${error.message}`
      )
    }

    // Eliminar duplicados (un evento puede tener varios intereses)
    const vistos = new Set<string>()
    const eventos: Evento[] = []
    for (const row of data ?? []) {
      if (!vistos.has(row.id as string)) {
        vistos.add(row.id as string)
        eventos.push(mapearEvento(row))
      }
    }

    return eventos
  }

  /**
   * Obtiene un evento por su ID.
   */
  async obtenerPorId(id: string): Promise<Evento | null> {
    const { data, error } = await this.supabase
      .from("eventos")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // Código para "no se encontraron filas"
        return null
      }
      throw new Error(`Error al obtener evento por ID: ${error.message}`)
    }

    return data ? mapearEvento(data) : null
  }

  /**
   * Guarda un evento (INSERT o UPDATE).
   */
  async guardar(evento: Evento): Promise<void> {
    const payload = {
      id: evento.id,
      titulo: evento.titulo,
      objetivo: evento.objetivo,
      publico_objetivo: evento.publicoObjetivo,
      descripcion_itinerario: evento.descripcionItinerario,
      fecha_inicio: evento.fechaInicio.toISOString(),
      fecha_fin: evento.fechaFin.toISOString(),
      lugar_direccion: evento.lugarDireccion,
      costo_entrada: evento.costoEntrada,
      es_gratuito: evento.esGratuito,
      url_ticketera_externa: evento.urlTicketeraExterna || null,
      observaciones: evento.observaciones || null,
      ciudad_id: evento.ciudadId,
      organizador_id: evento.organizadorId,
    }

    const { error } = await this.supabase.from("eventos").upsert(payload, {
      onConflict: "id",
    })

    if (error) {
      throw new Error(`Error al guardar evento: ${error.message}`)
    }
  }

  /**
   * Obtiene todas las ciudades.
   */
  async obtenerCiudades(): Promise<Ciudad[]> {
    const { data, error } = await this.supabase
      .from("ciudades")
      .select("*")
      .order("nombre", { ascending: true })

    if (error) {
      throw new Error(`Error al obtener ciudades: ${error.message}`)
    }

    return (data ?? []).map(mapearCiudad)
  }

  // ─── Ayudantes privados ──────────────────────────────────

  /** Devuelve un Date al inicio del día actual (00:00:00 UTC). */
  private _inicioDelDia(): string {
    const ahora = new Date()
    const inicio = new Date(
      Date.UTC(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0, 0)
    )
    return inicio.toISOString()
  }

  /** Devuelve un Date al inicio del día siguiente (00:00:00 UTC). */
  private _inicioDelDiaSiguiente(): string {
    const ahora = new Date()
    const inicio = new Date(
      Date.UTC(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1, 0, 0, 0, 0)
    )
    return inicio.toISOString()
  }
}
