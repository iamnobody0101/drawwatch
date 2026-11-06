import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { Draw } from "@drawwatch/shared";
import { DrawRepository } from "./drawRepository.ts";

function makeDraw(gameId: Draw["gameId"], date: string): Draw {
  return { id: `${gameId}-${date}`, gameId, date, numbers: [1, 2, 3, 4, 5, 6], bonus: 7 };
}

describe("DrawRepository", () => {
  const repo = new DrawRepository([
    makeDraw("lotto-649", "2026-01-01"),
    makeDraw("lotto-max", "2026-01-02"),
    makeDraw("lotto-649", "2026-01-03"),
  ]);

  it("list the newest draw first", () => {
    const dates = repo.findDraws({}).map((draw) => draw.date);
    expect(dates).toEqual(["2026-01-03", "2026-01-02", "2026-01-01"]);
  });

  it("filters by game", () => {
    const found = repo.findDraws({ gameId: "lotto-649" });
    expect(found).toHaveLength(2);
  });

  it("filters by date range", () => {
    const found = repo.findDraws({ from: "2026-01-02", to: "2026-01-02" });
    expect(found).toHaveLength(1);
    expect(found[0]?.gameId).toBe("lotto-max");
  });

  it("returns one page of results and the total", () => {
    const result = repo.listDraws({ page: 2, pageSize: 2 });
    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(3);
  });

  it("finds a game by id", () => {
    expect(repo.findGame("lotto-max")?.name).toBe("Lotto Max");
  });

  it("loads the real draws.json file", () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const real = DrawRepository.fromFile(resolve(here, "../data/draws.json"));
    expect(real.findDraws({}).length).toBeGreaterThan(1000);
  });
});
