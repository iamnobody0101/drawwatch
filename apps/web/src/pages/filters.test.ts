import { describe, expect, it } from "vitest";
import { isRangeBackwards, parseDate, parseGameId, parsePage } from "./filters.ts";

describe("parseGameId", () => {
  it("accepts a known game id", () => {
    expect(parseGameId("lotto-max")).toBe("lotto-max");
  });

  it("returns undefined for anything else", () => {
    expect(parseGameId(null)).toBeUndefined();
    expect(parseGameId("")).toBeUndefined();
    expect(parseGameId("banana")).toBeUndefined();
    expect(parseGameId("toString")).toBeUndefined();
  });
});

describe("parsePage", () => {
  it("accepts a whole number of 1 or more", () => {
    expect(parsePage("1")).toBe(1);
    expect(parsePage("12")).toBe(12);
  });

  it("falls back to page 1 for anything else", () => {
    expect(parsePage(null)).toBe(1);
    expect(parsePage("")).toBe(1);
    expect(parsePage("0")).toBe(1);
    expect(parsePage("-3")).toBe(1);
    expect(parsePage("2.5")).toBe(1);
    expect(parsePage("banana")).toBe(1);
  });
});

describe("parseDate", () => {
  it("accepts a real date", () => {
    expect(parseDate("2026-01-31")).toBe("2026-01-31");
    expect(parseDate("2024-02-29")).toBe("2024-02-29");
  });

  it("returns an empty text for anything else", () => {
    expect(parseDate(null)).toBe("");
    expect(parseDate("")).toBe("");
    expect(parseDate("banana")).toBe("");
    expect(parseDate("2026-1-5")).toBe("");
    expect(parseDate("2026-02-30")).toBe("");
    expect(parseDate("2025-02-29")).toBe("");
    expect(parseDate("2026-13-01")).toBe("");
  });
});

describe("isRangeBackwards", () => {
  it("is true only when From is after To", () => {
    expect(isRangeBackwards("2026-02-01", "2026-01-01")).toBe(true);
    expect(isRangeBackwards("2026-01-01", "2026-02-01")).toBe(false);
    expect(isRangeBackwards("2026-01-01", "2026-01-01")).toBe(false);
  });

  it("is false when a date is empty", () => {
    expect(isRangeBackwards("", "2026-01-01")).toBe(false);
    expect(isRangeBackwards("2026-01-01", "")).toBe(false);
    expect(isRangeBackwards("", "")).toBe(false);
  });
});
