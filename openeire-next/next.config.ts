import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  async redirects() {
    return [
      {
        source: "/500",
        destination: "/server-error",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
