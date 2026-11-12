import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import type { ReactNode } from "react";
import type { GameId } from "@drawwatch/shared";
import { describe, expect, it } from "vitest";
import { server } from "../test/server.ts";
import { useFrequency } from "./queries.ts";

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe("useFrequency", () => {
  it("is pending at first, then gives the frequency of the game", async () => {
    const { result } = renderHook(() => useFrequency({ gameId: "lotto-649" }), {
      wrapper: createWrapper(),
    });
    expect(result.current.isPending).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.totalDraws).toBe(3);
  });

  it("does not show the old game while the new game loads", async () => {
    const { result, rerender } = renderHook(({ gameId }) => useFrequency({ gameId }), {
      wrapper: createWrapper(),
      initialProps: { gameId: "lotto-649" as GameId },
    });
    await waitFor(() => expect(result.current.data?.totalDraws).toBe(3));

    rerender({ gameId: "lotto-max" });
    expect(result.current.data).toBeUndefined();

    await waitFor(() => expect(result.current.data?.totalDraws).toBe(2));
  });

  it("reports an error when the server fails", async () => {
    server.use(http.get("*/api/v1/stats/frequency", () => HttpResponse.json({}, { status: 500 })));

    const { result } = renderHook(() => useFrequency({ gameId: "lotto-649" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("does not ask the server when it is switched off", async () => {
    let asked = false;
    server.use(
      http.get("*/api/v1/stats/frequency", () => {
        asked = true;
        return HttpResponse.json({}, { status: 500 });
      }),
    );

    const { result } = renderHook(() => useFrequency({ gameId: "lotto-649" }, false), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(asked).toBe(false);
  });
});
