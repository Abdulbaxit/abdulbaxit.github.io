export type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; code: string; lang?: string };

export function parseProse(source: string): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];

  let paragraph: string[] = [];
  let list: string[] = [];
  let code: string[] | null = null;
  let codeLang: string | undefined;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ").trim() });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list.length) {
      blocks.push({ type: "list", items: list });
      list = [];
    }
  };
  const flushText = () => {
    flushParagraph();
    flushList();
  };

  for (const line of lines) {
    const fence = line.match(/^```(\w+)?\s*$/);

    if (fence) {
      if (code === null) {
        flushText();
        code = [];
        codeLang = fence[1];
      } else {
        blocks.push({ type: "code", code: code.join("\n"), lang: codeLang });
        code = null;
        codeLang = undefined;
      }
      continue;
    }

    if (code !== null) {
      code.push(line);
      continue;
    }

    if (!line.trim()) {
      flushText();
      continue;
    }

    if (line.startsWith("## ")) {
      flushText();
      blocks.push({ type: "heading", text: line.slice(3).trim() });
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      list.push(line.slice(2).trim());
      continue;
    }

    flushList();
    paragraph.push(line.trim());
  }

  if (code !== null) {
    blocks.push({ type: "code", code: code.join("\n"), lang: codeLang });
  }
  flushText();

  return blocks;
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${d} ${months[m - 1]} ${y}`;
}

export type Inline = { code: boolean; text: string };

export function parseInline(text: string): Inline[] {
  return text
    .split(/(`[^`]+`)/)
    .filter(Boolean)
    .map((part) =>
      part.startsWith("`") && part.endsWith("`") && part.length > 2
        ? { code: true, text: part.slice(1, -1) }
        : { code: false, text: part },
    );
}
