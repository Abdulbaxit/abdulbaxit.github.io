import type { NextConfig } from "next";


const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  typedRoutes: true,
  // Dev server only. It trusts localhost by default; opened at 127.0.0.1
  // the page's dev scripts were refused and it never became interactive.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
