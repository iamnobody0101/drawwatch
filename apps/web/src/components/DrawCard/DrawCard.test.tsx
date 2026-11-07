import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DrawCard } from "./DrawCard";

const draw = {
  gameName: "Lotto 6/49",
  date: "2026-01-07",
  numbers: [3, 12, 27, 33, 41, 49],
  bonus: 8,
};

describe("DrawCard", () => {
  it("shows the game name as a heading", () => {
    render(<DrawCard {...draw} />);
    expect(screen.getByRole("heading", { name: "Lotto 6/49" })).toBeInTheDocument();
  });

  it("shows the date", () => {
    render(<DrawCard {...draw} />);
    expect(screen.getByText("2026-01-07")).toHaveAttribute("datetime", "2026-01-07");
  });

  it("shows every number in a list called Winning numbers", () => {
    render(<DrawCard {...draw} />);
    const list = screen.getByRole("list", { name: "Winning numbers" });
    const items = within(list).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual(["3", "12", "27", "33", "41", "49"]);
  });

  it("shows the bonus number", () => {
    render(<DrawCard {...draw} />);
    expect(screen.getByText("Bonus number: 8")).toBeInTheDocument();
  });
});
