import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusMessage } from "./StatusMessage";

describe("StatusMessage", () => {
  it("shows the title and the message", () => {
    render(<StatusMessage title="Loading draws..." message="Please wait a moment." />);
    expect(screen.getByText("Loading draws...")).toBeInTheDocument();
    expect(screen.getByText("Please wait a moment.")).toBeInTheDocument();
  });

  it("is a polite live region (status) by default", () => {
    render(<StatusMessage title="Loading draws..." message="Please wait a moment." />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading draws...");
  });

  it("can be an urgent live region (alert)", () => {
    render(<StatusMessage title="Oops" message="It broke." role="alert" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Oops");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows an action when one is given", () => {
    render(
      <StatusMessage
        title="Oops"
        message="It broke."
        action={<button type="button">Retry</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("shows no button when there is no action", () => {
    render(<StatusMessage title="Oops" message="It broke." />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
