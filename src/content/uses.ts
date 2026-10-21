export interface UsesItem {
  name: string;
  note: string;
}

export interface UsesGroup {
  title: string;
  items: UsesItem[];
}

export const uses: UsesGroup[] = [
  {
    title: "Hardware",
    items: [{ name: "MacBook", note: "My everyday machine, on macOS." }],
  },
  {
    title: "Editor & terminal",
    items: [
      { name: "VS Code", note: "My main editor." },
      {
        name: "Claude Code",
        note: "An AI pair programmer, in the terminal and inside VS Code.",
      },
      { name: "zsh + Oh My Zsh", note: "My shell." },
      {
        name: "GitHub CLI",
        note: "Pull requests and checks without leaving the terminal.",
      },
    ],
  },
  {
    title: "Tools",
    items: [
      { name: "Google Chrome", note: "Browser and DevTools." },
      { name: "Figma", note: "Designs and handoff." },
      { name: "Swagger UI", note: "Trying out API endpoints." },
      { name: "SigNoz", note: "Traces and logs for services in production." },
    ],
  },
  {
    title: "Backend",
    items: [
      {
        name: "FastAPI",
        note: "Async Python APIs, with SQLAlchemy and Alembic.",
      },
      { name: "PostgreSQL", note: "The database I reach for first." },
      {
        name: "Celery, RabbitMQ & Redis",
        note: "Background jobs that shouldn't block a request.",
      },
      { name: "Docker & GitHub Actions", note: "Builds and deploys." },
    ],
  },
  {
    title: "Frontend",
    items: [
      { name: "Next.js & React", note: "With TypeScript." },
      { name: "Tailwind CSS", note: "Styling." },
    ],
  },
  {
    title: "AI",
    items: [
      { name: "Gemini", note: "Answers and extraction in Legiflow." },
      { name: "LangChain", note: "LLM pipelines and retrieval." },
      { name: "OpenAI & OpenRouter", note: "Models for my side projects." },
    ],
  },
  {
    title: "This site",
    items: [
      {
        name: "Next.js 16 & React 19",
        note: "A static export, with view transitions between pages.",
      },
      { name: "Tailwind CSS 4", note: "Styling, with light and dark themes." },
      {
        name: "Vitest & Prettier",
        note: "Tests and formatting, checked before every deploy.",
      },
      { name: "GitHub Pages", note: "Hosting." },
      { name: "GoatCounter", note: "Cookie-free visitor stats." },
    ],
  },
];
