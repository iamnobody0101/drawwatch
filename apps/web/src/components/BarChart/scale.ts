// Turns counts into bar lengths and axis values. Plain functions, no React.

// Rounds a count up to a round top value for the axis: 1, 2 or 5 times a power of ten.
// Example: 83 becomes 100, 21 becomes 50, 7 becomes 10.
export function niceMax(value: number): number {
  if (value <= 0) {
    return 5;
  }
  const power = 10 ** Math.floor(Math.log10(value));
  const leading = value / power; // between 1 and 10
  const niceLeading = [1, 2, 5, 10].find((step) => leading <= step) ?? 10;
  // Never below 5, so the axis steps stay whole numbers (0, 1, 2, ...).
  return Math.max(niceLeading * power, 5);
}

// Turns a count into a bar length in pixels.
// The bar for maxValue fills the whole width. A count of 0 gives no bar.
export function barLength(value: number, maxValue: number, width: number): number {
  if (maxValue <= 0) {
    return 0;
  }
  return (value / maxValue) * width;
}

// The values written on the axis, from 0 up to maxValue, in equal steps.
export function ticks(maxValue: number, count = 5): number[] {
  const step = maxValue / count;
  return Array.from({ length: count + 1 }, (_, index) => index * step);
}
