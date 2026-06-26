import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);

spawnSync(
    "pnpm",
    ["plop", ...args],
    {
        stdio:"inherit"
    }
);