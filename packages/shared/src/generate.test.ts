import { describe, expect, it } from "vitest";
import { generateDraws } from "./generate.ts";
import { GAMES } from "./index.ts";

describe("generateDraws", () => {
    const draws = generateDraws(2026, "2026-01-01", "2026-01-31");

    it("gives the same draws for the same seed", () => {
        expect(generateDraws(2026, "2026-01-01", "2026-01-31")).toEqual(draws);
    });

    it("gives different draws from different seed", () => {
        expect(generateDraws(1, "2026-01-01", "2026-01-31")).not.toEqual(draws);
    });

    it("makes 9 draws for each game in January 2026", () => {
        for (const game of GAMES) {
            expect(draws.filter((draw) => draw.gameId === game.id)).toHaveLength(9);
        }
    });

    it("lists the newest draws first", () => {
        const dates = draws.map((draw) => draw.date);
        expect(dates).toEqual([...dates].sort().reverse());
    });

    it("follows the rules of every game", () => {
        for (const draw of draws) {
            const game = GAMES.find((g) => g.id === draw.gameId);
            expect(game).toBeDefined();
            if (!game) continue;
            expect(draw.numbers).toHaveLength(game.pickCount);
            expect(new Set(draw.numbers).size).toBe(game.pickCount);
            expect(draw.numbers).toEqual([...draw.numbers].sort((a, b) => a - b));
            for (const n of draw.numbers) {
                expect(n).toBeGreaterThanOrEqual(1);
                expect(n).toBeLessThanOrEqual(game.maxNumber);
            }
            expect(draw.bonus).toBeGreaterThanOrEqual(1);
            expect(draw.bonus).toBeLessThanOrEqual(game.bonusMax);
            if (game.id !== "daily-grand") {
                expect(draw.numbers).not.toContain(draw.bonus);
            }
        }
    });
});