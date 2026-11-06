// Starts the server. Run it with: npm run dev --workspace @drawwatch/api

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createApp } from "./app.ts";
import { DrawRepository } from "./drawRepository.ts";

const here = dirname(fileURLToPath(import.meta.url));
const repository = DrawRepository.fromFile(resolve(here, "../data/draws.json"));

const port = Number(process.env.PORT ?? 3000);
const app = createApp(repository);

app.listen(port, () => {
  console.log(`DrawWatch API is listening on http://localhost:${port}`);
});
