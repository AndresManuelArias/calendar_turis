import { SupabaseClient } from "@supabase/supabase-js"
import { supabase } from "./supabaseClient"

// ─── Repositorios ────────────────────────────────────────────
import { IEventoRepository } from "../../domain/ports/IEventoRepository"
import { ICiudadRepository } from "../../domain/ports/ICiudadRepository"
import { IUsuarioRepository } from "../../domain/ports/IUsuarioRepository"
import { SupabaseEventoRepository } from "../driven/supabase/SupabaseEventoRepository"
import { SupabaseCiudadRepository } from "../driven/supabase/SupabaseCiudadRepository"
import { SupabaseUsuarioRepository } from "../driven/supabase/SupabaseUsuarioRepository"

// ─── Casos de uso ────────────────────────────────────────────
import { IGetEventosDelDia } from "../../application/ports/IGetEventosDelDia"
import { IFiltrarEventos } from "../../application/ports/IFiltrarEventos"
import { IGetEventoPorId } from "../../application/ports/IGetEventoPorId"
import { ICrearEvento } from "../../application/ports/ICrearEvento"
import { IRegistrarOrganizador } from "../../application/ports/IRegistrarOrganizador"
import { IIniciarSesion } from "../../application/ports/IIniciarSesion"
import { IActualizarEvento } from "../../application/ports/IActualizarEvento"
import { GetEventosDelDia } from "../../application/usecases/GetEventosDelDia"
import { FiltrarEventos } from "../../application/usecases/FiltrarEventos"
import { GetEventoPorId } from "../../application/usecases/GetEventoPorId"
import { CrearEvento } from "../../application/usecases/CrearEvento"
import { ActualizarEvento } from "../../application/usecases/ActualizarEvento"
import { RegistrarOrganizador } from "../../application/usecases/RegistrarOrganizador"
import { IniciarSesion } from "../../application/usecases/IniciarSesion"

// ================================================================
// Contenedor de Inyección de Dependencias manual
// ================================================================

type Factory<T> = (container: Container) => T

class Container {
  /** Instancias singleton ya creadas (almacenadas por clave). */
  private singletons = new Map<string, unknown>()

  /** Fábricas registradas con su modo de resolución. */
  private registry = new Map<
    string,
    { factory: Factory<unknown>; mode: "singleton" | "transient" }
  >()

  // ─── Registro ───────────────────────────────────────────────

  /**
   * Registra una dependencia como singleton (una única instancia)
   * o transient (nueva instancia en cada resolución).
   */
  register<T>(key: string, factory: Factory<T>, mode: "singleton" | "transient" = "singleton"): void {
    this.registry.set(key, { factory: factory as Factory<unknown>, mode })
  }

  /**
   * Atajo para registrar un singleton.
   */
  singleton<T>(key: string, factory: Factory<T>): void {
    this.register(key, factory, "singleton")
  }

  /**
   * Atajo para registrar un transient (nueva instancia cada vez).
   */
  transient<T>(key: string, factory: Factory<T>): void {
    this.register(key, factory, "transient")
  }

  // ─── Resolución ─────────────────────────────────────────────

  /**
   * Resuelve una dependencia registrada.
   * @throws Error si la clave no está registrada.
   */
  resolve<T>(key: string): T {
    const entry = this.registry.get(key)
    if (!entry) {
      throw new Error(
        `No hay ninguna dependencia registrada para "${key}". ` +
          "Asegúrate de haberla registrado antes de resolverla."
      )
    }

    if (entry.mode === "singleton") {
      if (!this.singletons.has(key)) {
        this.singletons.set(key, entry.factory(this))
      }
      return this.singletons.get(key) as T
    }

    // transient: nueva instancia cada vez
    return entry.factory(this) as T
  }

  /**
   * Verifica si una clave está registrada.
   */
  has(key: string): boolean {
    return this.registry.has(key)
  }

  /**
   * Limpia todas las instancias singleton (útil para testing).
   */
  reset(): void {
    this.singletons.clear()
  }
}

// ================================================================
// Instancia global del contenedor
// ================================================================

export const container = new Container()

// ─── Servicios base ────────────────────────────────────────────
container.singleton<SupabaseClient>("SupabaseClient", () => supabase)

// ─── Repositorios (singleton) ──────────────────────────────────
container.singleton<IEventoRepository>("IEventoRepository", (c) => {
  return new SupabaseEventoRepository(c.resolve<SupabaseClient>("SupabaseClient"))
})

container.singleton<ICiudadRepository>("ICiudadRepository", (c) => {
  return new SupabaseCiudadRepository(c.resolve<SupabaseClient>("SupabaseClient"))
})

container.singleton<IUsuarioRepository>("IUsuarioRepository", (c) => {
  return new SupabaseUsuarioRepository(c.resolve<SupabaseClient>("SupabaseClient"))
})

// ─── Casos de uso (transient — nueva instancia cada vez) ───────
container.transient<IGetEventosDelDia>("IGetEventosDelDia", (c) => {
  return new GetEventosDelDia(c.resolve<IEventoRepository>("IEventoRepository"))
})

container.transient<IFiltrarEventos>("IFiltrarEventos", (c) => {
  return new FiltrarEventos(c.resolve<IEventoRepository>("IEventoRepository"))
})

container.transient<IGetEventoPorId>("IGetEventoPorId", (c) => {
  return new GetEventoPorId(c.resolve<IEventoRepository>("IEventoRepository"))
})

container.transient<ICrearEvento>("ICrearEvento", (c) => {
  return new CrearEvento(c.resolve<IEventoRepository>("IEventoRepository"))
})

container.transient<IRegistrarOrganizador>("IRegistrarOrganizador", (c) => {
  return new RegistrarOrganizador(c.resolve<IUsuarioRepository>("IUsuarioRepository"))
})

container.transient<IIniciarSesion>("IIniciarSesion", (c) => {
  return new IniciarSesion(c.resolve<IUsuarioRepository>("IUsuarioRepository"))
})

container.transient<IActualizarEvento>("IActualizarEvento", (c) => {
  return new ActualizarEvento(c.resolve<IEventoRepository>("IEventoRepository"))
})
