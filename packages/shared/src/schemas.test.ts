import { describe, expect, it } from "vitest";
import { drawFiltersSchema, drawSchema, frequencyQuerySchema } from "./schemas.ts";

describe("drawSchema", () => {
  it("accepts a good draw", () => {
    const draw = {
      id: "lotto-649-2026-01-07",
      gameId: "lotto-649",
      date: "2026-01-07",
      numbers: [1, 2, 3, 4, 5, 6],
      bonus: 7,
    };
    expect(drawSchema.safeParse(draw).success).toBe(true);
  });

  it("rejects an unknown game", () => {
    const draw = { id: "x", gameId: "poker", date: "2026-01-07", numbers: [1], bonus: 2 };
    expect(drawSchema.safeParse(draw).success).toBe(false);
  });

  it("rejects a date that does not exist", () => {
    const draw = { id: "x", gameId: "lotto-649", date: "2026-13-45", numbers: [1], bonus: 2 };
    expect(drawSchema.safeParse(draw).success).toBe(false);
  });
});

describe("drawFiltersSchema", () => {
  it("use default values when nothing is given", () => {
    const result = drawFiltersSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
  });

  it("rejects a page size that is too big", () => {
    expect(drawFiltersSchema.safeParse({ pageSize: "1000" }).success).toBe(false);
  });

  it("turns text numbers from the URL into real numbers", () => {
    const result = drawFiltersSchema.parse({ page: "3", pageSize: "50" });
    expect(result.page).toBe(3);
    expect(result.pageSize).toBe(50);
  });

  it("rejects page 0", () => {
    expect(drawFiltersSchema.safeParse({ page: "0" }).success).toBe(false);
  });
});

describe("frequencyQuerySchema", () => {
  it("needs a gameId", () => {
    expect(frequencyQuerySchema.safeParse({}).success).toBe(false);
    expect(frequencyQuerySchema.safeParse({ gameId: "lotto-max" }).success).toBe(true);
  });
});
