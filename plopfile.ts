import type { NodePlopAPI } from "plop";

import component from "./generators/component/generator";
import feature from "./generators/feature/generator";

export default function (plop: NodePlopAPI) {

    component(plop);
    feature(plop);

}