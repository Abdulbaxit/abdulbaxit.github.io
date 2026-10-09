"use client";

import { useEffect, type RefObject } from "react";

/**
 * macOS-style dock magnification.
 *
 * Each item scales by how close the pointer is to its centre, so the
 * hovered icon grows most, its neighbours less, and the falloff makes a
 * wave that travels along the dock. A plain :hover cannot do this,
 * because the effect depends on distance rather than which element the
 * pointer is actually over.
 *
 * Implementation notes:
 *
 * - Item centres are measured once per pointer entry, not per frame.
 *   Reading geometry inside the move handler would force a layout on
 *   every mousemove, and the centres only change when the dock resizes.
 * - Each frame writes one custom property per item and nothing else, so
 *   the browser composites the transform on the GPU. No layout, no paint.
 * - Work is batched into a single rAF, so a burst of mousemove events
 *   collapses to one update per frame.
 */
const MAX_SCALE = 1.9;
/** How far the influence reaches, in multiples of an item's width. */
const REACH = 2.4;

export function useDockMagnify(
  ref: RefObject<HTMLElement | null>,
  enabled = true,
) {
  useEffect(() => {
    const root = ref.current;
    if (!root || !enabled) return;

    // Coarse pointers have no meaningful hover, and magnification is
    // exactly the kind of motion reduced-motion asks us to drop.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || still.matches) return;

    const items = Array.from(
      root.querySelectorAll<HTMLElement>("[data-magnify]"),
    );
    if (!items.length) return;

    let centres: number[] = [];
    let width = 0;
    let frame = 0;
    let pointerX: number | null = null;

    const measure = () => {
      centres = items.map((el) => {
        const r = el.getBoundingClientRect();
        return r.left + r.width / 2;
      });
      width = items[0].getBoundingClientRect().width || 40;
    };

    const paint = () => {
      frame = 0;
      const x = pointerX;
      items.forEach((el, i) => {
        if (x === null) {
          el.style.setProperty("--mag", "1");
          return;
        }
        const distance = Math.abs(x - centres[i]) / (width * REACH);
        // Cosine falloff: 1 at the pointer, easing to 0 at the edge of
        // the reach, which reads smoother than a linear ramp.
        const influence =
          distance >= 1 ? 0 : (Math.cos(distance * Math.PI) + 1) / 2;
        const scale = 1 + (MAX_SCALE - 1) * influence;
        el.style.setProperty("--mag", scale.toFixed(3));
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onEnter = () => {
      // Centres shift as neighbours grow, so this is the honest moment
      // to measure: the dock is at rest.
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
      if (frame) cancelAnimationFrame(frame);
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", measure);
      items.forEach((el) => el.style.removeProperty("--mag"));
    };
  }, [ref, enabled]);
}
