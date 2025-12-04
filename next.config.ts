import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
  },
  images: {
    // Allow your CDNs + any other hosts you use
    remotePatterns: [
      { protocol: "https", hostname: "**.ufs.sh", pathname: "/**" },
      { protocol: "https", hostname: "utfs.io", pathname: "/**" },
      { protocol: "https", hostname: "cdn-icons-png.flaticon.com", pathname: "/**" },
    ],
    // Optional: disable all optimization in dev (helps avoid timeouts locally)
    // unoptimized: process.env.NODE_ENV !== "production",
  },
};

export default nextConfig;
