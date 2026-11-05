import { describe, expect, it } from "vitest";
import { createRng, randomInt } from "./random.ts";

describe("createRng", () => {
    it("gives the same numbers for the same seed", () => {
        const a = createRng(123);
        const b = createRng(123);
        expect([a(), a(), a()]).toEqual([b(), b(), b()]);
    });

    it("gives different numbers for different seeds", () => {
        expect(createRng(1)()).not.toBe(createRng(2)());
    });

    it("gives numbers from 0 up to, but not including, 1", () => {
        const rng = createRng(7);
        for (let i = 0; i < 1000; i++) {
            const value = rng();
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThan(1);
        }
    });
});

describe("randomInt", () => {
    it("stays inside the range and reaches both ends", () => {
        const rng = createRng(5);
        const seen = new Set<number>();
        for (let i = 0; i < 500; i++) {
            seen.add(randomInt(rng, 1, 3));
        }
        expect([...seen].sort((a, b) => a - b)).toEqual([1, 2, 3]);
    });
});