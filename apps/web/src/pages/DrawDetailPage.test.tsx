import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { describe, expect, it } from "vitest";
import { DrawDetailPage } from "./DrawDetailPage.tsx";

function ShowLocation() {
  const location = useLocation();
  return <p data-testid="where">{`${location.pathname}${location.search}`}</p>;
}

type Entry = string | { pathname: string; state: { backTo: string } };

function renderPage(entry: Entry) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[entry]}>
        <Routes>
          <Route path="/" element={<ShowLocation />} />
          <Route path="/draws/:id" element={<DrawDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("DrawDetailPage", () => {
  it("sets the page title", async () => {
    renderPage("/draws/b");
    await screen.findByRole("heading", { name: "Lotto Max", level: 2 });
    await waitFor(() => expect(document.title).toBe("Draw details | DrawWatch"));
  });

  it("shows a loading message, then the draw", async () => {
    renderPage("/draws/b");
    expect(screen.getByRole("status")).toHaveTextContent("Loading draw...");

    expect(await screen.findByRole("heading", { name: "Lotto Max", level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Draw details", level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Bonus number: 8")).toBeInTheDocument();
  });

  it("shows a clear message when the draw does not exist", async () => {
    renderPage("/draws/nope");
    expect(await screen.findByText("Draw not found")).toBeInTheDocument();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });

  it("goes back to the Results page when there is no saved address", async () => {
    const user = userEvent.setup();
    renderPage("/draws/b");
    await user.click(screen.getByRole("link", { name: "Back to results" }));
    expect(screen.getByTestId("where")).toHaveTextContent("/");
  });

  it("goes back to the same filters and page the visitor came from", async () => {
    const user = userEvent.setup();
    renderPage({ pathname: "/draws/b", state: { backTo: "/?gameId=lotto-max&page=2" } });
    await user.click(screen.getByRole("link", { name: "Back to results" }));
    expect(screen.getByTestId("where")).toHaveTextContent("/?gameId=lotto-max&page=2");
  });
});
