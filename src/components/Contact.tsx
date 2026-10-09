import { Icon } from "./Sprite";
import { LocalTime } from "./LocalTime";
import { profile } from "@/content/profile";

export function Contact() {
  return (
    <section id="contact" className="m-auto mt-12 max-w-xs text-center md:mt-32">
      <h2 data-decode className="text-lg font-bold" style={{ color: "var(--text-strong)" }}>
        Keep in touch
      </h2>
      <p className="mt-8 text-sm" style={{ color: "var(--text-muted)" }}>
        {profile.location}
      </p>
      <p className="mt-4 text-xl font-medium">
        <a href={`mailto:${profile.email}`} className="underline-offset-4 hover:underline">
          {profile.email}
        </a>
      </p>
      <LocalTime
        timeZone={profile.timeZone}
        place={profile.location.split(",")[0]}
        note={profile.replyNote}
      />
      <div className="mt-12 flex justify-center gap-5">
        {profile.socials
          .filter((s) => s.kind !== "email")
          .map((s) => (
            <a
              key={s.kind}
              href={s.href}
              aria-label={s.label}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[var(--color-prime)]"
            >
              <Icon id={s.kind} className="text-2xl" />
            </a>
          ))}
      </div>
    </section>
  );
}
