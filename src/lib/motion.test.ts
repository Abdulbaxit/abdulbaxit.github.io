import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clamp,
  easeOutCubic,
  frameThrottle,
  hasFinePointer,
  prefersReducedMotion,
  smoothstep,
} from "./motion";

describe("clamp", () => {
  it("keeps a number inside the range", () => {
    expect(clamp(-1, 0, 1)).toBe(0);
    expect(clamp(0.4, 0, 1)).toBe(0.4);
    expect(clamp(7, 0, 1)).toBe(1);
  });
});

describe("easings", () => {
  it("start at 0 and end at 1", () => {
    for (const ease of [easeOutCubic, smoothstep]) {
      expect(ease(0)).toBe(0);
      expect(ease(1)).toBe(1);
    }
  });

  it("easeOutCubic is past halfway at the midpoint", () => {
    expect(easeOutCubic(0.5)).toBe(0.875);
  });

  it("smoothstep is symmetric around the midpoint", () => {
    expect(smoothstep(0.5)).toBe(0.5);
    expect(smoothstep(0.25) + smoothstep(0.75)).toBeCloseTo(1);
  });
});

describe("media queries", () => {
  afterEach(() => vi.unstubAllGlobals());

  const stubMatches = (matching: string[]) =>
    vi.stubGlobal("window", {
      matchMedia: (query: string) => ({ matches: matching.includes(query) }),
    });

  it("reads reduced motion", () => {
    stubMatches(["(prefers-reduced-motion: reduce)"]);
    expect(prefersReducedMotion()).toBe(true);
    stubMatches([]);
    expect(prefersReducedMotion()).toBe(false);
  });

  it("reads a fine, hovering pointer", () => {
    stubMatches(["(hover: hover) and (pointer: fine)"]);
    expect(hasFinePointer()).toBe(true);
    stubMatches([]);
    expect(hasFinePointer()).toBe(false);
  });
});

describe("frameThrottle", () => {
  let queue: Map<number, FrameRequestCallback>;
  let nextId: number;
  const flush = () => {
    const callbacks = [...queue.values()];
    queue.clear();
    callbacks.forEach((cb) => cb(0));
  };

  beforeEach(() => {
    queue = new Map();
    nextId = 1;
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      queue.set(nextId, cb);
      return nextId++;
    });
    vi.stubGlobal("cancelAnimationFrame", (id: number) => queue.delete(id));
  });
  afterEach(() => vi.unstubAllGlobals());

  it("runs once per frame however often it is scheduled", () => {
    const fn = vi.fn();
    const { schedule } = frameThrottle(fn);
    schedule();
    schedule();
    schedule();
    expect(fn).not.toHaveBeenCalled();
    flush();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("can be scheduled again after it runs", () => {
    const fn = vi.fn();
    const { schedule } = frameThrottle(fn);
    schedule();
    flush();
    schedule();
    flush();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("cancel drops a pending run and allows a new one", () => {
    const fn = vi.fn();
    const { schedule, cancel } = frameThrottle(fn);
    schedule();
    cancel();
    flush();
    expect(fn).not.toHaveBeenCalled();
    schedule();
    flush();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
