import type { FrequencyResult } from "@drawwatch/shared";
import type { BarGroup, BarItem } from "../components/BarChart/BarChart.tsx";

// Turns the answer from the server into the bars for the chart.
// A number that is in both lists counts as hot.
export function buildChartItems(result: FrequencyResult): BarItem[] {
  const hot = new Set(result.hot.map((entry) => entry.number));
  const cold = new Set(result.cold.map((entry) => entry.number));
  return result.counts.map((entry) => {
    let group: BarGroup | undefined;
    if (hot.has(entry.number)) {
      group = "hot";
    } else if (cold.has(entry.number)) {
      group = "cold";
    }
    return { label: String(entry.number), value: entry.count, group };
  });
}

// "1 time" or "5 times".
export function formatTimes(count: number): string {
  return count === 1 ? "1 time" : `${count} times`;
}

// A short text that says what the chart shows, for people who cannot see it.
export function buildSummary(result: FrequencyResult): string {
  const most = result.hot[0];
  const least = result.cold[0];
  if (most === undefined || least === undefined) {
    return "";
  }
  const total = `Based on ${result.totalDraws} draws.`;
  const top = `Most drawn: ${most.number} (${formatTimes(most.count)}).`;
  const bottom = `Least drawn: ${least.number} (${formatTimes(least.count)}).`;
  return `${total} ${top} ${bottom}`;
}
