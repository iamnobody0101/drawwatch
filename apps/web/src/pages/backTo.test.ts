import { describe, expect, it } from "vitest";
import { parseBackTo } from "./backTo.ts";

describe("parseBackTo", () => {
  it("returns the address from the state", () => {
    const address = "/?gameId=lotto-max&page=2";
    expect(parseBackTo({ backTo: address })).toBe(address);
  });

  it("goes to the Results page when there is no state", () => {
    expect(parseBackTo(null)).toBe("/");
    expect(parseBackTo(undefined)).toBe("/");
    expect(parseBackTo({})).toBe("/");
  });

  it("ignores values that are not a path on this site", () => {
    expect(parseBackTo({ backTo: 42 })).toBe("/");
    expect(parseBackTo({ backTo: "https://example.com" })).toBe("/");
    expect(parseBackTo({ backTo: "//example.com" })).toBe("/");
  });
});
