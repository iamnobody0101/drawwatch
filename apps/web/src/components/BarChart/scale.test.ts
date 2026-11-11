import { describe, expect, it } from "vitest";
import { barLength, niceMax, ticks } from "./scale.ts";

describe("niceMax", () => {
  it.each([
    [83, 100],
    [100, 100],
    [101, 200],
    [21, 50],
    [51, 100],
    [20, 20],
    [7, 10],
    [1000, 1000],
  ])("rounds %i up to %i", (value, expected) => {
    expect(niceMax(value)).toBe(expected);
  });

  it.each([[0], [-3], [1], [2], [5]])("gives 5 for the small value %i", (value) => {
    expect(niceMax(value)).toBe(5);
  });
});

describe("barLength", () => {
  it("is in proportion to the count", () => {
    expect(barLength(83, 100, 400)).toBe(332);
  });

  it("fills the whole width for the top value", () => {
    expect(barLength(100, 100, 400)).toBe(400);
  });

  it("gives no bar for a count of 0", () => {
    expect(barLength(0, 100, 400)).toBe(0);
  });

  it("gives no bar when the top value is 0", () => {
    expect(barLength(5, 0, 400)).toBe(0);
  });
});

describe("ticks", () => {
  it("gives 6 equal steps from 0 to the top by default", () => {
    expect(ticks(100)).toEqual([0, 20, 40, 60, 80, 100]);
  });

  it("gives whole numbers for a top value of 5", () => {
    expect(ticks(5)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it("uses the number of steps you ask for", () => {
    expect(ticks(10, 2)).toEqual([0, 5, 10]);
  });
});
