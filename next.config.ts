import type { NextConfig } from "next";
import createMDX from "@next/mdx";
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/feed",
        destination: "/rss.xml",
      },
      {
        source: "/rss",
        destination: "/rss.xml",
      },
    ];
  },
};

const withMDX = createMDX({
  // remark and rehype plugins are configured in src/lib/posts.ts via compileMDX
});

export default withMDX(nextConfig);
