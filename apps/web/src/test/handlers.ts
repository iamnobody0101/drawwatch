import { http, HttpResponse } from "msw";
import type { Draw, Game } from "@drawwatch/shared";

export const games: Game[] = [
  { id: "lotto-649", name: "Lotto 6/49", pickCount: 6, maxNumber: 49, bonusMax: 49 },
  { id: "lotto-max", name: "Lotto Max", pickCount: 7, maxNumber: 50, bonusMax: 50 },
];

export const draws: Draw[] = [
  { id: "a", gameId: "lotto-649", date: "2026-01-05", numbers: [1, 2, 3, 4, 5, 6], bonus: 7 },
  { id: "b", gameId: "lotto-max", date: "2026-01-04", numbers: [1, 2, 3, 4, 5, 6, 7], bonus: 8 },
  { id: "c", gameId: "lotto-649", date: "2026-01-03", numbers: [7, 8, 9, 10, 11, 12], bonus: 13 },
  {
    id: "d",
    gameId: "lotto-max",
    date: "2026-01-02",
    numbers: [8, 9, 10, 11, 12, 13, 14],
    bonus: 15,
  },
  { id: "e", gameId: "lotto-649", date: "2026-01-01", numbers: [2, 4, 6, 8, 10, 12], bonus: 14 },
];

// The test server shows 2 draws per page, so a few draws are enough to test pagination.
const PAGE_SIZE = 2;

export const handlers = [
  http.get("*/api/v1/health", () => HttpResponse.json({ status: "ok" })),
  http.get("*/api/v1/games", () => HttpResponse.json({ items: games })),
  http.get("*/api/v1/draws", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const gameId = params.get("gameId");
    const page = Number(params.get("page") ?? "1");
    const matches = draws.filter((draw) => gameId === null || draw.gameId === gameId);
    const start = (page - 1) * PAGE_SIZE;
    return HttpResponse.json({
      items: matches.slice(start, start + PAGE_SIZE),
      total: matches.length,
      page,
      pageSize: PAGE_SIZE,
    });
  }),
  http.get("*/api/v1/draws/:id", ({ params }) => {
    const draw = draws.find((item) => item.id === params.id);
    if (!draw) {
      return HttpResponse.json({ title: "Draw not found", status: 404 }, { status: 404 });
    }
    return HttpResponse.json(draw);
  }),
];
