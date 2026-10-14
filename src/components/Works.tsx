import Link from "next/link";
import type { Route } from "next";
import { SvgButton } from "./SvgButton";
import { Morph } from "./PageSlide";
import { InteractiveDiagram } from "./InteractiveDiagram";
import { SectionHeading } from "./SectionHeading";
import { projectsByCategory } from "@/content/projects";
import { diagrams } from "@/content/diagrams";
import { profile } from "@/content/profile";
import { asset } from "@/content/site";
import type { Project } from "@/content/types";

function caseStudyHref(project: Project) {
  return `/work/${project.slug}/` as Route;
}

function Bar({ project, links }: { project: Project; links?: boolean }) {
  return (
    <div className="proj__bar">
      <div>
        <Morph name={`project-title-${project.slug}`}>
          <h4 className="proj__name">{project.name}</h4>
        </Morph>
        <p className="proj__stack">{project.stack.join(" · ")}</p>
      </div>
      {links ? (
        <div className="proj__actions">
          <Link
            href={caseStudyHref(project)}
            transitionTypes={["nav-forward"]}
            className="proj__visit"
            aria-label={`${project.name} case study`}
          >
            Case study →
          </Link>
          {project.href && (
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
      ) : (
        <span className="proj__visit" aria-hidden="true">
          Case study →
        </span>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const { visual } = project;

  if (visual.kind === "diagram") {
    return (
      <div className="proj" data-spotlight="">
        <Morph name={`project-visual-${project.slug}`}>
          <InteractiveDiagram diagram={diagrams[visual.diagram]} />
        </Morph>
        <Bar project={project} links />
      </div>
    );
  }

  return (
    <Link
      className="proj"
      data-spotlight=""
      href={caseStudyHref(project)}
      transitionTypes={["nav-forward"]}
    >
      <Morph name={`project-visual-${project.slug}`}>
        <div
          className="proj__media"
          style={{
            background: `linear-gradient(140deg, ${visual.from}, ${visual.to})`,
          }}
        >
          {project.tag && <span className="proj__tag">{project.tag}</span>}
          {project.blurb && <p className="proj__blurb">{project.blurb}</p>}
        </div>
      </Morph>
      <Bar project={project} />
    </Link>
  );
}

export function Works() {
  return (
    <section id="works" className="mt-12 md:mt-32">
      <SectionHeading
        title="My works"
        subtitle="A few of my past and present projects"
      />

      {projectsByCategory().map((group) => (
        <div key={group.category}>
          <h3 className="mt-6 text-2xl font-bold text-strong">
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
