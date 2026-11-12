import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter, useLocation } from "react-router";
import { describe, expect, it } from "vitest";
import { server } from "../test/server.ts";
import { StatsPage } from "./StatsPage.tsx";

function ShowSearch() {
  return <p data-testid="search">{useLocation().search}</p>;
}

function renderPage(url = "/stats") {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[url]}>
        <StatsPage />
        <ShowSearch />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const chartHeading = (gameName: string) =>
  screen.findByRole("heading", { name: `${gameName}: how often each number was drawn`, level: 2 });

// The test server has 3 Lotto 6/49 draws: 1-6, 7-12 and 2, 4, 6, 8, 10, 12.
describe("StatsPage", () => {
  it("sets the page title", async () => {
    renderPage();
    await chartHeading("Lotto 6/49");
    await waitFor(() => expect(document.title).toBe("Stats | DrawWatch"));
  });

  it("shows a loading message, then the chart for Lotto 6/49", async () => {
    renderPage();
    expect(screen.getByRole("status")).toHaveTextContent("Loading statistics...");

    expect(await chartHeading("Lotto 6/49")).toBeInTheDocument();
    expect(
      screen.getByText("Based on 3 draws. Most drawn: 2 (2 times). Least drawn: 13 (0 times)."),
    ).toBeInTheDocument();
  });

  it("has no All games choice", async () => {
    renderPage();
    await chartHeading("Lotto 6/49");
    const options = screen.getAllByRole("option").map((option) => option.textContent);
    expect(options).toEqual(["Lotto 6/49", "Lotto Max"]);
  });

  it("lists the hot and the cold numbers with how often they were drawn", async () => {
    renderPage();
    await chartHeading("Lotto 6/49");

    const hot = screen.getByRole("region", { name: "Hot: drawn most often" });
    expect(
      within(hot)
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual(["22 times", "42 times", "62 times", "82 times", "102 times", "122 times"]);
    const cold = screen.getByRole("region", { name: "Cold: drawn least often" });
    expect(
      within(cold)
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual(["130 times", "140 times", "150 times", "160 times", "170 times", "180 times"]);
  });

  it("says that draws are independent", async () => {
    renderPage();
    await chartHeading("Lotto 6/49");
    expect(
      screen.getByText("Draws are independent. Past frequency does not predict future draws."),
    ).toBeInTheDocument();
  });

  it("uses the game in the address", async () => {
    renderPage("/stats?gameId=lotto-max");
    expect(await chartHeading("Lotto Max")).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole("combobox", { name: "Game" })).toHaveValue("lotto-max"),
    );
  });

  it("uses Lotto 6/49 when the game in the address is not a game", async () => {
    renderPage("/stats?gameId=banana");
    expect(await chartHeading("Lotto 6/49")).toBeInTheDocument();
  });

  it("puts the chosen game in the address", async () => {
    const user = userEvent.setup();
    renderPage();
    await chartHeading("Lotto 6/49");

    await user.selectOptions(screen.getByRole("combobox", { name: "Game" }), "Lotto Max");

    expect(await chartHeading("Lotto Max")).toBeInTheDocument();
    expect(screen.getByTestId("search")).toHaveTextContent("?gameId=lotto-max");
  });

  it("only counts the draws between the From and To dates", async () => {
    renderPage("/stats?from=2026-01-03&to=2026-01-05");
    expect(await screen.findByText(/^Based on 2 draws\./)).toBeInTheDocument();
    expect(screen.getByLabelText("From")).toHaveValue("2026-01-03");
    expect(screen.getByLabelText("To")).toHaveValue("2026-01-05");
  });

  it("puts a chosen date in the address, and removes it when it is cleared", async () => {
    renderPage("/stats");
    await chartHeading("Lotto 6/49");

    fireEvent.change(screen.getByLabelText("From"), { target: { value: "2026-01-03" } });
    await waitFor(() => expect(screen.getByTestId("search")).toHaveTextContent("?from=2026-01-03"));

    fireEvent.change(screen.getByLabelText("From"), { target: { value: "" } });
    await waitFor(() => expect(screen.getByTestId("search")).toBeEmptyDOMElement());
  });

  it("ignores a date in the address that is not a real date", async () => {
    renderPage("/stats?from=banana&to=2026-02-30");
    await chartHeading("Lotto 6/49");
    expect(screen.getByLabelText("From")).toHaveValue("");
    expect(screen.getByLabelText("To")).toHaveValue("");
  });

  it("says so when there are no draws in the date range", async () => {
    renderPage("/stats?from=2027-01-01");
    expect(await screen.findByText("No draws in this date range")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });

  it("warns when From is after To, and does not ask the server", async () => {
    let asked = false;
    server.use(
      http.get("*/api/v1/stats/frequency", () => {
        asked = true;
        return HttpResponse.json({}, { status: 500 });
      }),
    );

    renderPage("/stats?from=2026-02-01&to=2026-01-01");

    expect(screen.getByRole("alert")).toHaveTextContent(
      "The From date must not be after the To date.",
    );
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(asked).toBe(false);
  });

  it("shows an error with a Try again button when the server fails", async () => {
    server.use(http.get("*/api/v1/stats/frequency", () => HttpResponse.json({}, { status: 500 })));

    renderPage();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Sorry, the statistics could not be loaded.",
    );
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
    expect(
      screen.getByText("Draws are independent. Past frequency does not predict future draws."),
    ).toBeInTheDocument();
  });
});
