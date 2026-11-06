// Shared types: the web app and the API both use these.

export type GameId = "lotto-649" | "lotto-max" | "daily-grand";

export interface Game {
  id: GameId;
  name: string;
  pickCount: number; // how many main numbers are drawn
  maxNumber: number; // main numbers go from 1 tot maxNumber
  bonusMax: number; // the extra number goes from 1 to bonusMax
}

export interface Draw {
  id: string;
  gameId: GameId;
  date: string; // ISO date, for example "2026-01-07"
  numbers: number[]; // sorted, no repeats
  bonus: number;
}

export const GAMES: Game[] = [
  { id: "lotto-649", name: "Lotto 6/49", pickCount: 6, maxNumber: 49, bonusMax: 49 },
  { id: "lotto-max", name: "Lotto Max", pickCount: 7, maxNumber: 50, bonusMax: 50 },
  { id: "daily-grand", name: "Daily Grand", pickCount: 5, maxNumber: 49, bonusMax: 7 },
];

export * from "./schemas.ts";
export * from "./frequency.ts";
