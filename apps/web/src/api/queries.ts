import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchDraws, fetchGames, fetchHealth } from "./client.ts";
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

export function useServerHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: ({ signal }) => fetchHealth(signal),
    retry: 5,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
    staleTime: 5 * 60 * 1000,
  });
}
