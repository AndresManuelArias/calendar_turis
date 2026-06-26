import type { NodePlopAPI } from "plop";
import component from "./generators/component/generator.ts";

export default function (plop: NodePlopAPI) {
    component(plop);
}