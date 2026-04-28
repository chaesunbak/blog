import type { StaticImageData } from "next/image";

const siteUrl = "https://blog.chaesunbak.com";
const author = {
  type: "Person" as const,
  name: "chaesunbak",
  url: siteUrl,
  sameAs: ["https://github.com/chaesunbak"],
};

export const siteConfig = {
  name: "Chaesunbak 님의 블로그",
  description: "chaesunbak의 개발 기록과 생각을 정리하는 블로그",
  url: siteUrl,
  locale: "ko_KR",
  language: "ko",
  feedPath: "/rss.xml",
  searchPath: "/search",
  author,
};

export function createAbsoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function createSearchUrlTemplate() {
  return createAbsoluteUrl(`${siteConfig.searchPath}/{search_term_string}`);
}

export function resolveImageUrl(image?: StaticImageData | string) {
  if (!image) {
    return undefined;
  }

  const src = typeof image === "string" ? image : image.src;

  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  return createAbsoluteUrl(src);
}
