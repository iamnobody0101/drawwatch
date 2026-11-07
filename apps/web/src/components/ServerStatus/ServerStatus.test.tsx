import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen } from "@testing-library/react";
import { delay, http } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { server } from "../../test/server.ts";
import { ServerStatus } from "./ServerStatus.tsx";

function renderStatus() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ServerStatus />
    </QueryClientProvider>,
  );
}

describe("ServerStatus", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("says nothing while the server answers quickly", async () => {
    renderStatus();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("explains that the server is waking up when it is slow", async () => {
    server.use(http.get("*/api/v1/health", () => delay("infinite")));
    renderStatus();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2999);
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });
    expect(screen.getByRole("status")).toHaveTextContent("Waking up the server...");
  });
});
