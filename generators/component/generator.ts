import { NodePlopAPI } from "plop";

export default function(plop: NodePlopAPI){

    plop.setGenerator("component",{

        description:"Genera un componente React",

        prompts:[
            {
                type:"input",
                name:"name",
                message:"Nombre del componente"
            }
        ],

        actions:[
            {
                type:"add",
                path:"src/components/{{pascalCase name}}/{{pascalCase name}}.tsx",
                templateFile:"generators/component/templates/component.hbs"
            }
        ]

    });

}