"use client";

import { useSyncExternalStore } from "react";

const TICK_MS = 30_000;

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, TICK_MS);
  return () => window.clearInterval(id);
}

export function LocalTime({
  timeZone,
  place,
  note,
}: {
  timeZone: string;
  place: string;
  note?: string | null;
}) {
  const time = useSyncExternalStore(
    subscribe,
    () =>
      new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone,
      }).format(new Date()),
    () => null,
  );

  return (
    <p className="local-time" aria-live="off">
      {time && (
        <>
          It&rsquo;s {time} in {place}
          {note && (
            <>
              <span aria-hidden="true"> · </span>
              {note}
            </>
          )}
        </>
      )}
    </p>
  );
}
