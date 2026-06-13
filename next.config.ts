import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: process.cwd(),
  reactStrictMode: true,
  // The limo white-label lives on limos.osis.co (comms-by-osis deploy).
  // Outreach links point at announcementsapp.com/limo, so forward there.
  async redirects() {
    return [
      { source: "/limo", destination: "https://limos.osis.co", permanent: false },
      { source: "/limo/:path*", destination: "https://limos.osis.co/:path*", permanent: false }
    ];
  }
};

export default nextConfig;
