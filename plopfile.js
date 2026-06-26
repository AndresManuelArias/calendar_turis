/**
 * Plopfile.js — Generadores de scaffolding para Agenda Lugar
 *
 * Uso:
 *   pnpm generate <generator-name> [-- <args>]
 *   pnpm g <generator-name> [-- <args>]
 *
 * Generadores disponibles:
 *   entity     — Crea una entidad de dominio en src/domain/entities/
 *   usecase    — Crea un caso de uso en src/application/usecases/
 *   repository — Crea un repositorio Supabase en src/infrastructure/driven/supabase/
 *   component  — Crea un componente React en src/infrastructure/driving/next/components/
 *   page       — Crea una página Next.js en src/infrastructure/driving/next/app/
 */

export default function plopConfig(plop) {
  // Generador: entity
  plop.setGenerator("entity", {
    description: "Crea una nueva entidad de dominio",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Nombre de la entidad (ej: Evento, Lugar, Usuario):",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/domain/entities/{{pascalCase name}}.ts",
        templateFile: "plop-templates/entity.hbs",
      },
    ],
  });

  // Generador: usecase
  plop.setGenerator("usecase", {
    description: "Crea un nuevo caso de uso",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Nombre del caso de uso (ej: CrearEvento, ListarLugares):",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/application/usecases/{{pascalCase name}}.ts",
        templateFile: "plop-templates/usecase.hbs",
      },
    ],
  });

  // Generador: repository
  plop.setGenerator("repository", {
    description: "Crea un nuevo repositorio Supabase",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Nombre del repositorio (ej: Evento, Lugar, Usuario):",
      },
    ],
    actions: [
      {
        type: "add",
        path:
          "src/infrastructure/driven/supabase/Supabase{{pascalCase name}}Repository.ts",
        templateFile: "plop-templates/repository.hbs",
      },
    ],
  });

  // Generador: component
  plop.setGenerator("component", {
    description: "Crea un nuevo componente React",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Nombre del componente (ej: EventCard, LocationPicker):",
      },
    ],
    actions: [
      {
        type: "add",
        path:
          "src/infrastructure/driving/next/components/{{pascalCase name}}.tsx",
        templateFile: "plop-templates/component.hbs",
      },
    ],
  });

  // Generador: page
  plop.setGenerator("page", {
    description: "Crea una nueva página Next.js",
    prompts: [
      {
        type: "input",
        name: "name",
        message:
          "Nombre de la ruta (ej: eventos, lugares, dashboard/eventos):",
      },
      {
        type: "input",
        name: "title",
        message: "Título de la página:",
      },
    ],
    actions: [
      {
        type: "add",
        path: "src/infrastructure/driving/next/app/{{name}}/page.tsx",
        templateFile: "plop-templates/page.hbs",
      },
    ],
  });
}
