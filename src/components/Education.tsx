import { SectionHeading } from "./SectionHeading";
import { Timeline } from "./Timeline";
import { education } from "@/content/profile";

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
    </section>
  );
}
