import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAfterDelay } from "./useAfterDelay.ts";

describe("useAfterDelay", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("is false at first and true after the delay", () => {
    const { result } = renderHook(() => useAfterDelay(true, 3000));
    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(2999);
    });
    expect(result.current).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe(true);
  });

  it("goes back to false when the waiting stops", () => {
    const { result, rerender } = renderHook(({ active }) => useAfterDelay(active, 3000), {
      initialProps: { active: true },
    });
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current).toBe(true);

    rerender({ active: false });
    expect(result.current).toBe(false);
  });

  it("stays false if the waiting stops before the delay", () => {
    const { result, rerender } = renderHook(({ active }) => useAfterDelay(active, 3000), {
      initialProps: { active: true },
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    rerender({ active: false });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current).toBe(false);
  });
});
