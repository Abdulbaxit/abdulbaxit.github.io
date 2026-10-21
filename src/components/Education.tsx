import { SectionHeading } from "./SectionHeading";
import { Timeline } from "./Timeline";
import { certificates, education, leadership } from "@/content/profile";
import type { Credential } from "@/content/types";

function CredentialList({
  kicker,
  items,
}: {
  kicker: string;
  items: Credential[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="bento__tile" data-spotlight="" data-reveal="">
      <p className="bento__kicker">{kicker}</p>
      <ul className="credentials">
        {items.map((item) => (
          <li key={item.title}>
            <span className="credentials__title">{item.title}</span>
            <span className="credentials__from">{item.from}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Education() {
  if (education.length === 0) return null;

  return (
    <section id="education" className="mt-12 md:mt-32">
      <SectionHeading title="Education" subtitle="Where I studied" />
      <Timeline
        groups={education.map((entry) => ({
          name: entry.school,
          href: entry.href,
          entries: [
            {
              title: entry.degree,
              period: entry.period,
              summary: entry.summary,
              highlights: entry.highlights,
            },
          ],
        }))}
      />
      <div className="credentials-grid">
        <CredentialList kicker="Leadership & activities" items={leadership} />
        <CredentialList kicker="Certificates & training" items={certificates} />
      </div>
    </section>
  );
}
