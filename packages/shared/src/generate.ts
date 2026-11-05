// Make sample draws for every game. The same seed always gives the same draws.

import { GAMES } from "./index.ts";
import type { Draw, Game, GameId } from "./index.ts";
import { createRng, randomInt } from "./random.ts";
import type { Rng } from "./random.ts";

// Days of the week when each game is drawn (0 = Sunday, 1 = Monday, ... 6 = Saturday).
const DRAW_DAYS: Record<GameId, number[]> = {
  "lotto-649": [3, 6],
  "lotto-max": [2, 5],
  "daily-grand": [1, 4],
};

// Pick `count` different numbers from 1 to `max`, sorted from small to big.
function pickNumbers(rng: Rng, count: number, max: number): number[] {
  const picked = new Set<number>();
  while (picked.size < count) {
    picked.add(randomInt(rng, 1, max));
  }
  return [...picked].sort((a, b) => a - b);
}

function makeDraw(rng: Rng, game: Game, date: string): Draw {
  const numbers = pickNumbers(rng, game.pickCount, game.maxNumber);
  let bonus = randomInt(rng, 1, game.bonusMax);
  // Lotto 6/49 and Lotto Max: the bonus is never one of the main numbers.
  while (game.id !== "daily-grand" && numbers.includes(bonus)) {
    bonus = randomInt(rng, 1, game.bonusMax);
  }
  return { id: `${game.id}-${date}`, gameId: game.id, date, numbers, bonus };
}

export function generateDraws(seed: number, startDate: string, endDate: string): Draw[] {
  const rng = createRng(seed);
  const draws: Draw[] = [];
  const last = new Date(`${endDate}T00:00:00Z`);

  for (const game of GAMES) {
    const day = new Date(`${startDate}T00:00:00Z`);
    while (day <= last) {
      if (DRAW_DAYS[game.id].includes(day.getUTCDay())) {
        draws.push(makeDraw(rng, game, day.toISOString().slice(0, 10)));
      }
      day.setUTCDate(day.getUTCDate() + 1);
    }
  }
  // Newest draws first.
  return draws.sort((a, b) => b.date.localeCompare(a.date) || a.gameId.localeCompare(b.gameId));
}
