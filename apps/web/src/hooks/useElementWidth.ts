import { useCallback, useState } from "react";

// A "callback ref": React calls it with the element when it appears on the page.
type MeasureRef = (element: HTMLElement | null) => (() => void) | undefined;

// Measures how wide an element is, and measures again when its size changes.
// Use it like this: const [ref, width] = useElementWidth(); then <div ref={ref}>.
// The width is 0 until the browser has measured the element.
export function useElementWidth(): [MeasureRef, number] {
  const [width, setWidth] = useState(0);

  const ref = useCallback<MeasureRef>((element) => {
    // Test tools like jsdom have no ResizeObserver, so we skip measuring there.
    if (element === null || typeof ResizeObserver === "undefined") {
      return undefined;
    }
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(element);
    // React 19 calls this when the element leaves the page, so we stop measuring.
    return () => observer.disconnect();
  }, []);

  return [ref, width];
}
