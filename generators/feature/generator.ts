import { NodePlopAPI } from "plop";

export default function (plop: NodePlopAPI) {

    plop.setGenerator("feature", {

        description: "Genera una feature completa siguiendo Arquitectura Hexagonal",

        prompts: [
            {
                type: "input",
                name: "name",
                message: "Nombre de la feature (ej: Evento)"
            }
        ],

        actions: [

            // ======================
            // DOMAIN
            // ======================

            {
                type: "add",
                path: "src/domain/entities/{{pascalCase name}}.ts",
                templateFile: "generators/feature/templates/entity.hbs"
            },

            {
                type: "add",
                path: "src/domain/ports/outbound/I{{pascalCase name}}Repository.ts",
                templateFile: "generators/feature/templates/repository.hbs"
            },

            // ======================
            // APPLICATION
            // ======================

            {
                type: "add",
                path: "src/application/ports/inbound/IGet{{pascalCase name}}.ts",
                templateFile: "generators/feature/templates/inbound-port.hbs"
            },

            {
                type: "add",
                path: "src/application/usecases/Get{{pascalCase name}}.ts",
                templateFile: "generators/feature/templates/usecase.hbs"
            },

            {
                type: "add",
                path: "src/application/dto/{{pascalCase name}}Request.ts",
                templateFile: "generators/feature/templates/request.hbs"
            },

            {
                type: "add",
                path: "src/application/dto/{{pascalCase name}}Response.ts",
                templateFile: "generators/feature/templates/response.hbs"
            },

            // ======================
            // INFRASTRUCTURE
            // ======================

            {
                type: "add",
                path: "src/infrastructure/driven/supabase/{{pascalCase name}}Repository.ts",
                templateFile: "generators/feature/templates/supabase-repository.hbs"
            }

        ]

    });

}