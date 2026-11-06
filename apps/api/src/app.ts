// Builds the Express app. It does not start the server, so tests can use it.

import express from "express";
import type { Express } from "express";
import { drawFiltersSchema } from "@drawwatch/shared";
import type { DrawRepository } from "./drawRepository.ts";
import { sendProblem } from "./problem.ts";

export function createApp(repository: DrawRepository): Express {
  const app = express();
  const api = express.Router();

  api.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  api.get("/games", (_req, res) => {
    res.json({ items: repository.listGames() });
  });

  api.get("/draws", (req, res) => {
    const parsed = drawFiltersSchema.safeParse(req.query);
    if (!parsed.success) {
      sendProblem(res, 400, "Invalid query parameters", {
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }
    res.json(repository.listDraws(parsed.data));
  });

  app.use("/api/v1", api);

  app.use((_req, res) => {
    sendProblem(res, 404, "Not Found");
  });

  return app;
}
