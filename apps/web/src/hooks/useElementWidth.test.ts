import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useElementWidth } from "./useElementWidth.ts";

// A fake ResizeObserver, so the test can say "the element is now 320px wide".
class FakeResizeObserver {
  static last: FakeResizeObserver | undefined;
  callback: ResizeObserverCallback;
  disconnected = false;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    FakeResizeObserver.last = this;
  }

  observe() {}

  disconnect() {
    this.disconnected = true;
  }

  resize(width: number) {
    const entry = { contentRect: { width } } as ResizeObserverEntry;
    this.callback([entry], this as unknown as ResizeObserver);
  }
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useElementWidth", () => {
  it("is 0 before anything is measured", () => {
    const { result } = renderHook(() => useElementWidth());
    expect(result.current[1]).toBe(0);
  });

  it("gives the new width when the element changes size", () => {
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    const { result } = renderHook(() => useElementWidth());

    act(() => {
      result.current[0](document.createElement("div"));
    });
    act(() => {
      FakeResizeObserver.last?.resize(320);
    });

    expect(result.current[1]).toBe(320);
  });

  it("stops measuring when the element leaves the page", () => {
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);
    const { result } = renderHook(() => useElementWidth());

    let cleanup: (() => void) | undefined;
    act(() => {
      cleanup = result.current[0](document.createElement("div"));
    });
    cleanup?.();

    expect(FakeResizeObserver.last?.disconnected).toBe(true);
  });
});
