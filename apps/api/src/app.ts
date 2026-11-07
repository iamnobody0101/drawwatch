// Builds the Express app. It does not start the server, so tests can use it.

import cors from "cors";
import express from "express";
import type { Express } from "express";
import { calculateFrequency, drawFiltersSchema, frequencyQuerySchema } from "@drawwatch/shared";
import type { DrawRepository } from "./drawRepository.ts";
import { sendProblem, sendValidationProblem } from "./problem.ts";

export function createApp(repository: DrawRepository): Express {
  const app = express();
  app.use(cors({ methods: ["GET"] }));
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
      sendValidationProblem(res, parsed.error.issues);
      return;
    }
    res.json(repository.listDraws(parsed.data));
  });

  api.get("/stats/frequency", (req, res) => {
    const parsed = frequencyQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      sendValidationProblem(res, parsed.error.issues);
      return;
    }

    const { gameId, from, to } = parsed.data;
    const game = repository.findGame(gameId);
    if (!game) {
      sendProblem(res, 404, "Game not found");
      return;
    }

    const draws = repository.findDraws({ gameId, from, to });
    res.json({ gameId, from, to, ...calculateFrequency(draws, game.maxNumber) });
  });

  app.use("/api/v1", api);

  app.use((_req, res) => {
    sendProblem(res, 404, "Not Found");
  });

  return app;
}
