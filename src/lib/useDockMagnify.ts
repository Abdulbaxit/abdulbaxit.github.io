"use client";

import { useEffect, type RefObject } from "react";
import { frameThrottle, hasFinePointer, prefersReducedMotion } from "./motion";

const MAX_SCALE = 1.9;
const REACH = 2.4;
const FALLBACK_ITEM_PX = 40;

export function useDockMagnify(
  ref: RefObject<HTMLElement | null>,
  enabled = true,
) {
  useEffect(() => {
    const root = ref.current;
    if (!root || !enabled) return;

    if (!hasFinePointer() || prefersReducedMotion()) return;

    const items = Array.from(
      root.querySelectorAll<HTMLElement>("[data-magnify]"),
    );
    if (!items.length) return;

    let centres: number[] = [];
    let width = 0;
    let pointerX: number | null = null;

    const measure = () => {
      centres = items.map((el) => {
        const r = el.getBoundingClientRect();
        return r.left + r.width / 2;
      });
      width = items[0].getBoundingClientRect().width || FALLBACK_ITEM_PX;
    };

    const paint = () => {
      const x = pointerX;
      items.forEach((el, i) => {
        if (x === null) {
          el.style.setProperty("--mag", "1");
          return;
        }
        const distance = Math.abs(x - centres[i]) / (width * REACH);
        const influence =
          distance >= 1 ? 0 : (Math.cos(distance * Math.PI) + 1) / 2;
        const scale = 1 + (MAX_SCALE - 1) * influence;
        el.style.setProperty("--mag", scale.toFixed(3));
      });
    };

    const { schedule, cancel } = frameThrottle(paint);

    const onEnter = () => {
      measure();
    };

    const onMove = (e: PointerEvent) => {
      pointerX = e.clientX;
      schedule();
    };

    const onLeave = () => {
      pointerX = null;
      schedule();
    };

    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", measure, { passive: true });

    return () => {
      cancel();
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", measure);
      items.forEach((el) => el.style.removeProperty("--mag"));
    };
  }, [ref, enabled]);
}
