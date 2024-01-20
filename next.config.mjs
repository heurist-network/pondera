import { env } from "./src/env.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: env.NEXT_OUTPUT || "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
