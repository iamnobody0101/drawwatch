// Builds the Express app. It does not start the server, so tests can use it.

import cors from "cors";
import express from "express";
import helmet from "helmet";
import type { Express } from "express";
import { calculateFrequency, drawFiltersSchema, frequencyQuerySchema } from "@drawwatch/shared";
import type { DrawRepository } from "./drawRepository.ts";
import { sendProblem, sendValidationProblem } from "./problem.ts";

// Only these websites may read the API from a browser: the live site and local development.
export const ALLOWED_ORIGINS = ["https://drawwatch.vercel.app", "http://localhost:5173"];

export function createApp(repository: DrawRepository): Express {
  const app = express();
  // helmet adds safe security headers and removes "X-Powered-By: Express".
  // The data is public, so other websites may read it (cross-origin); cors() below decides who.
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(cors({ origin: ALLOWED_ORIGINS, methods: ["GET"] }));
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

  api.get("/draws/:id", (req, res) => {
    const draw = repository.findDraw(req.params.id);
    if (!draw) {
      sendProblem(res, 404, "Draw not found");
      return;
    }
    res.json(draw);
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
