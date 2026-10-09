"use client";

import { useRef } from "react";
import { profile } from "@/content/profile";
import { asset } from "@/content/site";

/**
 * The hero medallion: the portrait cropped to a circle, or the initials
 * in the accent when no portrait is set.
 *
 * On hover it tilts toward the pointer. This component only reports where
 * the pointer is, as --px / --py from -1 to 1 across the medallion; the
 * tilt, parallax, sheen and ring are all CSS reading those two values.
 * The stage that measures is never transformed itself, so the tilt can't
 * feed back into the measurement.
 */
export function Medallion() {
  const { portrait, initials, name } = profile;
  const stageRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  function setPointer(px: number, py: number) {
    const stage = stageRef.current;
    if (!stage) return;
    cancelAnimationFrame(frame.current);
    // At most one style write per frame, however fast the pointer moves.
    frame.current = requestAnimationFrame(() => {
      stage.style.setProperty("--px", px.toFixed(3));
      stage.style.setProperty("--py", py.toFixed(3));
    });
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = e.currentTarget.getBoundingClientRect();
    setPointer(
      ((e.clientX - box.left) / box.width) * 2 - 1,
      ((e.clientY - box.top) / box.height) * 2 - 1,
    );
  }

  return (
    <div
      ref={stageRef}
      className="medallion-stage"
      onPointerMove={onPointerMove}
      onPointerLeave={() => setPointer(0, 0)}
    >
      <div className="medallion-tilt">
        <div className="medallion">
          {portrait ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, no optimizer */}
              <img
                className="medallion__img"
                src={asset(portrait)}
                alt={`Portrait of ${name}`}
                width={760}
                height={760}
                fetchPriority="high"
                decoding="async"
              />
              <span className="medallion__shine" aria-hidden="true" />
            </>
          ) : (
            <span className="medallion__initials" aria-hidden="true">
              {initials.toUpperCase()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
