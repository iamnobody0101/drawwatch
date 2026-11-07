import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter, useLocation } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { server } from "../test/server.ts";
import { ResultsPage } from "./ResultsPage.tsx";

function ShowSearch() {
  return <p data-testid="search">{useLocation().search}</p>;
}

function renderPage(url = "/") {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[url]}>
        <ResultsPage />
        <ShowSearch />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});

describe("ResultsPage", () => {
  it("shows a loading message, then the first page of draws", async () => {
    renderPage();
    expect(screen.getByRole("status")).toHaveTextContent("Loading draws...");

    const cards = await screen.findAllByRole("article");
    expect(cards).toHaveLength(2);
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
  });

  it("shows the game name on each card", async () => {
    renderPage();
    expect(
      await screen.findByRole("heading", { name: "Lotto 6/49", level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Lotto Max", level: 2 })).toBeInTheDocument();
  });

  it("filters by the game in the address", async () => {
    renderPage("/?gameId=lotto-max");

    const cards = await screen.findAllByRole("article");
    expect(cards).toHaveLength(2);
    for (const card of cards) {
      expect(card).toHaveTextContent("Lotto Max");
    }
    await waitFor(() =>
      expect(screen.getByRole("combobox", { name: "Game" })).toHaveValue("lotto-max"),
    );
  });

  it("puts the chosen game in the address and goes back to page 1", async () => {
    const user = userEvent.setup();
    renderPage("/?page=2");
    await screen.findAllByRole("article");

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Game" }),
      await screen.findByRole("option", { name: "Lotto Max" }),
    );

    await waitFor(() =>
      expect(screen.getByTestId("search")).toHaveTextContent("?gameId=lotto-max"),
    );
    expect(screen.getByTestId("search")).not.toHaveTextContent("page");
  });

  it("moves between pages with Next and Previous", async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findAllByRole("article");
    expect(screen.getByRole("button", { name: "Previous" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(await screen.findByText("Page 2 of 3")).toBeInTheDocument();
    expect(screen.getByTestId("search")).toHaveTextContent("?page=2");
    expect(window.scrollTo).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Previous" }));
    expect(await screen.findByText("Page 1 of 3")).toBeInTheDocument();
  });

  it("ignores wrong values in the address", async () => {
    renderPage("/?gameId=banana&page=banana");
    expect(await screen.findAllByRole("article")).toHaveLength(2);
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
  });

  it("shows the empty state when no draws match", async () => {
    server.use(
      http.get("*/api/v1/draws", () =>
        HttpResponse.json({ items: [], total: 0, page: 1, pageSize: 2 }),
      ),
    );
    renderPage();
    expect(await screen.findByText("No draws found")).toBeInTheDocument();
  });

  it("shows a clear message when the page number is too high, and goes back to page 1", async () => {
    const user = userEvent.setup();
    renderPage("/?page=999");
    expect(await screen.findByText("This page does not exist.")).toBeInTheDocument();
    expect(screen.queryByText("No draws found")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Go to page 1" }));
    expect(await screen.findAllByRole("article")).toHaveLength(2);
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
  });

  it("shows an error with a Try again button that loads the draws", async () => {
    const user = userEvent.setup();
    server.use(
      http.get("*/api/v1/draws", () => HttpResponse.json({ title: "Broken" }, { status: 500 }), {
        once: true,
      }),
    );
    renderPage();

    expect(await screen.findByRole("alert")).toHaveTextContent("could not be loaded");
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findAllByRole("article")).toHaveLength(2);
  });
});
