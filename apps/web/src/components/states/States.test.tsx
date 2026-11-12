import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";
import { PageOutOfRangeState } from "./PageOutOfRangeState";
import { WakingUpState } from "./WakingUpState";

describe("LoadingState", () => {
  it("tells the user the draws are loading, politely", () => {
    render(<LoadingState />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading draws...");
  });

  it("can say what is loading", () => {
    render(<LoadingState subject="statistics" />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading statistics...");
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
    expect(screen.getByRole("alert")).toHaveTextContent("the server may be busy");
  });

  it("calls onRetry when Try again is pressed", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("can say what could not be loaded", () => {
    render(<ErrorState onRetry={() => {}} subject="statistics" />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Sorry, the statistics could not be loaded.",
    );
  });
});

describe("PageOutOfRangeState", () => {
  it("tells the user the page does not exist", () => {
    render(<PageOutOfRangeState onGoToFirstPage={() => {}} />);
    expect(screen.getByRole("status")).toHaveTextContent("This page does not exist.");
  });

  it("calls onGoToFirstPage when Go to page 1 is pressed", async () => {
    const user = userEvent.setup();
    const onGoToFirstPage = vi.fn();
    render(<PageOutOfRangeState onGoToFirstPage={onGoToFirstPage} />);
    await user.click(screen.getByRole("button", { name: "Go to page 1" }));
    expect(onGoToFirstPage).toHaveBeenCalledTimes(1);
  });
});
