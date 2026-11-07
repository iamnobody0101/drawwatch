import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NumberBall } from "./NumberBall";

describe("NumberBall", () => {
  it("shows the number", () => {
    render(<NumberBall value={7} />);
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("shows a two-digit number", () => {
    render(<NumberBall value={49} />);
    expect(screen.getByText("49")).toBeInTheDocument();
  });
});
