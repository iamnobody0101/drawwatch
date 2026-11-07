import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Draw } from "@drawwatch/shared";
import { ALLOWED_ORIGINS, createApp } from "./app.ts";
import { DrawRepository } from "./drawRepository.ts";

function makeDraw(gameId: Draw["gameId"], date: string, numbers: number[]): Draw {
  return { id: `${gameId}-${date}`, gameId, date, numbers, bonus: 9 };
}

const draws = [
  makeDraw("lotto-649", "2026-01-01", [1, 2, 3, 4, 5, 6]),
  makeDraw("lotto-649", "2026-01-02", [1, 2, 3, 7, 8, 9]),
  makeDraw("lotto-max", "2026-01-03", [10, 11, 12, 13, 14, 15, 16]),
];

let server: Server;
let baseUrl = "";

beforeAll(async () => {
  const app = createApp(new DrawRepository(draws));
  server = await new Promise<Server>((resolve) => {
    const started = app.listen(0, () => resolve(started));
  });
  const { port } = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${port}/api/v1`;
});

afterAll(async () => {
  await new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
});

async function get<T>(path: string) {
  const response = await fetch(baseUrl + path);
  const body = (await response.json()) as T;
  return { status: response.status, contentType: response.headers.get("content-type"), body };
}

describe("GET /health", () => {
  it("says the API is ok", async () => {
    const { status, body } = await get<{ status: string }>("/health");
    expect(status).toBe(200);
    expect(body.status).toBe("ok");
  });
});

describe("GET /games", () => {
  it("lists the three games", async () => {
    const { body } = await get<{ items: unknown[] }>("/games");
    expect(body.items).toHaveLength(3);
  });
});

describe("GET /draws", () => {
  it("returns draws with the newest first", async () => {
    const { body } = await get<{ items: Draw[]; total: number }>("/draws");
    expect(body.total).toBe(3);
    expect(body.items[0]?.date).toBe("2026-01-03");
  });

  it("filters by game", async () => {
    const { body } = await get<{ total: number }>("/draws?gameId=lotto-649");
    expect(body.total).toBe(2);
  });

  it("answers 400 for a bad page number", async () => {
    const { status, contentType, body } = await get<{ errors: { field: string }[] }>(
      "/draws?page=0",
    );
    expect(status).toBe(400);
    expect(contentType).toContain("application/problem+json");
    expect(body.errors[0]?.field).toBe("page");
  });
});

describe("GET /draws/:id", () => {
  it("returns one draw", async () => {
    const { status, body } = await get<Draw>("/draws/lotto-max-2026-01-03");
    expect(status).toBe(200);
    expect(body.gameId).toBe("lotto-max");
    expect(body.numbers).toEqual([10, 11, 12, 13, 14, 15, 16]);
  });

  it("answers 404 when the draw does not exist", async () => {
    const { status, contentType, body } = await get<{ title: string }>("/draws/nope");
    expect(status).toBe(404);
    expect(contentType).toContain("application/problem+json");
    expect(body.title).toBe("Draw not found");
  });
});

describe("GET /stats/frequency", () => {
  it("counts how often each number was drawn", async () => {
    const { body } = await get<{
      totalDraws: number;
      counts: { number: number; count: number }[];
      hot: { number: number; count: number }[];
    }>("/stats/frequency?gameId=lotto-649");
    expect(body.totalDraws).toBe(2);
    expect(body.counts).toHaveLength(49);
    expect(body.hot[0]).toEqual({ number: 1, count: 2 });
  });

  it("answers 400 when gameId is missing", async () => {
    const { status } = await get("/stats/frequency");
    expect(status).toBe(400);
  });
});

describe("unknown address", () => {
  it("answers 404", async () => {
    const { status } = await get("/nothing");
    expect(status).toBe(404);
  });
});

describe("CORS", () => {
  it.each(ALLOWED_ORIGINS)("lets %s read the API", async (origin) => {
    const response = await fetch(`${baseUrl}/health`, { headers: { Origin: origin } });
    expect(response.headers.get("access-control-allow-origin")).toBe(origin);
  });

  it("does not let other websites read the API", async () => {
    const response = await fetch(`${baseUrl}/health`, {
      headers: { Origin: "https://example.com" },
    });
    expect(response.headers.get("access-control-allow-origin")).toBeNull();
  });
});
