// Starts the server. Run it with: npm run dev --workspace @drawwatch/api

import { createApp } from "./app.ts";

const port = Number(process.env.PORT ?? 3000);
const app = createApp();

app.listen(port, () => {
  console.log(`DrawWatch API is listening on http://localhost:${port}`);
});
