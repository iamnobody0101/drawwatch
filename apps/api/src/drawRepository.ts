// The only place that knows where draws are stored.
// Today: a JSON file loaded into memory. Later it could be a database

import { readFileSync } from "node:fs";
import { drawSchema, GAMES } from "@drawwatch/shared";
import type { Draw, DrawFilters, Game, GameId } from "@drawwatch/shared";

export interface DrawPage {
  items: Draw[];
  total: number; // how many draws match, over all page
  page: number;
  pageSize: number;
}

export class DrawRepository {
  private readonly draws: Draw[];

  constructor(draws: Draw[]) {
    // Newest draw first. Same date: sort by id so the order never changes.
    this.draws = [...draws].sort(
      (a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id),
    );
  }

  static fromFile(path: string): DrawRepository {
    const raw: unknown = JSON.parse(readFileSync(path, "utf8"));
    return new DrawRepository(drawSchema.array().parse(raw));
  }

  listGames(): Game[] {
    return GAMES;
  }

  findGame(id: GameId): Game | undefined {
    return GAMES.find((game) => game.id === id);
  }

  findDraw(id: string): Draw | undefined {
    return this.draws.find((draw) => draw.id === id);
  }

  findDraws(filters: Pick<DrawFilters, "gameId" | "from" | "to">): Draw[] {
    return this.draws.filter(
      (draw) =>
        (filters.gameId === undefined || draw.gameId === filters.gameId) &&
        (filters.from === undefined || draw.date >= filters.from) &&
        (filters.to === undefined || draw.date <= filters.to),
    );
  }

  listDraws(filters: DrawFilters): DrawPage {
    const matches = this.findDraws(filters);
    const start = (filters.page - 1) * filters.pageSize;
    return {
      items: matches.slice(start, start + filters.pageSize),
      total: matches.length,
      page: filters.page,
      pageSize: filters.pageSize,
    };
  }
}
