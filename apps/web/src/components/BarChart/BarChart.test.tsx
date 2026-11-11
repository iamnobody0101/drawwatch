import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { BarChart } from "./BarChart.tsx";
import type { BarItem } from "./BarChart.tsx";

const items: BarItem[] = [
  { label: "1", value: 12, group: "hot" },
  { label: "2", value: 7 },
  { label: "3", value: 3, group: "cold" },
  { label: "4", value: 9 },
];

function renderChart() {
  return render(
    <BarChart
      title="How often each number was drawn"
      items={items}
      labelName="Number"
      valueName="Times drawn"
      summary="Most drawn: 1 (12 times)."
    />,
  );
}

function getBars() {
  const chart = screen.getByRole("group", { name: "How often each number was drawn" });
  return within(chart).getAllByRole("img");
}

describe("BarChart", () => {
  it("shows the title, the summary and one bar for each item", () => {
    renderChart();
    expect(
      screen.getByRole("heading", { name: "How often each number was drawn" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Most drawn: 1 (12 times).")).toBeInTheDocument();
    expect(getBars()).toHaveLength(4);
  });

  it("gives every bar a name with its label, value and group", () => {
    renderChart();
    expect(getBars().map((bar) => bar.getAttribute("aria-label"))).toEqual([
      "Number 1, Times drawn: 12, Hot",
      "Number 2, Times drawn: 7",
      "Number 3, Times drawn: 3, Cold",
      "Number 4, Times drawn: 9",
    ]);
  });

  it("writes Hot and Cold next to the bars, so colour is not the only signal", () => {
    renderChart();
    const [first, , third] = getBars();
    expect(first).toHaveTextContent("12 Hot");
    expect(third).toHaveTextContent("3 Cold");
  });

  it("starts the axis at 0 and ends it at a round number", () => {
    const { container } = renderChart();
    const ticks = [...container.querySelectorAll("text")]
      .map((text) => text.textContent)
      .slice(0, 6);
    expect(ticks).toEqual(["0", "4", "8", "12", "16", "20"]);
  });

  it("shows the same numbers in the table as in the chart", async () => {
    const user = userEvent.setup();
    renderChart();
    const chartRows = getBars().map((bar) => {
      const [label, rest] = (bar.getAttribute("aria-label") ?? "").split(", Times drawn: ");
      const [value, group = ""] = (rest ?? "").split(", ");
      return [label?.replace("Number ", ""), value, group];
    });

    await user.click(screen.getByRole("button", { name: "Show as table" }));

    const table = screen.getByRole("table", { name: "How often each number was drawn" });
    const tableRows = within(table)
      .getAllByRole("row")
      .slice(1) // the first row is the header
      .map((row) => [...row.querySelectorAll("th, td")].map((cell) => cell.textContent));
    expect(tableRows).toEqual(chartRows);
    expect(tableRows).toHaveLength(items.length);
  });

  it("switches between the chart and the table", async () => {
    const user = userEvent.setup();
    renderChart();

    await user.click(screen.getByRole("button", { name: "Show as table" }));
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.queryByRole("group")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Show as chart" }));
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(getBars()).toHaveLength(4);
  });

  it("is one Tab stop, and the arrow keys move between the bars", async () => {
    const user = userEvent.setup();
    renderChart();
    const bars = getBars();

    await user.tab(); // the "Show as table" button
    await user.tab();
    expect(bars[0]).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(bars[1]).toHaveFocus();

    await user.keyboard("{End}");
    expect(bars[3]).toHaveFocus();

    await user.keyboard("{ArrowDown}"); // already at the last bar, so it stays
    expect(bars[3]).toHaveFocus();

    await user.keyboard("{Home}");
    expect(bars[0]).toHaveFocus();

    await user.tab(); // leaves the chart in one step
    expect(document.body).toHaveFocus();
  });

  it("shows a tooltip on focus, and Escape hides it", async () => {
    const user = userEvent.setup();
    const { container } = renderChart();

    await user.tab();
    await user.tab();
    await user.keyboard("{ArrowDown}");
    const tooltip = container.querySelector("[class*='tooltip']");
    expect(tooltip).toHaveTextContent("Number 2");
    expect(tooltip).toHaveTextContent("Times drawn: 7");

    await user.keyboard("{Escape}");
    expect(container.querySelector("[class*='tooltip']")).toBeNull();
  });

  it("shows a tooltip when the pointer is over a bar", async () => {
    const user = userEvent.setup();
    const { container } = renderChart();

    await user.hover(getBars()[2]!);
    const tooltip = container.querySelector("[class*='tooltip']");
    expect(tooltip).toHaveTextContent("Number 3");
    expect(tooltip).toHaveTextContent("Cold");
  });
});
