import { SupabaseClient } from "@supabase/supabase-js"
import { IEventoRepository, FiltrosEvento } from "../../../domain/ports/IEventoRepository"
import { Evento } from "../../../domain/entities/Evento"
import { Ciudad } from "../../../domain/entities/Ciudad"
import { Interes } from "../../../domain/entities/Interes"

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

function mapearCiudad(row: Record<string, unknown>): Ciudad {
  return new Ciudad(
    row.id as string,
    row.nombre as string,
    row.codigo_region as string
  )
}

function mapearInteres(row: Record<string, unknown>): Interes {
  return new Interes(
    row.id as string,
    row.nombre as string,
    row.descripcion as string
  )
}

export class SupabaseEventoRepository implements IEventoRepository {
  constructor(private readonly supabase: SupabaseClient) {}

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

    const dataAny = data as unknown as Record<string, unknown>[]
    const rows = dataAny ?? []
    const vistos = new Set<string>()
    const eventos: Evento[] = []
    for (const row of rows) {
      if (!vistos.has(row.id as string)) {
        vistos.add(row.id as string)
        eventos.push(mapearEvento(row))
      }
    }

    return eventos
  }

  async obtenerPorFiltros(filtros: FiltrosEvento): Promise<Evento[]> {
    const tieneRango = filtros.fechaInicio !== undefined && filtros.fechaFin !== undefined
    const tieneIntereses = filtros.interesesIds !== undefined && filtros.interesesIds.length > 0

    let query = this.supabase
      .from("eventos")
      .select(tieneIntereses ? "*, evento_interes!inner(*)" : "*")
      .eq("ciudad_id", filtros.ciudadId)

    if (tieneRango) {
      query = query
        .gte("fecha_inicio", filtros.fechaInicio!.toISOString())
        .lte("fecha_fin", filtros.fechaFin!.toISOString())
    }

    if (tieneIntereses) {
      query = query.in("evento_interes.interes_id", filtros.interesesIds!)
    }

    query = query.order("fecha_inicio", { ascending: true })

    const { data, error } = await query

    if (error) {
      throw new Error(
        `Error al obtener eventos por filtros: ${error.message}`
      )
    }

    const dataAny = data as unknown as Record<string, unknown>[]
    const rows = dataAny ?? []

    if (tieneIntereses) {
      const vistos = new Set<string>()
      const eventos: Evento[] = []
      for (const row of rows) {
        if (!vistos.has(row.id as string)) {
          vistos.add(row.id as string)
          eventos.push(mapearEvento(row))
        }
      }
      return eventos
    }

    return rows.map(mapearEvento)
  }

  async obtenerPorId(id: string): Promise<Evento | null> {
    const { data, error } = await this.supabase
      .from("eventos")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      throw new Error(`Error al obtener evento por ID: ${error.message}`)
    }

    return data ? mapearEvento(data) : null
  }

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

  async obtenerIntereses(): Promise<Interes[]> {
    const { data, error } = await this.supabase
      .from("intereses")
      .select("*")
      .order("nombre", { ascending: true })

    if (error) {
      throw new Error(`Error al obtener intereses: ${error.message}`)
    }

    return (data ?? []).map(mapearInteres)
  }

  private _inicioDelDia(): string {
    const ahora = new Date()
    const inicio = new Date(
      Date.UTC(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0, 0)
    )
    return inicio.toISOString()
  }

  private _inicioDelDiaSiguiente(): string {
    const ahora = new Date()
    const inicio = new Date(
      Date.UTC(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1, 0, 0, 0, 0)
    )
    return inicio.toISOString()
  }
}
