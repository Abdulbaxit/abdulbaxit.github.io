/**
 * A deliberately small block parser for post bodies. Enough structure for
 * headings, lists and code without pulling in an MDX toolchain that would
 * then need wiring into static export.
 */

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

  // An unterminated fence still yields its content rather than vanishing.
  if (code !== null) {
    blocks.push({ type: "code", code: code.join("\n"), lang: codeLang });
  }
  flushText();

  return blocks;
}

/** "2026-09-18" -> "18 September 2026", stable regardless of server locale. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${d} ${months[m - 1]} ${y}`;
}

export type Inline = { code: boolean; text: string };

/** Splits a run of text on `backticks` into plain and inline-code parts. */
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
