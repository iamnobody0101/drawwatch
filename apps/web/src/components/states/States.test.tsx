import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";
import { WakingUpState } from "./WakingUpState";

describe("LoadingState", () => {
  it("tells the user the draws are loading, politely", () => {
    render(<LoadingState />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading draws...");
  });
});

describe("EmptyState", () => {
  it("tells the user no draws were found", () => {
    render(<EmptyState />);
    expect(screen.getByRole("status")).toHaveTextContent("No draws found");
    expect(screen.getByText("Try another game.")).toBeInTheDocument();
  });
});

describe("WakingUpState", () => {
  it("explains that the free server is waking up", () => {
    render(<WakingUpState />);
    expect(screen.getByRole("status")).toHaveTextContent("Waking up the server...");
    expect(screen.getByText(/up to a minute/)).toBeInTheDocument();
  });
});

describe("ErrorState", () => {
  it("announces the error as an alert", () => {
    render(<ErrorState onRetry={() => {}} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Sorry, the draws could not be loaded.");
  });

  it("calls onRetry when Try again is pressed", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
