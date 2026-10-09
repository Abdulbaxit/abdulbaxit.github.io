import { profile } from "@/content/profile";

/**
 * An endless, slowly scrolling strip of the tools I work with, under the
 * hero. Pure CSS: the list is rendered twice side by side and the track
 * slides left by exactly one copy, so the loop has no seam. The copy is
 * hidden from screen readers, so the list is announced once. Pauses on
 * hover; static under reduced motion.
 */
export function Marquee() {
  const tools = profile.toolbelt;
  if (tools.length === 0) return null;

  return (
    <div className="marquee" role="region" aria-label="Tools I work with">
      <div className="marquee__track">
        {[false, true].map((copy) => (
          <ul key={String(copy)} className="marquee__list" aria-hidden={copy || undefined}>
            {tools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
