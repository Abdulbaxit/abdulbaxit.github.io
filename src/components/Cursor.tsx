"use client";

import { useEffect, useRef } from "react";

/** How long the ring takes to catch up: higher trails further and softer. */
const FOLLOW_SECONDS = 0.11;
/** How much the ring stretches along its motion at full speed. */
const MAX_STRETCH = 0.18;

/** What counts as clickable: the ring grows over these. */
const INTERACTIVE =
  'a, button, [role="button"], summary, label, input, select, textarea';

/**
 * The site's cursor: a coral dot exactly at the pointer, so clicking stays
 * precise, and a ring that trails it a little and swells over anything
 * clickable.
 *
 * Only for a real mouse or trackpad, and not under reduced motion; there
 * the native cursor is left alone. State lives in classes on <html>
 * (has-cursor, cursor-visible, cursor-link, cursor-down) and the look is
 * in globals.css. Positions are written straight to style, never through
 * React state, so moving the mouse never re-renders anything.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!fine.matches || still.matches || !dot || !ring) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");

    let x = 0;
    let y = 0;
    let rx = 0;
    let ry = 0;
    let frame = 0;
    let last = 0;
    let shown = false;

    /*
      The ring eases toward the pointer on a time constant, not a fixed
      fraction per frame: a per-frame fraction moves twice as fast on a
      120 Hz display as on 60 Hz. While it travels it stretches a little
      along its direction of motion and relaxes back to a circle as it
      settles. The loop stops once the ring has arrived.
    */
    const follow = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const k = 1 - Math.exp(-dt / FOLLOW_SECONDS);
      const dx = (x - rx) * k;
      const dy = (y - ry) * k;
      rx += dx;
      ry += dy;

      const speed = dt > 0 ? Math.hypot(dx, dy) / dt : 0;
      const stretch = 1 + Math.min(speed / 3000, MAX_STRETCH);
      ring.style.translate = `${rx}px ${ry}px`;
      ring.style.transform =
        stretch > 1.005
          ? `rotate(${Math.atan2(dy, dx)}rad) scale(${stretch}, ${1 / stretch})`
          : "";

      const moving = Math.abs(x - rx) + Math.abs(y - ry) > 0.1;
      frame = moving ? requestAnimationFrame(follow) : 0;
      if (!moving) ring.style.transform = "";
    };

    const start = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(follow);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      dot.style.translate = `${x}px ${y}px`;
      if (!shown) {
        // Appear where the pointer is, rather than flying in from a corner.
        rx = x;
        ry = y;
        shown = true;
        root.classList.add("cursor-visible");
      }
      start();
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      root.classList.toggle("cursor-link", Boolean(target?.closest(INTERACTIVE)));
    };

    // No relatedTarget: the pointer left the window, or went into an
    // iframe (the Cal.com booking window), which draws its own cursor.
    const onOut = (e: PointerEvent) => {
      if (e.relatedTarget) return;
      shown = false;
      root.classList.remove("cursor-visible", "cursor-link");
    };

    const onDown = () => root.classList.add("cursor-down");
    const onUp = () => root.classList.remove("cursor-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.classList.remove("has-cursor", "cursor-visible", "cursor-link", "cursor-down");
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
