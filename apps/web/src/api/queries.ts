import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ApiError, fetchDraw, fetchDraws, fetchGames, fetchHealth } from "./client.ts";
import type { DrawQuery } from "./client.ts";

export function useGames() {
  return useQuery({
    queryKey: ["games"],
    queryFn: ({ signal }) => fetchGames(signal),
    staleTime: Infinity,
  });
}

export function useDraws(query: DrawQuery) {
  return useQuery({
    queryKey: ["draws", query],
    queryFn: ({ signal }) => fetchDraws(query, signal),
    placeholderData: keepPreviousData,
  });
}

export function useDraw(id: string) {
  return useQuery({
    queryKey: ["draw", id],
    queryFn: ({ signal }) => fetchDraw(id, signal),
    // A 404 means "this draw does not exist". Asking again will not help.
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.status === 404) && failureCount < 3,
  });
}

export function useServerHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: ({ signal }) => fetchHealth(signal),
    retry: 5,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
    staleTime: 5 * 60 * 1000,
  });
}
