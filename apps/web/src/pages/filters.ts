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

// Turns text from the address bar into a date like "2026-01-31", or "" if it is not a real date.
export function parseDate(value: string | null): string {
  if (value === null || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return "";
  }
  // Date.UTC(2026, 1, 30) rolls over to March 2, so we build the date and read it back.
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return "";
  }
  return value;
}

// True when both dates are filled in and From is after To. Dates in this format sort like text.
export function isRangeBackwards(from: string, to: string): boolean {
  return from !== "" && to !== "" && from > to;
}
