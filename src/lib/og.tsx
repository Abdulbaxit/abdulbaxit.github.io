import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";
import { absoluteUrl, site } from "@/content/site";

export const OG_SIZE = { width: 1200, height: 630 };

export function ogImageMeta(path: string, alt: string) {
  return { url: absoluteUrl(path), ...OG_SIZE, alt, type: "image/png" };
}

const COLORS = {
  paper: "#f2f0ee",
  dark: "#2b2929",
  ink: "#58595b",
  muted: "#6b7280",
  bar: ["#e45447", "#e29d51", "#d8c7b8", "#607393"],
};

const fonts = Promise.all(
  ([400, 700, 900] as const).map(async (weight) => ({
    name: "Roboto",
    weight,
    style: "normal" as const,
    data: await readFile(
      join(
        process.cwd(),
        `src/app/fonts/og/roboto-latin-${weight}-normal.woff`,
      ),
    ),
  })),
);

function clip(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, text.lastIndexOf(" ", max)).replace(/[,.;:]$/, "")}…`;
}

export async function ogImage({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  const titleSize = title.length > 60 ? 58 : title.length > 32 ? 70 : 88;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: COLORS.paper,
        fontFamily: "Roboto",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "60px 80px 40px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 44,
              fontWeight: 900,
              color: COLORS.dark,
            }}
          >
            ab<span style={{ color: COLORS.bar[0] }}>.</span>
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: COLORS.muted,
            }}
          >
            {kicker}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: -1.5,
              color: COLORS.dark,
            }}
          >
            {title}
          </div>
          <div
            style={{
              width: 120,
              height: 6,
              marginTop: 28,
              borderRadius: 3,
              background: COLORS.bar[0],
            }}
          />
          <div
            style={{
              maxWidth: 980,
              marginTop: 28,
              fontSize: 28,
              lineHeight: 1.4,
              color: COLORS.ink,
            }}
          >
            {clip(description, 150)}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: COLORS.ink,
          }}
        >
          <div style={{ display: "flex", fontWeight: 700, color: COLORS.dark }}>
            {`${profile.name} · ${profile.role}`}
          </div>
          <div style={{ display: "flex" }}>{new URL(site.url).host}</div>
        </div>
      </div>

      <div style={{ display: "flex", height: 14 }}>
        {COLORS.bar.map((color) => (
          <div key={color} style={{ flex: 1, background: color }} />
        ))}
      </div>
    </div>,
    { ...OG_SIZE, fonts: await fonts },
  );
}
