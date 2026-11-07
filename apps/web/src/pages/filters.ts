import type { GameId } from "@drawwatch/shared";

// Every game id the API knows. TypeScript reports an error here if a game id is missing.
const GAME_IDS: Record<GameId, true> = {
  "lotto-649": true,
  "lotto-max": true,
  "daily-grand": true,
};

// Turns text from the address bar into a game id, or undefined if it is not one.
export function parseGameId(value: string | null): GameId | undefined {
  if (value !== null && Object.hasOwn(GAME_IDS, value)) {
    return value as GameId;
  }
  return undefined;
}

// Turns text from the address bar into a page number. Anything that is not a whole number of 1 or more becomes 1.
export function parsePage(value: string | null): number {
  const page = Number(value);
  return Number.isSafeInteger(page) && page >= 1 ? page : 1;
}
