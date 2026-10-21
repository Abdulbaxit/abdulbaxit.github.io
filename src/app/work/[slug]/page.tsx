import type { Metadata, Route } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Sprite";
import { InteractiveDiagram } from "@/components/InteractiveDiagram";
import { ProjectScene } from "@/components/ProjectScene";
import { Morph, PageSlide } from "@/components/PageSlide";
import { projects, getProject } from "@/content/projects";
import { diagrams } from "@/content/diagrams";
import { getNote } from "@/content/notes";
import { profile } from "@/content/profile";
import { absoluteUrl } from "@/content/site";
import { ogImageMeta } from "@/lib/og";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const url = absoluteUrl(`/work/${project.slug}/`);
  const title = `${project.name} case study`;
  const description = project.caseStudy.summary;
  const image = ogImageMeta(`/og/work-${project.slug}.png`, title);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: profile.name,
      title,
      description,
      url,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { caseStudy: study, visual } = project;
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  const note = study.note ? getNote(study.note) : undefined;
  const steps = visual.kind === "diagram" ? diagrams[visual.diagram].flow : [];
  const url = absoluteUrl(`/work/${project.slug}/`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: study.summary,
    url,
    keywords: project.stack.join(", "),
    author: {
      "@type": "Person",
      "@id": absoluteUrl("/#person"),
      name: profile.name,
      url: absoluteUrl("/"),
    },
  };

  return (
    <PageSlide>
      <article className="case mt-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Link
          href="/#works"
          transitionTypes={["nav-back"]}
          className="f-link text-sm"
        >
          <Icon id="arrow-left" className="mr-1" />
          All projects
        </Link>

        <header className="mt-8 max-w-3xl">
          <p className="note__meta">
            {project.category}
            <span className="note__tag">Case study</span>
          </p>
          <Morph name={`project-title-${project.slug}`}>
            <h1 className="note__title">{project.name}</h1>
          </Morph>
          <div className="section-rule" />
          <p className="note__lede">{study.summary}</p>
        </header>

        <dl className="case__facts">
          <div>
            <dt>Role</dt>
            <dd>{study.role}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{project.stack.join(" · ")}</dd>
          </div>
          {project.href && (
            <div>
              <dt>Live</dt>
              <dd>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="f-link font-bold"
                >
                  {new URL(project.href).host.replace(/^www\./, "")} ↗
                </a>
              </dd>
            </div>
          )}
        </dl>

        <Morph name={`project-visual-${project.slug}`}>
          {visual.kind === "diagram" ? (
            <div className="case__visual case__visual--diagram">
              <InteractiveDiagram diagram={diagrams[visual.diagram]} />
            </div>
          ) : (
            <div
              className="case__visual case__visual--scene"
              style={{
                background: `linear-gradient(140deg, ${visual.from}, ${visual.to})`,
              }}
            >
              <ProjectScene
                scene={visual.scene}
                accent={visual.from}
                label={project.blurb}
              />
              {project.tag && <span className="proj__tag">{project.tag}</span>}
            </div>
          )}
        </Morph>

        <div className="prose case__body">
          <h2>The problem</h2>
          <p>{study.problem}</p>

          <h2>What I built</h2>
          <ul>
            {study.built.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {steps.length > 0 && (
            <>
              <h2>How it works</h2>
              <ol className="case__steps">
                {steps.map((step) => (
                  <li key={step.caption}>{step.caption}</li>
                ))}
              </ol>
            </>
          )}

          <h2>Results</h2>
          <ul className="case__results">
            {study.results.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {note && (
            <p className="case__note">
              More on this in the note{" "}
              <Link
                href={`/notes/${note.slug}/` as Route}
                transitionTypes={["nav-forward"]}
                className="f-link font-bold"
              >
                {note.title}
              </Link>
              .
            </p>
          )}
        </div>

        <footer className="note__foot">
          <Link
            href="/#works"
            transitionTypes={["nav-back"]}
            className="f-link"
          >
            All projects
          </Link>
          <Link
            href={`/work/${next.slug}/` as Route}
            transitionTypes={["nav-forward"]}
            className="f-link font-bold"
          >
            Next: {next.name} →
          </Link>
        </footer>
      </article>
    </PageSlide>
  );
}
