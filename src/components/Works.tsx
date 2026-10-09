import { SvgButton } from "./SvgButton";
import { InteractiveDiagram } from "./InteractiveDiagram";
import { projectsByCategory } from "@/content/projects";
import { diagrams } from "@/content/diagrams";
import { profile } from "@/content/profile";
import { asset } from "@/content/site";
import type { Project } from "@/content/types";

function Bar({ project, link }: { project: Project; link?: boolean }) {
  return (
    <div className="proj__bar">
      <div>
        <h4 className="proj__name">{project.name}</h4>
        <p className="proj__stack">{project.stack.join(" · ")}</p>
      </div>
      {link && project.href && (
        <a
          className="proj__visit"
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${project.name}`}
        >
          Visit ↗
        </a>
      )}
    </div>
  );
}

/**
 * Title sits in its own bar under the art, always visible: painted over
 * the art it collided with the diagrams' own labels.
 *
 * A gradient card is one link. A diagram card can't be, since its boxes
 * are interactive, so its link moves into the bar instead.
 */
function ProjectCard({ project }: { project: Project }) {
  const { visual } = project;

  if (visual.kind === "diagram") {
    return (
      <div className="proj">
        <InteractiveDiagram diagram={diagrams[visual.diagram]} />
        <Bar project={project} link />
      </div>
    );
  }

  const body = (
    <>
      <div
        className="proj__media"
        style={{
          background: `linear-gradient(140deg, ${visual.from}, ${visual.to})`,
        }}
      >
        {project.tag && <span className="proj__tag">{project.tag}</span>}
        {project.blurb && <p className="proj__blurb">{project.blurb}</p>}
      </div>
      <Bar project={project} />
    </>
  );

  return project.href ? (
    <a
      className="proj"
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {body}
    </a>
  ) : (
    <div className="proj">{body}</div>
  );
}

export function Works() {
  return (
    <section id="works" className="mt-12 md:mt-32">
      <h2
        className="text-3xl leading-none font-bold md:text-4xl"
        style={{ color: "var(--text-strong)" }}
      >
        My works
      </h2>
      <p className="mt-2 text-lg">A few of my past and present projects</p>
      <div className="kj-border" />

      {projectsByCategory().map((group) => (
        <div key={group.category}>
          <h3
            className="mt-6 text-2xl font-bold"
            style={{ color: "var(--text-strong)" }}
          >
            {group.category}
          </h3>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            {group.items.map((project) => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </div>
      ))}

      {profile.resumeHref && (
        <div className="mt-10 flex h-40 max-w-xl flex-col justify-center gap-3 px-5 shadow-2xl md:flex-row md:items-center md:justify-between md:gap-0 md:px-10">
          <p className="text-lg font-bold">I cook with these ingredients 👉</p>
          <SvgButton
            href={asset(profile.resumeHref)}
            label="MY RESUME"
            download
            ariaLabel="Download my resume"
          />
        </div>
      )}
    </section>
  );
}
