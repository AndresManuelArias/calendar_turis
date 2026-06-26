# Agenda Lugar — MVP

Plataforma de descubrimiento y gestión de eventos con arquitectura hexagonal.

## Stack

Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui + Supabase + Zod

## Comandos

```bash
# Iniciar servidor de desarrollo
pnpm dev

# Compilar para producción
pnpm build

# Iniciar servidor de producción
pnpm start

# Linter
pnpm lint

# Supabase local (requiere Docker)
pnpm exec supabase start

# Detener Supabase local
pnpm exec supabase stop

# Generar scaffolding con Plop
pnpm generate entity nombre
pnpm generate usecase nombre
pnpm generate repository nombre
pnpm generate component nombre
pnpm generate page nombre
```

## Variables de entorno

Crear `.env.local` con:

```
NEXT_PUBLIC_SUPABASE_URL=<url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>
```

## Estructura

```
src/
├── domain/            # Entidades puras + puertos de repositorio
├── application/       # Casos de uso + DTOs + puertos de entrada
├── infrastructure/    # Adaptadores (Next.js, Supabase) + DI
├── shared/            # Tipos compartidos (Result, errores)
├── components/ui/     # Componentes shadcn/ui
└── app/               # Páginas Next.js (App Router)
```
