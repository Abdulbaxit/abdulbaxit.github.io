import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "legiflow",
    name: "Legiflow",
    stack: ["FastAPI", "Gemini", "Next.js"],
    category: "AI systems",
    visual: { kind: "diagram", diagram: "legiflow" },
    caseStudy: {
      summary:
        "AI for legal documents: lawyers upload case files and ask questions that are answered only from that case, with citations.",
      role: "Associate Software Engineer, Devsarch",
      problem:
        "Lawyers were reviewing case documents by hand. A chatbot could speed that up, but only if it never mixed one case with another: an answer drawn from the wrong case file is worse than no answer at all. So the hard requirement was that a question could only ever be answered from the case file in scope.",
      built: [
        "Entity extraction that pulls the structure out of each document into structured storage",
        "Chunking and embeddings stored in PostgreSQL, every chunk tagged with its case file",
        "Retrieval scoped to a single case file, so no passage from another case can reach the answer",
        "Answers written by Gemini from the retrieved passages, each with a citation the lawyer can check",
        "A FastAPI backend, a Next.js app for lawyers, and case files in Wasabi or S3 storage",
      ],
      results: [
        "Reduced manual review time by 40%",
        "Processes 1,000+ PDFs a month",
        "Every answer cites its source in the case file, so it can be verified instead of trusted",
      ],
      note: "keeping-a-rag-chatbot-inside-one-case-file",
    },
  },
  {
    slug: "llm-evaluator",
    name: "LLM Evaluator",
    stack: ["FastAPI", "PostgreSQL", "Pytest"],
    category: "AI systems",
    visual: { kind: "diagram", diagram: "llm-evaluator" },
    caseStudy: {
      summary:
        "Evaluation pipelines that grade tool-calling models on what they did to the database, not on what they said.",
      role: "Associate Software Engineer, Devsarch · client: Turing",
      problem:
        "When a model can call tools that write to a database, what it says and what it does can drift apart. A response can read perfectly while the tool call underneath wrote the wrong row, or wrote two. Grading the transcript rewards the description of the work, not the work.",
      built: [
        "A snapshot of the database before each run",
        "Runs of the model with its tool calls, through the real code path",
        "A second snapshot after the run, diffed against the first",
        "Assertions that the expected changes happened and nothing else changed",
        "A regression gate: a model or prompt change ships only if every assertion still holds",
      ],
      results: [
        "Ran 50+ LLM evaluation pipelines",
        "Maintained 95%+ evaluation accuracy",
        "Model output judged against database state instead of a transcript",
      ],
      note: "testing-llm-tool-calls-against-the-database",
    },
  },
  {
    slug: "doorman-game",
    name: "The Doorman Game",
    stack: ["FastAPI", "React", "Llama"],
    category: "AI systems",
    href: "https://github.com/Abdulbaxit/club-gatekeeper-ai",
    visual: { kind: "diagram", diagram: "doorman" },
    caseStudy: {
      summary:
        "A two-agent LLM game: talk your way past an AI doorman while a hidden judge model scores every message.",
      role: "Personal project",
      problem:
        "A persuasion game needs two jobs done well at once: a doorman who stays in character, and a fair judge of how convincing each message is. Asking one model to do both mixes them up, so the game splits the roles between two models.",
      built: [
        "Arthur, the doorman: a Llama 3.1 8B persona with a hidden profile of values, soft spots and triggers",
        "A judge on Llama 3.3 70B that scores each message from −6 to +6 against that profile and returns strict JSON",
        "An influence meter: reach +30 to get in, fall to −30 and you are turned away",
        "Conversation memory that keeps the last 16 messages and summarises older ones",
        "Guards against prompt injection, fallback models, and game sessions saved to disk",
        "A FastAPI backend calling the models through OpenRouter, with a React and Vite frontend",
      ],
      results: [
        "Two models with separate roles in one conversation",
        "Attempts to reveal or override the rules are ignored by design",
        "Open source on GitHub",
      ],
    },
  },
  {
    slug: "happy-fish",
    name: "Happy Fish",
    stack: ["React", "Vite", "PostgreSQL"],
    category: "Web applications",
    href: "https://happyfish.voltade.com",
    tag: "Client work · access restricted",
    blurb:
      "Customer and subscription management for a live client platform — features across the frontend and an optimised PostgreSQL layer behind it.",
    visual: { kind: "gradient", from: "#4a6fb5", to: "#2f4a7d" },
    caseStudy: {
      summary:
        "Customer and subscription management for a live client platform, built at Voltade.",
      role: "Full Stack Engineer, Voltade · client work",
      problem:
        "A live client platform needed customer and subscription management, with a fast PostgreSQL layer behind it.",
      built: [
        "Customer and subscription management features on a React, Vite and Mantine frontend",
        "APIs on Hono and Node.js",
        "An optimised PostgreSQL layer behind it, using Drizzle ORM",
      ],
      results: [
        "Shipped to production for a live client platform",
        "Part of 20+ production features delivered across three Voltade client projects",
      ],
    },
  },
  {
    slug: "yat-guan",
    name: "Yat Guan",
    stack: ["Next.js", "Hono", "Drizzle"],
    category: "Web applications",
    href: "https://yatguan.voltade.com",
    tag: "Client work · access restricted",
    blurb:
      "Replaced a legacy ERP with a mobile-first portal covering inventory tracking and order fulfilment across the client's branches.",
    visual: { kind: "gradient", from: "#3f7a6d", to: "#26514a" },
    caseStudy: {
      summary:
        "A mobile-first portal that replaced a client's legacy ERP for inventory and orders across its branches.",
      role: "Full Stack Engineer, Voltade · client work",
      problem:
        "The client ran inventory and orders across its branches on a legacy ERP, and needed a mobile-first replacement.",
      built: [
        "A mobile-first portal on Next.js",
        "Inventory tracking and order fulfilment across the client's branches",
        "APIs on Hono, with Drizzle ORM on PostgreSQL",
      ],
      results: [
        "Replaced the legacy ERP",
        "Part of 20+ production features delivered across three Voltade client projects",
      ],
    },
  },
  {
    slug: "overmugged-portal",
    name: "Overmugged Portal",
    stack: ["React", "Node.js", "PostgreSQL"],
    category: "Web applications",
    href: "https://overmugged.voltade.com",
    tag: "Client work · access restricted",
    blurb:
      "Student bookings, resource delivery and internal comms in one dashboard, with role-based access replacing manual scheduling.",
    visual: { kind: "gradient", from: "#ab5838", to: "#743722" },
    caseStudy: {
      summary:
        "One dashboard for student bookings, resource delivery and internal comms, built at Voltade.",
      role: "Full Stack Engineer, Voltade · client work",
      problem:
        "Student bookings, resources and internal communication needed one home, and scheduling was done by hand.",
      built: [
        "Student bookings, resource delivery and internal comms in one dashboard",
        "Role-based access, so each user sees what their role needs",
        "A React frontend with Node.js APIs and PostgreSQL",
      ],
      results: [
        "Replaced manual scheduling",
        "Part of 20+ production features delivered across three Voltade client projects",
      ],
    },
  },
  {
    slug: "implement-ai",
    name: "Implement AI",
    stack: ["FastAPI", "PostgreSQL", "Celery"],
    category: "Web applications",
    href: "https://implementai.io/",
    visual: { kind: "diagram", diagram: "implementai" },
    caseStudy: {
      summary:
        "The production backend for an AI platform: async FastAPI, background jobs and Stripe billing, shipped with Docker and GitHub Actions.",
      role: "Software Engineer, Techanzy",
      problem:
        "Implement AI needed a backend that could serve organisations, teams and billing reliably, while keeping slow work out of the request cycle.",
      built: [
        "Async FastAPI on async SQLAlchemy and PostgreSQL, with every schema change as an Alembic migration",
        "JWT auth and role-based access checked on every route",
        "REST APIs across organisations, Stripe billing webhooks, documents, CRM/teams and scheduling",
        "Background jobs on Celery with RabbitMQ and Redis, so slow work never blocks a response",
        "Docker images deployed through GitHub Actions",
      ],
      results: [
        "Serves 500+ API requests a day",
        "15+ REST endpoints across the product's areas",
      ],
    },
  },
  {
    slug: "talkspresso",
    name: "Talkspresso",
    stack: ["Next.js", "React", "Node.js", "PostgreSQL"],
    category: "Web applications",
    href: "https://talkspresso.com/",
    tag: "Sole full-stack developer",
    blurb:
      "Booking and payments for coaches, consultants and freelancers: AI-generated sessions, Google and Microsoft calendar sync, and built-in video calls with recordings.",
    visual: { kind: "gradient", from: "#7a4f8a", to: "#4f3160" },
    caseStudy: {
      summary:
        "An AI-powered booking and payments platform for coaches, consultants and freelancers, built end to end as the only developer.",
      role: "Sole full-stack developer",
      problem:
        "Coaches, consultants and freelancers need session creation, calendars, video calls and payments. Talkspresso puts all of them in one place.",
      built: [
        "The frontend UI and the backend services",
        "AI-driven session generation",
        "Calendar sync with Google and Microsoft",
        "Built-in video calls and session recordings",
        "Payment processing and automated CI/CD workflows",
      ],
      results: [
        "Built and shipped as the only developer",
        "Live at talkspresso.com",
      ],
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function projectsByCategory() {
  const groups = new Map<string, Project[]>();
  for (const project of projects) {
    const list = groups.get(project.category) ?? [];
    list.push(project);
    groups.set(project.category, list);
  }
  return Array.from(groups, ([category, items]) => ({ category, items }));
}
