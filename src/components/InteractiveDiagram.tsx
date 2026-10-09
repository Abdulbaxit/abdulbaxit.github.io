"use client";

import { useEffect, useId, useState } from "react";
import type { Diagram, DiagramNode } from "@/content/diagrams";

const STEP_MS = 1800;

/** Baselines for a box's title and lines, centred as one block. */
function layout(n: DiagramNode) {
  const titleSize = n.kicker ? 13 : (n.titleSize ?? 15);
  const lineSize = n.lineSize ?? 12;
  const lineGap = lineSize + 6;
  const lines = n.lines ?? [];
  const hasTitle = n.title !== "";
  const linesHeight = lines.length ? (lines.length - 1) * lineGap + lineSize : 0;
  const block = (hasTitle ? titleSize : 0) + (hasTitle && lines.length ? 8 : 0) + linesHeight;
  const top = n.y + (n.h - block) / 2;
  return {
    titleSize,
    lineSize,
    titleY: top + titleSize * 0.82,
    lineY: (i: number) =>
      top + (hasTitle ? titleSize + 8 : 0) + i * lineGap + lineSize * 0.82,
  };
}

/**
 * An architecture diagram you can explore. Hover, focus or tap a box to
 * read what it does; press play to watch the flow step through the system,
 * with the arrows already travelled staying lit. Rendered on the server
 * too, so without JavaScript it is still the full static diagram.
 */
export function InteractiveDiagram({ diagram }: { diagram: Diagram }) {
  const uid = useId().replace(/[^\w-]/g, "");
  const [hover, setHover] = useState<string | null>(null);
  const [step, setStep] = useState(-1);
  const playing = step >= 0;
  const { flow } = diagram;

  // Advance one step at a time; after the last, hold it, then clear.
  useEffect(() => {
    if (!playing) return;
    const last = step === flow.length - 1;
    const t = window.setTimeout(
      () => setStep(last ? -1 : step + 1),
      last ? STEP_MS * 1.6 : STEP_MS,
    );
    return () => window.clearTimeout(t);
  }, [playing, step, flow.length]);

  const visited = playing ? flow.slice(0, step + 1) : [];
  const current = playing ? flow[step] : null;
  const doneNodes = new Set(visited.map((s) => s.node));
  const doneEdges = new Set(visited.flatMap((s) => s.edges ?? []));
  const onEdges = new Set(current?.edges ?? []);
  const activeNode = current?.node ?? hover;
  const focused = activeNode !== null;
  const hovered = !playing && hover ? diagram.nodes.find((n) => n.id === hover) : null;

  function nodeClass(n: DiagramNode) {
    return [
      "dg-node",
      n.tone && `dg-node--${n.tone}`,
      n.id === activeNode && "is-on",
      doneNodes.has(n.id) && "is-done",
    ]
      .filter(Boolean)
      .join(" ");
  }

  function edgeClass(id: string, tone?: string, dashed?: boolean) {
    return [
      "dg-edge",
      tone && `dg-edge--${tone}`,
      dashed && "dg-edge--dashed",
      onEdges.has(id) ? "is-on" : doneEdges.has(id) && "is-done",
    ]
      .filter(Boolean)
      .join(" ");
  }

  return (
    <div className={`dg${focused ? " is-focused" : ""}`}>
      <div className="proj__media proj__media--diagram">
        <svg
          className="dg__svg"
          viewBox="0 0 800 500"
          role="group"
          aria-label={diagram.alt}
        >
          <defs>
            {(["muted", "prime"] as const).map((c) => (
              <marker
                key={c}
                id={`${uid}-${c}`}
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M0 0 10 5 0 10z" className={`dg-arrow dg-arrow--${c}`} />
              </marker>
            ))}
          </defs>

          <rect width="800" height="500" rx="10" className="dg-bg" />

          {diagram.labels?.map((l) => (
            <text
              key={l.text}
              x={l.x}
              y={l.y}
              className={`dg-label dg-label--${l.kind}`}
              textAnchor={l.kind === "caption" ? "middle" : "start"}
            >
              {l.text}
            </text>
          ))}

          {diagram.edges.map((e) => {
            const lit = onEdges.has(e.id) || doneEdges.has(e.id) || e.tone === "accent";
            return (
              <path
                key={e.id}
                d={e.d}
                className={edgeClass(e.id, e.tone, e.dashed)}
                markerEnd={
                  e.arrow === false
                    ? undefined
                    : `url(#${uid}-${lit ? "prime" : "muted"})`
                }
              />
            );
          })}

          {diagram.nodes.map((n) => {
            const t = layout(n);
            const name = n.title || "Note";
            return (
              <g
                key={n.id}
                className={nodeClass(n)}
                tabIndex={0}
                role="button"
                aria-label={`${name}: ${n.detail}`}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover((h) => (h === n.id ? null : h))}
                onFocus={() => setHover(n.id)}
                onBlur={() => setHover((h) => (h === n.id ? null : h))}
                onClick={() => {
                  // A tap stops the walkthrough and shows this box instead.
                  setStep(-1);
                  setHover(n.id);
                }}
              >
                <rect
                  className="dg-ring"
                  x={n.x - 5}
                  y={n.y - 5}
                  width={n.w + 10}
                  height={n.h + 10}
                  rx="14"
                />
                <rect className="dg-box" x={n.x} y={n.y} width={n.w} height={n.h} rx="10" />
                {n.title && (
                  <text
                    x={n.x + n.w / 2}
                    y={t.titleY}
                    textAnchor="middle"
                    className={n.kicker ? "dg-kicker" : "dg-title"}
                    fontSize={t.titleSize}
                  >
                    {n.title}
                  </text>
                )}
                {n.lines?.map((line, i) => (
                  <text
                    key={line}
                    x={n.x + n.w / 2}
                    y={t.lineY(i)}
                    textAnchor="middle"
                    className="dg-line"
                    fontSize={t.lineSize}
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="dg-info">
        <button
          type="button"
          className="dg-play"
          aria-pressed={playing}
          onClick={() => {
            setHover(null);
            setStep(playing ? -1 : 0);
          }}
        >
          <span aria-hidden="true">{playing ? "■" : "▶"}</span>
          {playing ? "Stop" : diagram.playLabel}
        </button>
        <p className="dg-caption" aria-live="polite">
          {current ? (
            <>
              <span className="dg-caption__step">
                {step + 1}/{flow.length}
              </span>
              {current.caption}
            </>
          ) : hovered ? (
            <>
              <strong>{hovered.title || "Note"}</strong> — {hovered.detail}
            </>
          ) : (
            "Hover or tap a box to see what it does, or press play."
          )}
        </p>
      </div>
    </div>
  );
}
