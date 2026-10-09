"use client";

import Link from "next/link";
import type { Route } from "next";
import { useLayoutEffect, useRef, useState } from "react";

/**
 * The morph button from the source theme: a coral disc at rest with the
 * label beside it, growing on hover into a pill that sits behind the
 * label while the text inverts to paper.
 *
 * The pill width is measured from the rendered text rather than estimated
 * from its length. A per-character estimate is always wrong by a few
 * pixels (glyph widths differ, and the webfont may not have loaded when
 * the estimate is made), and being wrong on the short side clips the
 * label. Measuring costs one layout read and is exact.
 */
const DISC = 60;
const GAP = 15;
const PAD = 24;

export function SvgButton({
  href,
  label,
  download = false,
  ariaLabel,
}: {
  href: string;
  label: string;
  download?: boolean;
  ariaLabel?: string;
}) {
  const textRef = useRef<SVGTextElement>(null);
  /**
   * Server-rendered fallback, generous on purpose: until the measurement
   * lands the pill is too wide rather than too narrow, so the label is
   * never clipped in the gap.
   */
  const [textW, setTextW] = useState(() => label.length * 11.5);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.getComputedTextLength();
      if (w > 0) setTextW(w);
    };

    measure();

    // Roboto is self-hosted with font-display:swap, so the first measure
    // can land on the fallback face. Re-measure once the real one is in.
    if (document.fonts?.status === "loaded") return;
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) measure();
    });
    return () => {
      cancelled = true;
    };
  }, [label]);

  const textX = DISC + GAP;
  const viewW = Math.ceil(textX + textW + PAD);
  // The pill is drawn from x=0, so it must reach past the label's end.
  const pill = Math.ceil(textX + textW + PAD / 2);

  const svg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={viewW}
      height={DISC}
      viewBox={`0 0 ${viewW} ${DISC}`}
      role="presentation"
    >
      <rect
        x="0"
        y="0"
        width={DISC}
        height={DISC}
        rx={DISC / 2}
        ry={DISC / 2}
        fill="var(--color-prime)"
        opacity="0.4"
      />
      <text ref={textRef} x={textX} y="38" textAnchor="start">
        {label}
      </text>
    </svg>
  );

  const style = { "--pill": `${pill}px` } as React.CSSProperties;

  if (download) {
    return (
      <a
        className="svg-btn"
        href={href}
        download
        aria-label={ariaLabel ?? label}
        style={style}
      >
        {svg}
      </a>
    );
  }

  return (
    <Link
      className="svg-btn"
      href={href as Route}
      aria-label={ariaLabel ?? label}
      style={style}
    >
      {svg}
    </Link>
  );
}
