// Counts how often each number was drawn. The bonus number is not counted.

import type { Draw } from "./index.ts";

export interface FrequencyEntry {
    number: number;
    count: number;
}

export interface FrequencyResult {
    totalDraws: number;
    counts: FrequencyEntry[]; // every number from 1 to maxNumber, in number order
    hot: FrequencyEntry[]; // most drawn first
    cold: FrequencyEntry[]; // least drawn first
}

export function calculateFrequency(draws: Draw[], maxNumber: number, top = 6): FrequencyResult {
    const counts: FrequencyEntry[] = [];
    for (let n = 1; n <= maxNumber; n++) {
        counts.push({ number: n, count: 0 });
    }

    for (const draw of draws) {
        for (const n of draw.numbers) {
            const entry = counts[n - 1];
            if (entry) {
                entry.count += 1;
            }
        }
    }

    const hot = [...counts].sort((a, b) => b.count - a.count || a.number - b.number).slice(0, top);
      const cold = [...counts].sort((a, b) => a.count - b.count || a.number - b.number).slice(0, top);
    return { totalDraws: draws.length, counts, hot, cold };
}