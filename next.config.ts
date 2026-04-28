import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  /* config options here */
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      ["remark-mdx-images"]
    ],
  },
  extension: /\.(md|mdx)$/,
});

export default withMDX(nextConfig);
