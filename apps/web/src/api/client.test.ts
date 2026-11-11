import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "../test/server.ts";
import { ApiError, fetchFrequency } from "./client.ts";

describe("fetchFrequency", () => {
  it("returns the counts, the hot numbers and the cold numbers of a game", async () => {
    const result = await fetchFrequency({ gameId: "lotto-649" });

    expect(result.totalDraws).toBe(3);
    expect(result.counts).toHaveLength(49);
    expect(result.counts[1]).toEqual({ number: 2, count: 2 });
    expect(result.hot[0]).toEqual({ number: 2, count: 2 });
    expect(result.cold[0]).toEqual({ number: 13, count: 0 });
  });

  it("sends the from date, so older draws are left out", async () => {
    const result = await fetchFrequency({ gameId: "lotto-649", from: "2026-01-03" });
    expect(result.totalDraws).toBe(2);
  });

  it("sends the to date, so newer draws are left out", async () => {
    const result = await fetchFrequency({ gameId: "lotto-649", to: "2026-01-03" });
    expect(result.totalDraws).toBe(2);
  });

  it("throws an ApiError when the server answers with an error", async () => {
    server.use(http.get("*/api/v1/stats/frequency", () => HttpResponse.json({}, { status: 500 })));

    await expect(fetchFrequency({ gameId: "lotto-649" })).rejects.toBeInstanceOf(ApiError);
  });

  it("throws when the data has a shape we do not know", async () => {
    server.use(
      http.get("*/api/v1/stats/frequency", () => HttpResponse.json({ totalDraws: "many" })),
    );

    await expect(fetchFrequency({ gameId: "lotto-649" })).rejects.toThrow("shape we do not know");
  });
});
