import type { MetadataRoute } from "next";
import { createAbsoluteUrl, siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/search/", "/search"],
      },
    ],
    sitemap: createAbsoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
