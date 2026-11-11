import { frequencyResultSchema } from "@drawwatch/shared";
import type { Draw, FrequencyQuery, FrequencyResult, Game, GameId } from "@drawwatch/shared";

const API_URL: string = import.meta.env.VITE_API_URL ?? "https://drawwatch-api.onrender.com";

export type DrawPage = {
  items: Draw[];
  total: number;
  page: number;
  pageSize: number;
};

export type DrawQuery = {
  gameId?: GameId;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
};

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function getJson<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  signal?: AbortSignal,
): Promise<T> {
  const url = new URL(`/api/v1${path}`, API_URL);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new ApiError(response.status, `Request failed with status ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function fetchGames(signal?: AbortSignal): Promise<Game[]> {
  const body = await getJson<{ items: Game[] }>("/games", {}, signal);
  return body.items;
}

export function fetchDraws(query: DrawQuery = {}, signal?: AbortSignal): Promise<DrawPage> {
  return getJson<DrawPage>("/draws", query, signal);
}

export function fetchDraw(id: string, signal?: AbortSignal): Promise<Draw> {
  return getJson<Draw>(`/draws/${encodeURIComponent(id)}`, {}, signal);
}

export async function fetchFrequency(
  query: FrequencyQuery,
  signal?: AbortSignal,
): Promise<FrequencyResult> {
  const body = await getJson<unknown>("/stats/frequency", query, signal);
  const result = frequencyResultSchema.safeParse(body);
  if (!result.success) {
    throw new Error("The server sent frequency data in a shape we do not know.");
  }
  return result.data;
}

export function fetchHealth(signal?: AbortSignal): Promise<{ status: string }> {
  return getJson<{ status: string }>("/health", {}, signal);
}
