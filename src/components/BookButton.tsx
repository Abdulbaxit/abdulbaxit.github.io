"use client";

import { useCallback, useRef, useState } from "react";
import { Icon } from "./Sprite";
import { profile } from "@/content/profile";

export function BookButton() {
  const [loading, setLoading] = useState(false);
  const readyRef = useRef(false);

  const link = profile.calLink;
  const namespace = profile.calNamespace ?? undefined;
  const href = link ? `https://cal.com/${link}` : undefined;

  const warm = useCallback(() => {
    if (readyRef.current) return;
    void import("@calcom/embed-react");
  }, []);

  const open = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!link) return;
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
      data-magnetic="0.3"
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
