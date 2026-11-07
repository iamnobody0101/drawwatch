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
