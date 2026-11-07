import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AboutPage } from "./AboutPage.tsx";

describe("AboutPage", () => {
  it("has one main heading and a heading for each section", () => {
    render(<AboutPage />);
    expect(screen.getByRole("heading", { name: "About DrawWatch", level: 1 })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(4);
  });

  it("says the data is sample data", () => {
    render(<AboutPage />);
    expect(screen.getByText(/All draws on this site are sample data/)).toBeInTheDocument();
  });

  it("says the site is not affiliated with OLG", () => {
    render(<AboutPage />);
    expect(screen.getByRole("heading", { name: "Not affiliated with OLG" })).toBeInTheDocument();
    expect(screen.getByText(/It has no gambling features/)).toBeInTheDocument();
  });

  it("links to the source code on GitHub", () => {
    render(<AboutPage />);
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/iamnobody0101/drawwatch",
    );
  });
});
