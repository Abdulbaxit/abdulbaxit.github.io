const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const FINE_POINTER = "(hover: hover) and (pointer: fine)";

export function prefersReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION).matches;
}

export function hasFinePointer(): boolean {
  return window.matchMedia(FINE_POINTER).matches;
}

export interface FrameThrottle {
  schedule: () => void;
  cancel: () => void;
}

export function frameThrottle(fn: () => void): FrameThrottle {
  let frame = 0;
  const run = () => {
    frame = 0;
    fn();
  };
  return {
    schedule: () => {
      if (!frame) frame = requestAnimationFrame(run);
    },
    cancel: () => {
      cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}
