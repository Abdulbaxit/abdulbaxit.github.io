# Abdul Basit — Personal Portfolio

Personal portfolio of Abdul Basit, Software Engineer: AI systems, LLM pipelines,
and full-stack applications.

**Live:** [abdulbaxit.github.io](https://abdulbaxit.github.io/)

The homepage layout follows the structure of [kenjimmy.xyz](https://kenjimmy.xyz/)
(white card on warm paper, Roboto, coral accent), with original content, portrait
and project art.

## Tech

Next.js 16 (App Router, static export), React 19, Tailwind CSS 4, TypeScript.
Deployed to GitHub Pages by GitHub Actions.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export into ./out
npm run lint
```

## Where the content lives

Every fact the site renders comes from `src/content/`. Changing a detail should
not mean touching a component.

| File | What it holds |
|---|---|
| `src/content/site.ts` | Public URL, title, description |
| `src/content/profile.ts` | Name, role, tagline, email, socials, hero stack, contact reasons, Cal.com link, skills, impact figures, status lines, bio |
| `src/content/projects.ts` | Works cards, grouped by `category` |
| `src/content/notes.ts` | Technical notes, each at `/notes/<slug>/` |
| `src/content/diagrams.ts` | The interactive architecture diagrams on the Works cards |
| `src/content/types.ts` | The shape of all of the above |

Also in `profile.ts`: `calLink` (the dock's **Book a call** pill),
`availability` (the hero badge), `recommendations` (quotes; the section
stays hidden while the list is empty, so only add ones you have permission
to publish) and `github` (the activity section).

`/llms.txt` is generated from the same content, as a plain summary for AI
assistants and AI search.

## Structure

```
Hero          name, role · location, stack, "Email me" disc, portrait
Tool strip    the stack I work with, scrolling under the hero
Skills        backend / frontend + scroll-assembled illustration
Readme        impact figures, status lines, fun fact, bio
Experience    timeline of roles, current ones highlighted
Works         project cards with interactive architecture diagrams, resume
Kind words    recommendations (hidden until there are some)
Notes         short technical write-ups
On GitHub     contribution heatmap, rebuilt daily
Contact       email, links, local time in Lahore
Dock          floating nav: sections, resume, Book a call
```

## Design system

`src/app/globals.css` holds the Tailwind theme and imports the rules, which
live in `src/app/styles/`: one file per part of the page, imported in cascade
order. Light and dark both paint through the `--surface-*` / `--text-*`
variables in `styles/tokens.css`, so a new surface only needs defining in its
`:root` and `.dark` blocks. Components reach them through the `text-strong`,
`text-body`, `text-muted`, `bg-surface` and `bg-raised` utilities, and every
section title goes through `SectionHeading`.

| Token | Value |
|---|---|
| Paper | `#f2f0ee` |
| Card | `#ffffff` |
| Ink | `#58595b` |
| Accent | `#e45447` |
| Gold / secondary | `#e29d51` / `#607393` |
| Night | `#0d1017` |
| Type | Self-hosted variable Roboto via `next/font/local`, 16px body |

Motion (decoding headings, magnetic buttons, the name ripple, count-ups, the
timeline fill, the cursor and the theme reveal) lives in `PageMotion` and the
small client components beside it. All of it stands down under
`prefers-reduced-motion`.

## Deploying

Every push to `main`, and a daily scheduled run, triggers
`.github/workflows/deploy.yml`, which builds the static export and publishes
`./out` to GitHub Pages. The daily run keeps the GitHub section current. The workflow derives the
base path from the repo name. This repo is the user site `abdulbaxit.github.io`,
so it serves from the root; old `/portfolio/…` links are forwarded by the
404 page.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub
Actions**. With "Deploy from a branch" Pages would serve the source instead of
the build.

## Contact

- **Email:** abasita33@gmail.com
- **LinkedIn:** [Abdul Basit](https://www.linkedin.com/in/abdul-basit-761062199/)
- **GitHub:** [Abdulbaxit](https://github.com/Abdulbaxit)
