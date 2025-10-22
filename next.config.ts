import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  images: {
    unoptimized: true, // ✅ 關閉 Image 優化功能
  },
};

export default nextConfig;
