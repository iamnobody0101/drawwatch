import type { FrequencyResult } from "@drawwatch/shared";
import { describe, expect, it } from "vitest";
import { buildChartItems, buildSummary, formatTimes } from "./stats.ts";

const result: FrequencyResult = {
  totalDraws: 36,
  counts: [
    { number: 1, count: 12 },
    { number: 2, count: 7 },
    { number: 3, count: 1 },
    { number: 4, count: 9 },
    { number: 5, count: 5 },
  ],
  hot: [
    { number: 1, count: 12 },
    { number: 4, count: 9 },
  ],
  cold: [
    { number: 3, count: 1 },
    { number: 5, count: 5 },
  ],
};

describe("buildChartItems", () => {
  it("makes one bar for every number, in order", () => {
    expect(buildChartItems(result).map((item) => item.label)).toEqual(["1", "2", "3", "4", "5"]);
    expect(buildChartItems(result).map((item) => item.value)).toEqual([12, 7, 1, 9, 5]);
  });

  it("marks the hot and cold numbers", () => {
    expect(buildChartItems(result).map((item) => item.group)).toEqual([
      "hot",
      undefined,
      "cold",
      "hot",
      "cold",
    ]);
  });

  it("calls a number hot when it is in both lists", () => {
    const both = { ...result, hot: [{ number: 3, count: 1 }] };
    expect(buildChartItems(both)[2]?.group).toBe("hot");
  });
});

describe("formatTimes", () => {
  it("uses the singular for 1", () => {
    expect(formatTimes(1)).toBe("1 time");
    expect(formatTimes(0)).toBe("0 times");
    expect(formatTimes(12)).toBe("12 times");
  });
});

describe("buildSummary", () => {
  it("says how many draws, and the most and least drawn numbers", () => {
    expect(buildSummary(result)).toBe(
      "Based on 36 draws. Most drawn: 1 (12 times). Least drawn: 3 (1 time).",
    );
  });

  it("gives an empty text when there are no lists", () => {
    expect(buildSummary({ ...result, hot: [], cold: [] })).toBe("");
  });
});
