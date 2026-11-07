import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { NotFoundPage } from "./NotFoundPage.tsx";

describe("NotFoundPage", () => {
  it("sets the page title", async () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );
    await waitFor(() => expect(document.title).toBe("Page not found | DrawWatch"));
  });

  it("tells the visitor the page was not found", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "Page not found", level: 1 })).toBeInTheDocument();
  });

  it("has a link to the results", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: "Go to the results" })).toHaveAttribute("href", "/");
  });
});
