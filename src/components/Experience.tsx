import { SectionHeading } from "./SectionHeading";
import { Timeline } from "./Timeline";
import { experience } from "@/content/profile";

export function Experience() {
  if (experience.length === 0) return null;

  return (
    <section id="experience" className="mt-12 md:mt-32">
      <SectionHeading title="Experience" subtitle="Where I’ve worked" />
      <Timeline
        groups={experience.map((job) => ({
          name: job.company,
          href: job.href,
          terms: job.terms,
          entries: job.roles,
        }))}
      />
    </section>
  );
}
