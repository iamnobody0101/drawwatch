import { describe, expect, it } from "vitest";
import { parseGameId, parsePage } from "./filters.ts";

describe("pargesGameId", () => {
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

  it("false back to page 1 for anything else", () => {
    expect(parsePage(null)).toBe(1);
    expect(parsePage("")).toBe(1);
    expect(parsePage("0")).toBe(1);
    expect(parsePage("-3")).toBe(1);
    expect(parsePage("2.5")).toBe(1);
    expect(parsePage("banana")).toBe(1);
  });
});
