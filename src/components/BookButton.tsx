"use client";

import { useCallback, useRef, useState } from "react";
import { Icon } from "./Sprite";
import { profile } from "@/content/profile";

/**
 * Opens the Cal.com booking dialog over the page.
 *
 * Three deliberate choices:
 *
 * 1. The import is dynamic and happens on click. Cal's npm package is a
 *    1KB shim, but it injects a ~22KB runtime from their CDN, and that
 *    runtime then polls `color-scheme` on a 50ms interval for as long as
 *    the page lives. On a portfolio almost nobody books, so none of that
 *    should load until someone actually intends to.
 *
 * 2. `readyRef` stops the second click re-running the `ui` config and
 *    re-opening the modal on top of itself.
 *
 * 3. It renders as an anchor to the real booking page. With JS
 *    unavailable, or if the CDN is blocked, the link still works, and
 *    cmd/ctrl-click still opens a tab as a visitor expects.
 */
export function BookButton() {
  const [loading, setLoading] = useState(false);
  const readyRef = useRef(false);

  const link = profile.calLink;
  const namespace = profile.calNamespace ?? undefined;
  const href = link ? `https://cal.com/${link}` : undefined;

  /** Pull the chunk on intent, without initialising anything. */
  const warm = useCallback(() => {
    if (readyRef.current) return;
    void import("@calcom/embed-react");
  }, []);

  const open = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!link) return;
      // Let the browser handle modified clicks and middle-click itself.
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();

      type CalFn = (action: string, config?: unknown) => void;
      const w = window as unknown as { Cal?: { ns?: Record<string, CalFn> } };

      if (readyRef.current && namespace && w.Cal?.ns?.[namespace]) {
        w.Cal.ns[namespace]("modal", { calLink: link });
        return;
      }

      setLoading(true);
      try {
        const { getCalApi } = await import("@calcom/embed-react");
        const cal = await getCalApi(namespace ? { namespace } : undefined);

        cal("ui", {
          // "auto" tracks the host page, but Cal reads the CSS
          // `color-scheme` property rather than any class, which is why
          // globals.css sets it in both :root and .dark.
          theme: "auto",
          layout: "month_view",
          cssVarsPerTheme: {
            light: { "cal-brand": "#e45447" },
            dark: { "cal-brand": "#e45447" },
          },
          hideEventTypeDetails: false,
        });

        readyRef.current = true;
        cal("modal", { calLink: link });
      } catch {
        // Blocked, offline, or the CDN is down: fall back to the page
        // itself rather than leaving a dead button.
        if (href) window.open(href, "_blank", "noopener");
      } finally {
        setLoading(false);
      }
    },
    [link, namespace, href],
  );

  if (!link || !href) return null;

  return (
    <a
      className="dock__book"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={open}
      onPointerEnter={warm}
      onFocus={warm}
      aria-busy={loading || undefined}
      aria-label="Book a call"
    >
      <Icon id="calendar" />
      <span>{loading ? "Opening…" : "Book a call"}</span>
    </a>
  );
}
