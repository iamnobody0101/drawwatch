// Build the Express app. It does not start the server, so tests can use it

import express from "express";
import type { Express } from "express";

export function createApp(): Express {
  const app = express();
  const api = express.Router();

  api.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/v1", api);

  app.use((_req, res) => {
    res.status(404).type("application/problem+json").json({
      type: "about:blank",
      title: "Not Found",
      status: 404,
    });
  });

  return app;
}
