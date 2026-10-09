import type { MetadataRoute } from "next";
import { site, asset } from "@/content/site";
import { profile } from "@/content/profile";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: profile.name,
    description: "AI systems, LLM pipelines and full-stack applications.",
    start_url: asset("/"),
    display: "standalone",
    background_color: "#0d1017",
    theme_color: "#f2f0ee",
    // The "ab." mark on its dark tile, the same as the favicon.
    icons: [
      {
        src: asset("/assets/images/icon-192.png"),
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: asset("/assets/images/icon-512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
