import type { Project } from "./types";

export const projects: Project[] = [
  {
    name: "Legiflow",
    stack: ["FastAPI", "Gemini", "Next.js"],
    category: "AI systems",
    visual: { kind: "diagram", diagram: "legiflow" },
  },
  {
    name: "LLM Evaluator",
    stack: ["FastAPI", "PostgreSQL", "Pytest"],
    category: "AI systems",
    visual: { kind: "diagram", diagram: "llm-evaluator" },
  },
  {
    name: "Happy Fish",
    stack: ["React", "Vite", "PostgreSQL"],
    category: "Web applications",
    href: "https://happyfish.voltade.com",
    tag: "Client work · access restricted",
    blurb:
      "Customer and subscription management for a live client platform — features across the frontend and an optimised PostgreSQL layer behind it.",
    visual: { kind: "gradient", from: "#4a6fb5", to: "#2f4a7d" },
  },
  {
    name: "Yat Guan",
    stack: ["Next.js", "Hono", "Drizzle"],
    category: "Web applications",
    href: "https://yatguan.voltade.com",
    tag: "Client work · access restricted",
    blurb:
      "Replaced a legacy ERP with a mobile-first portal covering inventory tracking and order fulfilment across the client's branches.",
    visual: { kind: "gradient", from: "#3f7a6d", to: "#26514a" },
  },
  {
    name: "Overmugged Portal",
    stack: ["React", "Node.js", "PostgreSQL"],
    category: "Web applications",
    href: "https://overmugged.voltade.com",
    tag: "Client work · access restricted",
    blurb:
      "Student bookings, resource delivery and internal comms in one dashboard, with role-based access replacing manual scheduling.",
    visual: { kind: "gradient", from: "#ab5838", to: "#743722" },
  },
  {
    name: "Implement AI",
    stack: ["FastAPI", "PostgreSQL", "Celery"],
    category: "Web applications",
    href: "https://implementai.io/",
    visual: { kind: "diagram", diagram: "implementai" },
  },
  {
    name: "Talkspresso",
    stack: ["Next.js", "React", "Node.js", "PostgreSQL"],
    category: "Web applications",
    href: "https://talkspresso.com/",
    tag: "Sole full-stack developer",
    blurb:
      "Booking and payments for coaches, consultants and freelancers: AI-generated sessions, Google and Microsoft calendar sync, and built-in video calls with recordings.",
    visual: { kind: "gradient", from: "#7a4f8a", to: "#4f3160" },
  },
];

export function projectsByCategory() {
  const groups = new Map<string, Project[]>();
  for (const project of projects) {
    const list = groups.get(project.category) ?? [];
    list.push(project);
    groups.set(project.category, list);
  }
  return Array.from(groups, ([category, items]) => ({ category, items }));
}
