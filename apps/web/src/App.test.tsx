import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import App from "./App.tsx";

function renderApp(address: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[address]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const heading = (name: string) => screen.findByRole("heading", { name, level: 1 });

describe("App routes", () => {
  it("shows the Results page at /", async () => {
    renderApp("/");
    expect(await heading("Results")).toBeInTheDocument();
  });

  it("shows the Draw detail page at /draws/:id", async () => {
    renderApp("/draws/b");
    expect(await heading("Draw details")).toBeInTheDocument();
  });

  it("shows the About page at /about", async () => {
    renderApp("/about");
    expect(await heading("About DrawWatch")).toBeInTheDocument();
  });

  it("shows the Not Found page for an unknown address", async () => {
    renderApp("/banana");
    expect(await heading("Page not found")).toBeInTheDocument();
  });

  it("moves between pages with the menu links", async () => {
    const user = userEvent.setup();
    renderApp("/");

    await user.click(screen.getByRole("link", { name: "About" }));
    expect(await heading("About DrawWatch")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "page");

    await user.click(screen.getByRole("link", { name: "Results" }));
    expect(await heading("Results")).toBeInTheDocument();
  });

  it("has a DrawWatch link that goes to the home page", async () => {
    renderApp("/about");
    expect(screen.getByRole("link", { name: "DrawWatch" })).toHaveAttribute("href", "/");
  });
});
