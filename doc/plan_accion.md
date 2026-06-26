# Plan de Acción — MVP Agenda Lugar

## Stack técnico

- **Framework:** Next.js 14+ (App Router) + TypeScript
- **Arquitectura:** Hexagonal (Domain → Application → Infrastructure → UI)
- **UI:** Tailwind CSS + shadcn/ui
- **Validación:** Zod
- **Base de datos:** Supabase (PostgreSQL + Auth)
- **DI:** Contenedor manual TypeScript (`container.ts`)
- **Paquete:** pnpm

## Entidades del dominio (10)

`Ciudad`, `Usuario`, `Organizador` (extiende Usuario), `Evento`, `Actividad`, `Interes`, `Media`, `Participante`, `Patrocinador`, `Alianza`

## Historias de Usuario (HU01-HU06)

| ID   | Descripción                             | Rol        |
|------|-----------------------------------------|------------|
| HU01 | Ver eventos del día (priorizados)       | Anónimo    |
| HU02 | Buscar por rango de fechas (calendario) | Anónimo    |
| HU03 | Filtrar por intereses/categorías        | Anónimo    |
| HU04 | Vista detalle del evento                | Anónimo    |
| HU05 | Registro y autenticación básica         | Organizador|
| HU06 | Crear eventos (formulario validado)     | Organizador|

---

## Fases de implementación

### Fase 0 — Scaffolding del proyecto

- Inicializar Next.js con App Router y TypeScript
- Configurar Tailwind CSS y shadcn/ui
- Configurar Supabase CLI + Docker local (PostgreSQL + Auth)
- Crear estructura de carpetas hexagonal (`src/domain/`, `src/application/`, `src/infrastructure/`, `src/shared/`)
- Instalar dependencias: `zod`, `@supabase/supabase-js`
- Crear archivo `.env.local` con variables de Supabase

### Fase 1 — Capa de Dominio

- Implementar entidades: `Ciudad`, `Evento`, `Actividad`, `Interes`, `Media`, `Participante`, `Patrocinador`, `Alianza`, `Usuario`, `Organizador`
- Definir puertos de salida (repositorios): `IEventoRepository`, `ICiudadRepository`, `IUsuarioRepository`
- Implementar `Result<T, E>` y errores compartidos en `src/shared/`
- Crear helpers de dominio (`esHoy()`, `estaActivo()`)

### Fase 2 — Capa de Aplicación

- Definir puertos de entrada:
  - `IGetEventosDelDia`
  - `IGetEventoPorId`
  - `IBuscarEventosPorFecha`
  - `IFiltrarEventosPorIntereses`
  - `IRegistrarOrganizador`
  - `ICrearEvento`
- Implementar casos de uso:
  - `GetEventosDelDia` (HU01)
  - `BuscarEventosPorFecha` (HU02)
  - `FiltrarEventosPorIntereses` (HU03)
  - `GetEventoPorId` (HU04)
  - `RegistrarOrganizador` (HU05)
  - `CrearEvento` (HU06)
- Definir DTOs: `EventoResponse`, `EventoRequest`, `FiltroRequest`

### Fase 3 — Capa de Infraestructura

- Configurar cliente Supabase
- Implementar adaptadores secundarios (driven):
  - `SupabaseEventoRepository` implementa `IEventoRepository`
  - `SupabaseCiudadRepository` implementa `ICiudadRepository`
  - `SupabaseUsuarioRepository` implementa `IUsuarioRepository`
- Configurar DI container (`container.ts`) registrando casos de uso y repositorios
- Definir esquemas de base de datos SQL (migraciones Supabase)

### Fase 4 — HU01: Eventos del día

- **API Route:** `GET /api/eventos/hoy` → invoca `GetEventosDelDia`
- **UI:** Página principal con lista de eventos del día priorizada por cercanía/ciudad
- Componentes: `EventoCard`, `CitySelector`

### Fase 5 — HU02: Búsqueda por fechas

- **API Route:** `GET /api/eventos?fechaInicio=&fechaFin=` → invoca `BuscarEventosPorFecha`
- **UI:** Calendario/DatePicker para seleccionar rango
- Componentes: `DateRangePicker`, `EventoList`

### Fase 6 — HU03: Filtro por intereses

- **API Route:** `GET /api/eventos?intereses=` → invoca `FiltrarEventosPorIntereses`
- **UI:** Selector de categorías/intereses (chips/tags)
- Componentes: `InteresChips`, integración con filtro existente

### Fase 7 — HU04: Vista detalle del evento

- **API Route:** `GET /api/eventos/[id]` → invoca `GetEventoPorId`
- **UI:** Página `/eventos/[id]` con info completa, actividades, media, mapa, botón de compra/entrada libre
- Componentes: `EventoDetail`, `ActividadList`, `MediaGallery`, `ParticipanteList`, `PatrocinadorList`

### Fase 8 — HU05: Autenticación de organizador

- **API Route:** `POST /api/auth/registro`, `POST /api/auth/login`
- **UI:** Páginas `/registro` y `/login`
- Integración con Supabase Auth (email + password)
- Componentes: `RegisterForm`, `LoginForm`, `AuthGuard`

### Fase 9 — HU06: Creación de eventos

- **API Route:** `POST /api/eventos` → invoca `CrearEvento`
- **UI:** Página `/eventos/nuevo` con formulario paso a paso (multi-step)
- Validación con Zod en frontend y backend
- Componentes: `EventoForm` (con secciones para Actividades, Media, Participantes, Patrocinadores)

### Fase 10 — Integración, pruebas y despliegue

- Probar flujo completo: registro → login → crear evento → ver en listado público
- Configurar despliegue en Render (build: `pnpm install && pnpm build`, start: `pnpm start`)
- Variables de entorno: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NODE_VERSION`
