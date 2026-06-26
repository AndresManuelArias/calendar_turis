# Plan de Acción — MVP Agenda Lugar

## Stack técnico

- **Framework:** Next.js 14+ (App Router) + TypeScript
- **Arquitectura:** Hexagonal (Domain → Application → Infrastructure → UI)
- **UI:** Tailwind CSS + shadcn/ui + Lucide React
- **Validación:** Zod
- **Base de datos:** Supabase (PostgreSQL + Auth + Storage)
- **DI:** Contenedor manual TypeScript (`container.ts`)
- **Paquete:** pnpm
- **Scaffolding:** Plop.js (CLI generador)

## Entidades del dominio (10)

| Entidad        | Atributos clave                                 |
|----------------|--------------------------------------------------|
| `Ciudad`       | id, nombre, codigoRegion                         |
| `Usuario`      | id, nombre, email, contraseniaHash               |
| `Organizador`  | extends Usuario: nitORut, telefonoContacto, sitioWeb |
| `Evento`       | titulo, objetivo, publicoObjetivo, descripcionItinerario, fechaInicio, fechaFin, lugarDireccion, costoEntrada, esGratuito, urlTicketeraExterna, observaciones |
| `Actividad`    | nombre, descripcion, horaInicio, horaFin         |
| `Interes`      | nombre, descripcion                              |
| `Media`        | urlArchivo, tipo (TipoMedia: IMAGEN, VIDEO_EMBEDDED) |
| `Participante` | nombre, rolOPerfil                               |
| `Patrocinador` | nombreEmpresa, urlLogo, nivelPatrocinio          |
| `Alianza`      | nombreInstitucion, tipoConvenio                  |

## Puertos de salida (repositorios — `src/domain/ports/`)

- `IEventoRepository` — métodos: obtenerEventosDelDia, obtenerPorRangoFechas, obtenerPorIntereses, obtenerPorId, guardar, obtenerCiudades
- `ICiudadRepository` — CRUD de ciudades
- `IUsuarioRepository` — CRUD de usuarios/organizadores

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
- Instalar dependencias: `zod`, `@supabase/supabase-js`, `lucide-react`
- Crear `plopfile.js` con generadores de scaffolding
- Crear archivo `.env.local` con variables de Supabase

### Fase 1 — Capa de Dominio (`src/domain/`)

**Entidades** (clases puras TypeScript, 0% dependencias externas):
- `Ciudad`, `Evento`, `Actividad`, `Interes`, `Media`, `Participante`, `Patrocinador`, `Alianza`
- `Usuario` + `Organizador` (hereda de Usuario)
- Métodos de dominio: `esHoy()`, `estaActivo()` en Evento

**Puertos de salida:**
- `IEventoRepository`
- `ICiudadRepository`
- `IUsuarioRepository`

**Shared:**
- Tipo `Result<T, E>` para manejo de errores
- Tipos de error compartidos

### Fase 2 — Capa de Aplicación (`src/application/`)

**Puertos de entrada (inbound interfaces):**
- `IGetEventosDelDia` — `execute(ciudadId: string): Promise<EventoResponse[]>`
- `IFiltrarEventos` — `execute(params: FiltrarEventosRequest): Promise<EventoResponse[]>`
- `IGetEventoPorId` — `execute(id: string): Promise<EventoResponse | null>`
- `ICrearEvento` — `execute(request: CrearEventoRequest): Promise<EventoResponse>`
- `IRegistrarOrganizador` — `execute(request: RegistroRequest): Promise<void>`
- `IIniciarSesion` — `execute(request: LoginRequest): Promise<SessionResponse>`

**Casos de uso:**
- `GetEventosDelDia` (HU01)
- `FiltrarEventos` (HU02+HU03 unificado — filtra por fechas e intereses)
- `GetEventoPorId` (HU04)
- `RegistrarOrganizador` (HU05)
- `IniciarSesion` (HU05)
- `CrearEvento` (HU06)

**DTOs (con validación Zod):**
- `EventoRequest`, `EventoResponse`
- `FiltrarEventosRequest` (rango fechas + intereses + ciudad)
- `CrearEventoRequest`, `RegistroRequest`, `LoginRequest`
- `SessionResponse`

### Fase 3 — Capa de Infraestructura (`src/infrastructure/`)

**Adaptadores driven (repositorios Supabase):**
- `SupabaseEventoRepository` implementa `IEventoRepository`
- `SupabaseCiudadRepository` implementa `ICiudadRepository`
- `SupabaseUsuarioRepository` implementa `IUsuarioRepository`

**Contenedor DI:**
- `container.ts` — registra repositorios (singleton), casos de uso (transient), cliente Supabase

**Configuración:**
- Esquemas SQL (migraciones Supabase)
- `supabase/config.toml`

### Fase 4 — HU01: Eventos del día

- **API Route:** `GET /api/eventos/hoy` → invoca `GetEventosDelDia`
- **UI:** Página principal con lista de eventos del día + selector de ciudad al primer ingreso
- **Componentes:** `EventoCard`, `CitySelector`, `EventoGrid`

### Fase 5 — HU02 + HU03: Búsqueda por fechas y filtro por intereses

- **API Route:** `GET /api/eventos?fechaInicio=&fechaFin=&intereses=` → invoca `FiltrarEventos`
- **UI:** Calendario/DatePicker + chips de intereses en una misma vista
- **Componentes:** `DateRangePicker`, `InterestFilter`, `EventoList`

### Fase 6 — HU04: Vista detalle del evento

- **API Route:** `GET /api/eventos/[id]` → invoca `GetEventoPorId`
- **UI:** Página `/eventos/[id]` con info completa, actividades, media, mapa, botón de compra/entrada libre
- **Componentes:** `EventoDetail`, `ActividadList`, `ImageGallery`, `VideoEmbed`, `ParticipanteList`, `PatrocinadorList`

### Fase 7 — HU05: Autenticación de organizador

- **API Routes:** `POST /api/auth/registro`, `POST /api/auth/login`
- **UI:** Páginas `/registro` y `/login`
- Integración con Supabase Auth (email + password)
- **Componentes:** `AuthForm`, `Navbar` (con estado de sesión), `AuthGuard`

### Fase 8 — HU06: Creación de eventos

- **API Route:** `POST /api/eventos` → invoca `CrearEvento`
- **UI:** Página `/organizador/eventos/nuevo` con formulario paso a paso
- Validación con Zod en frontend y backend
- **Componentes:** `EventForm` (secciones para Actividades, Media, Participantes, Patrocinadores)

### Fase 9 — Integración, pruebas y despliegue

- Probar flujo completo: registro → login → crear evento → ver en listado público
- Página de listado de eventos del organizador (`/organizador/eventos`)
- Configurar despliegue en Render (build: `pnpm install && pnpm build`, start: `pnpm start`)
- Variables de entorno: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NODE_VERSION`
