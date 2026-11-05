// Run this file to make the sample data file: npm run generate --workspace @drawwatch/shared

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateDraws } from "../src/generate.ts";

const SEED = 2026;
const START_DATA = "2021-11-01";
const END_DATA = "2026-10-31";

const here = dirname(fileURLToPath(import.meta.url));
const outFile = resolve(here, "../../../apps/api/data/draws.json");

const draws = generateDraws(SEED, START_DATA, END_DATA);

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(draws, null, 2) + "\n");

console.log(`Wrote ${draws.length} draws to ${outFile}`);