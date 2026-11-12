import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { games } from "../../test/handlers.ts";
import { GameSelect } from "./GameSelect.tsx";

describe("GameSelect", () => {
  it("has a label and lists All games and every game", () => {
    render(<GameSelect games={games} value="" onChange={vi.fn()} />);
    const select = screen.getByRole("combobox", { name: "Game" });
    expect(select).toHaveValue("");
    expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual([
      "All games",
      "Lotto 6/49",
      "Lotto Max",
    ]);
  });

  it("shows the selected game", () => {
    render(<GameSelect games={games} value="lotto-max" onChange={vi.fn()} />);
    expect(screen.getByRole("combobox", { name: "Game" })).toHaveValue("lotto-max");
  });

  it("tells the parent which game was chosen", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<GameSelect games={games} value="" onChange={onChange} />);
    await user.selectOptions(screen.getByRole("combobox", { name: "Game" }), "Lotto Max");
    expect(onChange).toHaveBeenCalledWith("lotto-max");
  });

  it("can hide the All games choice", () => {
    render(<GameSelect games={games} value="lotto-649" onChange={vi.fn()} allowAll={false} />);
    expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual([
      "Lotto 6/49",
      "Lotto Max",
    ]);
  });
});
