import { describe, expect, it } from "vitest";
import { diagrams } from "./diagrams";
import { getNote, notes } from "./notes";
import {
  certificates,
  education,
  experience,
  leadership,
  isCurrentRole,
  profile,
  recommendations,
} from "./profile";
import { getProject, projects, projectsByCategory } from "./projects";
import { absoluteUrl, asset, site } from "./site";

describe("diagrams", () => {
  for (const [key, diagram] of Object.entries(diagrams)) {
    describe(key, () => {
      const nodeIds = diagram.nodes.map((n) => n.id);
      const edgeIds = diagram.edges.map((e) => e.id);

      it("is keyed by its own id", () => {
        expect(diagram.id).toBe(key);
      });

      it("has unique node and edge ids", () => {
        expect(new Set(nodeIds).size).toBe(nodeIds.length);
        expect(new Set(edgeIds).size).toBe(edgeIds.length);
      });

      it("only walks through nodes and edges that exist", () => {
        for (const step of diagram.flow) {
          expect(nodeIds).toContain(step.node);
          for (const edge of step.edges ?? []) expect(edgeIds).toContain(edge);
        }
      });
    });
  }
});

describe("projects", () => {
  it("have unique, URL-safe slugs that find them", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const p of projects) {
      expect(p.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(getProject(p.slug)).toBe(p);
    }
    expect(getProject("missing")).toBeUndefined();
  });

  it("each tell a full case study", () => {
    for (const { caseStudy: c } of projects) {
      expect(c.summary.length).toBeGreaterThan(30);
      expect(c.role).toBeTruthy();
      expect(c.problem.length).toBeGreaterThan(30);
      expect(c.built.length).toBeGreaterThan(0);
      expect(c.results.length).toBeGreaterThan(0);
    }
  });

  it("only link to notes that exist", () => {
    for (const { caseStudy: c } of projects) {
      if (c.note) expect(getNote(c.note)).toBeDefined();
    }
  });

  it("each have a name, a category and a stack", () => {
    for (const p of projects) {
      expect(p.name).toBeTruthy();
      expect(p.category).toBeTruthy();
      expect(p.stack.length).toBeGreaterThan(0);
    }
  });

  it("group by category in order of first appearance, losing none", () => {
    const groups = projectsByCategory();
    expect(groups.map((g) => g.category)).toEqual([
      ...new Set(projects.map((p) => p.category)),
    ]);
    expect(groups.flatMap((g) => g.items)).toHaveLength(projects.length);
  });
});

describe("notes", () => {
  it("have unique, URL-safe slugs", () => {
    const slugs = notes.map((n) => n.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("have real ISO dates, newest first", () => {
    for (const n of notes) {
      expect(n.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(n.date))).toBe(false);
    }
    const dates = notes.map((n) => n.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it("can each be found by slug", () => {
    for (const n of notes) expect(getNote(n.slug)).toBe(n);
    expect(getNote("missing")).toBeUndefined();
  });
});

describe("experience", () => {
  const period = /^[A-Z][a-z]{2} \d{4} — ([A-Z][a-z]{2} \d{4}|present)$/;

  it("writes every period the same way", () => {
    for (const job of experience)
      for (const role of job.roles) expect(role.period).toMatch(period);
    for (const entry of education) expect(entry.period).toMatch(period);
  });

  it("lists each company's roles newest first", () => {
    const start = (p: string) => Date.parse(`1 ${p.split(" — ")[0]}`);
    for (const job of experience) {
      const starts = job.roles.map((r) => start(r.period));
      expect(starts).toEqual([...starts].sort((a, b) => b - a));
    }
  });

  it("lists companies with a current role first", () => {
    const current = experience.map((job) => job.roles.some(isCurrentRole));
    expect(current).toEqual([...current].sort((a, b) => Number(b) - Number(a)));
  });

  it("recognises a running role", () => {
    const role = { title: "", summary: "" };
    expect(isCurrentRole({ ...role, period: "Oct 2025 — present" })).toBe(true);
    expect(isCurrentRole({ ...role, period: "Mar 2025 — Apr 2026" })).toBe(
      false,
    );
  });
});

describe("credentials", () => {
  it("each name a title and where it is from", () => {
    for (const c of [...leadership, ...certificates]) {
      expect(c.title).toBeTruthy();
      expect(c.from).toBeTruthy();
    }
  });
});

describe("profile", () => {
  it("links every social to a web or mail address", () => {
    for (const s of profile.socials)
      expect(s.href).toMatch(/^(https:|mailto:)/);
  });

  it("names a Cal.com event as user/slug", () => {
    if (profile.calLink) expect(profile.calLink).toMatch(/^[\w-]+\/[\w-]+$/);
  });

  it("quotes people by name and role", () => {
    for (const r of recommendations) {
      expect(r.quote.length).toBeGreaterThan(20);
      expect(r.name).toBeTruthy();
      expect(r.role).toBeTruthy();
    }
  });
});

describe("site", () => {
  it("has a public URL without a trailing slash", () => {
    expect(site.url).toMatch(/^https:\/\/[^/]+$/);
  });

  it("builds asset paths and absolute URLs", () => {
    expect(asset("/cv.pdf")).toBe(`${site.basePath}/cv.pdf`);
    expect(asset("cv.pdf")).toBe(`${site.basePath}/cv.pdf`);
    expect(absoluteUrl()).toBe(`${site.url}/`);
    expect(absoluteUrl("notes/a/")).toBe(`${site.url}/notes/a/`);
  });
});
