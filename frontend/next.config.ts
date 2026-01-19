import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    // Tự động loại bỏ tất cả console.log, console.warn, console.error trong bản build production
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
