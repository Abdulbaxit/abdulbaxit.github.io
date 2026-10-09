import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Sprite } from "@/components/Sprite";
import { Shell } from "@/components/Shell";
import { Cursor } from "@/components/Cursor";
import { themeInitScript } from "@/components/ThemeToggle";
import { site, asset, absoluteUrl } from "@/content/site";
import { profile } from "@/content/profile";

// Self-hosted variable Roboto (latin subset). next/font emits the
// @font-face and the preload, and prefixes the URL with the basePath.
const roboto = localFont({
  src: "./fonts/roboto-latin-var.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-roboto",
});

/** The "ab." icon set; see the icons note in metadata below. */
const ICON_VERSION = 2;

const ogImage = {
  url: absoluteUrl("/assets/images/og.png"),
  width: 1200,
  height: 630,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${profile.name}`,
  },
  description: site.description,
  authors: [{ name: profile.name }],
  alternates: { canonical: absoluteUrl("/") },
  // Declaring any icon here turns off the automatic app/favicon.ico tag,
  // so the favicon is listed explicitly too. Browsers cache icons hard:
  // bump ?v= whenever the icon changes so returning visitors get it.
  icons: {
    icon: asset(`/favicon.ico?v=${ICON_VERSION}`),
    apple: asset(`/assets/images/apple-touch-icon.png?v=${ICON_VERSION}`),
  },
  openGraph: {
    type: "website",
    siteName: profile.name,
    title: site.title,
    description: site.shortDescription,
    url: absoluteUrl("/"),
    locale: site.locale,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: "I build AI systems, LLM pipelines and full-stack applications.",
    images: [ogImage.url],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f0ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1017" },
  ],
  // Lets the dock clear the home indicator via env(safe-area-inset-bottom).
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={roboto.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <Sprite />
        <Shell>{children}</Shell>
        <Cursor />
      </body>
    </html>
  );
}
