import { describe, expect, it } from "vitest";
import { calculateFrequency } from "./frequency.ts";
import type { Draw } from "./index.ts";

function makeDraw(id: string, numbers: number[], bonus = 9): Draw {
  return { id, gameId: "lotto-649", date: "2026-01-01", numbers, bonus };
}

describe("calculateFrequency", () => {
  const draws = [makeDraw("a", [1, 2, 3]), makeDraw("b", [2, 3, 4])];

  it("counts how often each number was drawn", () => {
    const result = calculateFrequency(draws, 5);
    expect(result.totalDraws).toBe(2);
    expect(result.counts).toEqual([
      { number: 1, count: 1 },
      { number: 2, count: 2 },
      { number: 3, count: 2 },
      { number: 4, count: 1 },
      { number: 5, count: 0 },
    ]);
  });

  it("ignores numbers bigger than maxNumber", () => {
    const result = calculateFrequency([makeDraw("a", [1, 99])], 3);
    expect(result.counts).toEqual([
      { number: 1, count: 1 },
      { number: 2, count: 0 },
      { number: 3, count: 0 },
    ]);
  });

  it("lists the most drawn numbers first, and the smaller number wins a tie", () => {
    const result = calculateFrequency(draws, 5, 2);
    expect(result.hot).toEqual([
      { number: 2, count: 2 },
      { number: 3, count: 2 },
    ]);
  });

  it("lists the least drawn numbers first", () => {
    const result = calculateFrequency(draws, 5, 2);
    expect(result.cold).toEqual([
      { number: 5, count: 0 },
      { number: 1, count: 1 },
    ]);
  });

  it("does not count the bonus number", () => {
    const result = calculateFrequency([makeDraw("a", [1], 2)], 3);
    expect(result.counts[1]?.count).toBe(0);
  });

  it("gives all zero counts when there are no draws", () => {
    const result = calculateFrequency([], 3);
    expect(result.totalDraws).toBe(0);
    expect(result.counts.every((entry) => entry.count === 0)).toBe(true);
  });
});
