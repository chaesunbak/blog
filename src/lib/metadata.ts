import type { Metadata } from "next";
import { createAbsoluteUrl, siteConfig } from "@/lib/site";

function normalizePath(path: string) {
  return path || "/";
}

export function createPaginatedPath(path: string, page: number) {
  const url = new URL(normalizePath(path), siteConfig.url);

  if (page > 1) {
    url.searchParams.set("page", String(page));
  }

  return `${url.pathname}${url.search}`;
}

export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  keywords,
  images,
  type = "website",
  publishedTime,
  modifiedTime,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  images?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
}): Metadata {
  const canonicalPath = normalizePath(path);
  const url = createAbsoluteUrl(canonicalPath);
  const resolvedTitle = title ?? siteConfig.name;
  const resolvedImages = images?.length
    ? images.map((image) => ({
        url: image,
      }))
    : undefined;

  return {
    title,
    description,
    keywords,
    authors: [
      {
        name: siteConfig.author.name,
        url: siteConfig.author.url,
      },
    ],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    alternates: {
      canonical: canonicalPath,
    },
    robots: noIndex
      ? {
          index: false,
          follow: true,
          googleBot: {
            index: false,
            follow: true,
          },
        }
      : undefined,
    openGraph: {
      type,
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title: resolvedTitle,
      description,
      images: resolvedImages,
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime,
            authors: [siteConfig.author.name],
            tags: keywords,
          }
        : {}),
    },
    twitter: {
      card: resolvedImages?.length ? "summary_large_image" : "summary",
      title: resolvedTitle,
      description,
      images,
    },
  };
}
