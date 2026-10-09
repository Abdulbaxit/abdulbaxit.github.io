"use client";

import { useSyncExternalStore } from "react";

/**
 * "It's 3:42 PM in Lahore." The time only exists in the browser: a build-
 * time value would be wrong by the time anyone read it, and rendering it on
 * the server would mismatch the client. So the server renders nothing and
 * the line fills in on the first client read, then ticks every 30 seconds.
 */
function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 30_000);
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
    // Holds its line height while empty, so nothing shifts when it fills.
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
