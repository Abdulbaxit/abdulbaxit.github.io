import { profile } from "@/content/profile";

export function Marquee() {
  const tools = profile.toolbelt;
  if (tools.length === 0) return null;

  return (
    <div className="marquee" role="region" aria-label="Tools I work with">
      <div className="marquee__track">
        {[false, true].map((copy) => (
          <ul
            key={String(copy)}
            className="marquee__list"
            aria-hidden={copy || undefined}
          >
            {tools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
